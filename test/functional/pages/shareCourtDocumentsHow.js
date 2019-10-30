const ShareCourtDocumentsHow = require(
  'steps/share-court-documents-how/ShareCourtDocumentsHow.step'
);
const ShareCourtDocumentsHowContent = require(
  'steps/share-court-documents-how/ShareCourtDocumentsHow.content'
);
const commonContent = require('common/content');
const Upload = require('steps/upload/Upload.step');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');

function testShareCourtDocumentsHowPage(option = 'yes') {
  const I = this;

  I.amOnLoadedPage(ShareCourtDocumentsHow.path);
  I.click(ShareCourtDocumentsHowContent.en.fields.clarificationDigital[option]);
  I.navByClick(commonContent.en.continue);

  if (option === 'yes') {
    I.seeCurrentUrlEquals(Upload.path);
  } else {
    I.waitInUrl(CheckYourAnswers.path, 5);
    I.seeCurrentUrlEquals(CheckYourAnswers.path);
  }
}

module.exports = { testShareCourtDocumentsHowPage };
