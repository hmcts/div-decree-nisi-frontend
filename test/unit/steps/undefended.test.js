const modulePath = 'steps/undefended/Undefended.step';

const Undefended = require(modulePath);
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const getSteps = require('steps');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationMiddleware = require('middleware/caseOrchestrationMiddleware');

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
      caseOrchestrationMiddleware.getApplication
    ]);
  });

  it('skips reviewAosResponse when CCD has respDefendsDivorce as null', () => {
    return interstitial.navigatesToNext(Undefended, ApplyForDecreeNisi, getSteps());
  });

  it('renders the content', () => {
    const session = { case: { data: {}, caseId: '1234' } };
    return content(Undefended, session);
  });
});
