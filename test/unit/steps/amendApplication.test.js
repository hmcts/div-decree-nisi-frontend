const modulePath = 'steps/amend-application/AmendApplication.step';

const AmendApplication = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content,
  expect, stepAsInstance } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(caseOrchestrationService, 'amendApplication');
    sinon.stub(redirectToFrontendHelper, 'redirectToFrontendAmend');
  });

  afterEach(() => {
    idam.protect.restore();
    caseOrchestrationService.amendApplication.restore();
    redirectToFrontendHelper.redirectToFrontendAmend.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(AmendApplication, [idam.protect()]);
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
