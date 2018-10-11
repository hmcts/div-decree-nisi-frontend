const modulePath = 'steps/undefended/Undefended.step';

const Undefended = require(modulePath);
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const getSteps = require('steps');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(Undefended, [ idam.protect() ]);
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(Undefended, ReviewAosResponse, getSteps());
  });

  it('renders the content', () => {
    const session = { case: { data: {}, caseId: '1234' } };
    return content(Undefended, session);
  });
});
