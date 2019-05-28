const Upload = require('steps/upload/Upload.step');
const UploadContent = require('steps/upload/Upload.content');
const commonContent = require('common/content');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const ShareCourtDocumentsContent = require(
  'steps/share-court-documents/ShareCourtDocuments.content'
);

function upload(file, isDragAndDropSupported) {
  const I = this;

  if (isDragAndDropSupported) {
    I.attachFile('.dz-hidden-input', file);
  } else {
    I.waitForVisible('.file-upload-input');
    I.attachFile('.file-upload-input', file);
    I.click('Upload');
  }
}

async function testUploadPage() {
  const I = this;

  I.amOnLoadedPage(ShareCourtDocuments.path);
  I.checkOption(ShareCourtDocumentsContent.en.fields.upload.yes);
  I.navByClick(commonContent.en.continue);

  const isDragAndDropSupported = await I.checkElementExist('.dz-hidden-input');

  I.uploadFile(isDragAndDropSupported);
  I.deleteAFile();
  I.uploadCorruptedFileAndRemovingSuccessfully(isDragAndDropSupported);


  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(CheckYourAnswers.path);
}

function uploadCorruptedFileAndRemovingSuccessfully(isDragAndDropSupported) {
  const I = this;
  I.say(`Drag and Drop supported: ${isDragAndDropSupported}`);
  I.seeCurrentUrlEquals(Upload.path);
  upload.call(I, '/assets/corruptedImage.bmp', isDragAndDropSupported);
  I.waitForText('Hide', 30);
  I.click('Hide');
  I.see('No files uploaded');
  I.navByClick('Continue');
}

function uploadFile(isDragAndDropSupported) {
  const I = this;

  I.say(`Drag and Drop supported: ${isDragAndDropSupported}`);
  I.amOnLoadedPage(Upload.path);

  upload.call(I, '/assets/image.jpg', isDragAndDropSupported);
  I.waitForVisible('.file', 30);
  I.waitForText(UploadContent.en.remove, 30);
  I.waitForVisible(`input[value="${commonContent.en.continue}"]:not([disabled])`);
}

function deleteAFile() {
  const I = this;

  I.click(UploadContent.en.remove);
  I.waitForInvisible('.file');
  I.dontSee(UploadContent.en.remove);
}

module.exports = {
  testUploadPage,
  uploadFile,
  deleteAFile,
  uploadCorruptedFileAndRemovingSuccessfully
};
