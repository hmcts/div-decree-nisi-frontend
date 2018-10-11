const UndefendedPage = require('steps/undefended/Undefended.step');
const content = require('common/content');
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');

function testUndefendedPage() {
  const I = this;

  I.amOnLoadedPage(UndefendedPage.path);
  I.navByClick(content.en.continue);

  I.seeCurrentUrlEquals(ReviewAosResponse.path);
}

module.exports = { testUndefendedPage };
