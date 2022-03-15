const { journey, sinon } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-case/mock-case');
const config = require('config');

const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const petitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const LivedApartSinceSeparation = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.step'
);
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const Done = require('steps/done/Done.step');
const Entry = require('steps/entry/Entry.step');

const feesAndPaymentsService = require('services/feesAndPaymentsService');

const session = {
  respWillDefendDivorce: null,
  permittedDecreeNisiReason: '1'
};

let caseOrchestrationServiceSubmitStub = {};

describe('Case State : DNAwaiting, permittedDecreeNisiReason: 1', () => {
  before(() => {
    const getStub = sinon.stub(request, 'get');
    const postStub = sinon.stub(request, 'post');

    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, { state: 'AwaitingDecreeNisi', data: session }));

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
  });


  journey.test([
    { step: Start },
    { step: IdamLogin, body: { success: 'yes' } },
    { step: Entry },
    { step: petitionProgressBar },
    { step: ApplyForDecreeNisi, body: { applyForDecreeNisi: 'yes' } },
    {
      step: MiniPetition,
      body: {
        'changes.hasBeenChanges': 'no',
        'changes.statementOfTruthNoChanges': 'yes'
      }
    },
    { step: LivedApartSinceSeparation, body: { 'changes.livedApartSinceSeparation': 'yes' } },
    { step: ClaimCosts, body: { 'dnCosts.claimCosts': 'originalAmount' } },
    { step: ShareCourtDocuments, body: { upload: 'no' } },
    { step: CheckYourAnswers, body: { statementOfTruth: 'yes' } },
    { step: Done }
  ]);

  it('submits correct body to case orchestration service', () => {
    const body = {
      statementOfTruth: 'yes'
    };
    sinon.assert.calledWith(caseOrchestrationServiceSubmitStub, sinon.match.has('body', body));
  });
});
