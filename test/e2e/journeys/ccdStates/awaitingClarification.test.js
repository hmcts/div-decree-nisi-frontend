const { journey, sinon } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-case/mock-case');
const config = require('config');

const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const petitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const Entry = require('steps/entry/Entry.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const Done = require('steps/done/Done.step');
const CourtFeedback = require('steps/court-feedback/CourtFeedback.step');

const feesAndPaymentsService = require('services/feesAndPaymentsService');

const session = {
  respDefendsDivorce: null
};

describe('Case State: AwaitingClarification - feature AwaitingClarification is off', () => {
  const sandbox = sinon.createSandbox();
  before(() => {
    sandbox.stub(config, 'features').value({
      awaitingClarification: false
    });

    const getStub = sinon.stub(request, 'get');
    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, {
        state: 'AwaitingClarification',
        data: session
      }));

    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  after(() => {
    request.get.restore();
    feesAndPaymentsService.getFee.restore();
    sandbox.restore();
  });

  journey.test([
    { step: Start },
    { step: IdamLogin, body: { success: 'yes' } },
    { step: Entry },
    { step: petitionProgressBar }
  ]);
});

describe('Case State: AwaitingClarification - feature AwaitingClarification is on', () => {
  const sandbox = sinon.createSandbox();
  let caseOrchestrationServiceSubmitStub = {};

  before(() => {
    sandbox.stub(config, 'features').value({
      awaitingClarification: true
    });

    const getStub = sinon.stub(request, 'get');
    const postStub = sinon.stub(request, 'post');

    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, {
        state: 'AwaitingClarification',
        data: session
      }));

    caseOrchestrationServiceSubmitStub = postStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.submitCaseUrl}/${mockCaseResponse.caseId}`
      }));
    caseOrchestrationServiceSubmitStub.resolves();

    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  after(() => {
    request.get.restore();
    request.post.restore();
    feesAndPaymentsService.getFee.restore();
    sandbox.restore();
  });

  journey.test([
    { step: Start },
    { step: IdamLogin, body: { success: 'yes' } },
    { step: Entry },
    { step: petitionProgressBar },
    { step: CourtFeedback, body: { response: 'some details' } },
    { step: ShareCourtDocuments, body: { upload: 'no' } },
    { step: CheckYourAnswers, body: { statementOfTruth: 'yes' } },
    { step: Done }
  ]);

  it('submits correct body to case orchestration service', () => {
    const body = {
      clarificationResponse: 'some details',
      statementOfTruth: 'yes',
      uploadAnyOtherDocuments: 'no'
    };
    sinon.assert.calledWith(caseOrchestrationServiceSubmitStub, sinon.match.has('body', body));
  });
});
