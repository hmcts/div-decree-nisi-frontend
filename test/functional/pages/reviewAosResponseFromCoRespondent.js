// eslint-disable-next-line max-len
const ReviewAosResponseFromCoRespondent = require('steps/review-aos-response-from-co-respondent/ReviewAosResponseFromCoRespondent.step');
// eslint-disable-next-line max-len
const ReviewCoRespContent = require('steps/review-aos-response-from-co-respondent/ReviewAosResponseFromCoRespondent.content');

function testReviewAosResponseFromCoRespondent() {
  const I = this;

  I.amOnLoadedPage(ReviewAosResponseFromCoRespondent.path);

  I.see(ReviewCoRespContent.en.title);
}

module.exports = { testReviewAosResponseFromCoRespondent };