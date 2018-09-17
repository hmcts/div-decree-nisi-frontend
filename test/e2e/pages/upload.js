const Upload = require('steps/upload/Upload.step');
const UploadContent = require('steps/upload/Upload.content');
const commonContent = require('common/content');

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

function seeUploadPage() {
  const I = this;

  I.seeCurrentUrlEquals(Upload.path);
}

function uploadFile(isDragAndDropSupported) {
  const I = this;

  I.say(`Drag and Drop supported: ${isDragAndDropSupported}`);
  I.seeCurrentUrlEquals(Upload.path);

  upload.call(I, '/assets/image.jpg', isDragAndDropSupported);
  I.waitForVisible('.file', 30);
  I.waitForText(UploadContent.en.remove, 30);
  I.waitForVisible(`input[value="${commonContent.en.continue}"]:not([disabled])`);
}

function deleteAFile(isDragAndDropSupported) {
  const I = this;

  I.say(`Drag and Drop supported: ${isDragAndDropSupported}`);
  I.seeCurrentUrlEquals(Upload.path);

  upload.call(I, '/assets/image.jpg', isDragAndDropSupported);

  I.waitForVisible('.file', 30);
  I.waitForText(UploadContent.en.remove, 30);
  I.click(UploadContent.en.remove);
  I.waitForInvisible('.file');
  I.dontSee(UploadContent.en.remove);
}

module.exports = { seeUploadPage, uploadFile, deleteAFile };
