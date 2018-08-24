const Upload = require('steps/upload/Upload.step');
const UploadContent = require('steps/upload/Upload.content');
const commonContent = require('common/content');

function seeUploadPage() {
  const I = this;

  I.seeCurrentUrlEquals(Upload.path);
  I.checkOption(UploadContent.en.fields.upload.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeUploadPage };
