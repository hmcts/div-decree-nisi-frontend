const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const content = require('common/content');

function seeReviewAosResponsePage() {
  const I = this;

  I.seeCurrentUrlEquals(ReviewAosResponse.path);
  I.navByClick(content.en.continue);
}

module.exports = { seeReviewAosResponsePage };
