const modulePath = 'steps/amend-application/AmendApplication.step';

const AmendApplication = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content,
  expect, stepAsInstance } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');

const feesAndPaymentsService = require('services/feesAndPaymentsService');
const { feeTypes } = require('middleware/feesAndPaymentsMiddleware');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(caseOrchestrationService, 'amendApplication');
    sinon.stub(redirectToFrontendHelper, 'redirectToFrontendAmend');
    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    caseOrchestrationService.amendApplication.restore();
    redirectToFrontendHelper.redirectToFrontendAmend.restore();
    feesAndPaymentsService.getFee.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(AmendApplication, [idam.protect()]);
  });

  it('getFeeFromFeesAndPayments middleware call', () => { // eslint-disable-line max-len
    const session = {
      case: {
        data: {
          connections: {}
        }
      }
    };
    return content(
      AmendApplication,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledWith(feesAndPaymentsService.getFee, feeTypes.amendFee);
    });
  });

  it('renders the content', () => {
    const ignoreContent = ['continue'];
    const session = { case: { data: {} } };
    const specificContent = [
      'start',
      'amendmentFee',
      'ifYouWantYour',
      'notAbleToRead'
    ];
    return content(AmendApplication, session, { specificContent, ignoreContent });
  });

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
