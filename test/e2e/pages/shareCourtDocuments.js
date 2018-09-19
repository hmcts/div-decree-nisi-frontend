const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const ShareCourtDocumentsContent = require(
  'steps/share-court-documents/ShareCourtDocuments.content'
);
const commonContent = require('common/content');

function seeShareCourtDocumentsPage(answer = 'no') {
  const I = this;

  I.seeCurrentUrlEquals(ShareCourtDocuments.path);
  if (answer === 'no') {
    I.checkOption(ShareCourtDocumentsContent.en.fields.upload.no);
  } else {
    I.checkOption(ShareCourtDocumentsContent.en.fields.upload.yes);
  }

  I.navByClick(commonContent.en.continue);
}

module.exports = { seeShareCourtDocumentsPage };
