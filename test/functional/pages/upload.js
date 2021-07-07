const Upload = require('steps/upload/Upload.step');
const UploadContent = require('steps/upload/Upload.content');
const commonContent = require('common/content');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const config = require('config');
const ShareCourtDocumentsContent = require(
  'steps/share-court-documents/ShareCourtDocuments.content'
);

function upload(file, isDragAndDropSupported, language) {
  const I = this;

  if (isDragAndDropSupported) {
    I.attachFile('.dz-hidden-input', file);
  } else {
    I.waitForVisible('.file-upload-input');
    I.attachFile('.file-upload-input', file);
    if (language === 'en') {
      I.click('Upload');
    }

    if (language === 'cy') {
      I.click('Uwchlwytho');
    }
  }
}

async function testUploadPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(ShareCourtDocuments.path, language);
  I.checkOption(ShareCourtDocumentsContent[language].fields.upload.yes);
  I.navByClick(commonContent[language].continue);

  if (['safari', 'microsoftEdge'].includes(config.features.browserSupport)) {
    // eslint-disable-next-line no-console
    console.log(`Running test in ${config.features.browserSupport}, skipping document upload.`);
  } else {
    const isDragAndDropSupported = await I.checkElementExist('.dz-hidden-input');
    I.uploadFile(isDragAndDropSupported, language);
    // Below step is broken by bug (raised 30/11/20): https://tools.hmcts.net/jira/browse/RPET-638
    // I.deleteAFile(language);
  }

  I.navByClick(commonContent[language].continue);

  I.seeCurrentUrlEquals(CheckYourAnswers.path);
}

function uploadFile(isDragAndDropSupported, language = 'en') {
  const I = this;

  I.say(`Drag and Drop supported: ${isDragAndDropSupported}`);
  I.amOnLoadedPage(Upload.path, language);

  upload.call(I, '/assets/image.jpg', isDragAndDropSupported, language);
  I.waitForVisible('.file', 30);
  I.waitForText(UploadContent[language].remove, 30);
  I.waitForVisible(`input[value="${commonContent[language].continue}"]:not([disabled])`);
}

function deleteAFile(language = 'en') {
  const I = this;

  I.click(UploadContent[language].remove);
  I.waitForInvisible('.file');
  I.dontSee(UploadContent[language].remove);
}

module.exports = { testUploadPage, uploadFile, deleteAFile };
