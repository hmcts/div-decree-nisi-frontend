const { journey, middleware, sinon,
  expect, stepAsInstance } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-case/mock-case');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');
const idam = require('services/idam');

const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const Entry = require('steps/entry/Entry.step');
const PetitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const AmendApplication = require('steps/amend-application/AmendApplication.step.js');


const feesAndPaymentsService = require('services/feesAndPaymentsService');

const session = {
  reasonForDivorce: 'separation-2-years',
  respAdmitOrConsentToFact: 'No',
  respWillDefendDivorce: 'No'

};


describe('Case State : AosCompleted', () => {
  before(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(caseOrchestrationService, 'amendApplication');
    sinon.stub(redirectToFrontendHelper, 'redirectToFrontendAmend');
    const getStub = sinon.stub(request, 'get');

    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, { state: 'AosCompleted',
        data: session }));

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
    idam.protect.restore();
    caseOrchestrationService.amendApplication.restore();
    redirectToFrontendHelper.redirectToFrontendAmend.restore();
    feesAndPaymentsService.getFee.restore();
  });

  journey.test([
    { step: Start },
    { step: IdamLogin, body: { success: 'yes' } },
    { step: Entry },
    { step: PetitionProgressBar },
    { step: ReviewAosResponse, body: { reviewAosResponse: 'yes' } },
    { step: AmendApplication }
  ]);

  it('Sends request to amend endpoint and redirects to PFE', done => {
    const step = stepAsInstance(AmendApplication, {
    });
    caseOrchestrationService.amendApplication.resolves();
    step.next().redirect().then(() => {
      expect(caseOrchestrationService.amendApplication.calledOnce).to.eql(true);
      expect(redirectToFrontendHelper.redirectToFrontendAmend.calledOnce).to.eql(true);
      done();
    }).catch(error => {
      done(error);
    });
  });
});
