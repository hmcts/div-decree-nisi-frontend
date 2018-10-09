const modulePath = 'steps/undefended/Undefended.step';

const Undefended = require(modulePath);

const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const getSteps = require('steps');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const cosMiddleware = require('middleware/caseOrchestrationMiddleware');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(Undefended, [
      idam.protect(),
      cosMiddleware.getApplication
    ]);
  });

  it('rediects to ApplyForDecreeNisi when CCD has respDefendsDivorce as null', () => {
    const getApplicationResponse = {
      case: {
        respDefendsDivorce: null
      }
    };
    sinon.stub(cosMiddleware, 'getApplication').resolves(getApplicationResponse);
    interstitial.navigatesToNext(Undefended, ApplyForDecreeNisi, getSteps());
    cosMiddleware.getApplication.restore();
  });

  it('redirects reviewAosResponse when CCD has respDefendsDivorce as Yes', () => {
    const getApplicationResponse = {
      case: {
        respDefendsDivorce: 'Yes'
      }
    };
    sinon.stub(cosMiddleware, 'getApplication').resolves(getApplicationResponse);
    interstitial.navigatesToNext(Undefended, ReviewAosResponse, getSteps());
    cosMiddleware.getApplication.restore();
  });

  it('renders the content', () => {
    const session = { case: { data: {}, caseId: '1234' } };
    return content(Undefended, session);
  });
});
