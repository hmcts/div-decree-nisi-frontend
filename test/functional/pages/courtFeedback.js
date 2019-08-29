const CourtFeedback = require('steps/court-feedback/CourtFeedback.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const commonContent = require('common/content');

function testCourtFeedback() {
  const I = this;

  I.amOnLoadedPage(CourtFeedback.path);
  I.fillField('response', 'some details...');
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(ShareCourtDocuments.path);
}

module.exports = { testCourtFeedback };
