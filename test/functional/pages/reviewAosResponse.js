const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const content = require('common/content');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');

function testReviewAosResponsePage() {
  const I = this;

  I.amOnLoadedPage(ReviewAosResponse.path);
  I.navByClick(content.en.continue);

  I.seeCurrentUrlEquals(ApplyForDecreeNisi.path);
}

module.exports = { testReviewAosResponsePage };
