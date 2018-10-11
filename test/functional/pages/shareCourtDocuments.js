const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const ShareCourtDocumentsContent = require(
  'steps/share-court-documents/ShareCourtDocuments.content'
);
const commonContent = require('common/content');
const Upload = require('steps/upload/Upload.step');

function testShareCourtDocumentsPage() {
  const I = this;

  I.amOnLoadedPage(ShareCourtDocuments.path);
  I.checkOption(ShareCourtDocumentsContent.en.fields.upload.yes);

  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(Upload.path);
}

module.exports = { testShareCourtDocumentsPage };
