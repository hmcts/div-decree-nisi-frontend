const modulePath = 'steps/review-aos-response/ReviewAosResponse.step';

const ReviewAosResponse = require(modulePath);
const End = require('steps/end/End.step');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const { getUserData } = require('middleware/ccd');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ReviewAosResponse, [ idam.protect(), getUserData ]);
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(ReviewAosResponse, End);
  });

  it('renders the content', () => {
    return content(ReviewAosResponse);
  });
});
