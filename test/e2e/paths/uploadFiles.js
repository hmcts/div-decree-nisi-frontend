const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');

Feature('Upload Files').retry(3);

Scenario('Test upload', async I => {
  I.amOnLoadedPage('/');
  await I.loginToIdam();
  I.amOnLoadedPage(ShareCourtDocuments.path);
  I.seeShareCourtDocumentsPage('yes');
  const isDragAndDropSupported = await I.checkElementExist('.dz-hidden-input');
  I.seeUploadPage();
  I.uploadFile(isDragAndDropSupported);
});

Scenario('Test remove marriage Certificate', async I => {
  I.amOnLoadedPage('/');
  await I.loginToIdam();
  I.amOnLoadedPage(ShareCourtDocuments.path);
  I.seeShareCourtDocumentsPage('yes');
  const isDragAndDropSupported = await I.checkElementExist('.dz-hidden-input');
  I.deleteAFile(isDragAndDropSupported);
});
