const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const ShareCourtDocumentsContent = require(
  'steps/share-court-documents/ShareCourtDocuments.content'
);
const commonContent = require('common/content');
const Upload = require('steps/upload/Upload.step');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');

function testShareCourtDocumentsPage(option = 'yes', language = 'en') {
  const I = this;

  I.amOnLoadedPage(ShareCourtDocuments.path, language);
  I.click(ShareCourtDocumentsContent[language].fields.upload[option]);
  I.navByClick(commonContent[language].continue);

  if (option === 'yes') {
    I.seeCurrentUrlEquals(Upload.path);
  } else {
    I.waitInUrl(CheckYourAnswers.path, 5);
    I.seeCurrentUrlEquals(CheckYourAnswers.path);
  }
}

module.exports = { testShareCourtDocumentsPage };
