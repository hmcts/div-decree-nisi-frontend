const modulePath = 'steps/review-aos-response/ReviewAosResponse.step';

const ReviewAosResponse = require(modulePath);
const ReviewAosResponseContent = require('steps/review-aos-response/ReviewAosResponse.content');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const idam = require('services/idam');
const { middleware, sinon, content, question } = require('@hmcts/one-per-page-test-suite');
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
    const fields = { reviewAosResponse: 'yes' };
    return question.redirectWithField(ReviewAosResponse, fields, ApplyForDecreeNisi);
  });

  it('renders the content', () => {
    return content(ReviewAosResponse);
  });

  it.skip('returns correct answers', () => {
    const assertion = {
      question: ReviewAosResponseContent.en.fields.reviewAosResponse.title,
      answer: ReviewAosResponseContent.en.fields.reviewAosResponse.yes
    };
    const session = { reviewAosResponse: 'yes' };
    return question.answers(ReviewAosResponse, session, assertion);
  });
});
