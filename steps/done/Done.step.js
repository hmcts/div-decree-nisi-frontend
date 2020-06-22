const { shimSessionExitPoint } = require('middleware/shimSession');
const config = require('config');
const idam = require('services/idam');
const { createUris } = require('@hmcts/div-document-express-handler');
const { parseBool } = require('@hmcts/one-per-page/util');
const { notDefined, awaitingClarification } = require('common/constants');
const { get } = require('lodash');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');
const commonContent = require('common/content');

class Done extends shimSessionExitPoint {
  static get path() {
    return config.paths.done;
  }

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : notDefined;
  }

  get isAwaitingClarification() {
    const isDnOutcomeCase = parseBool(this.case.dnOutcomeCase);
    const featureIsEnabled = parseBool(config.features.awaitingClarification);
    const isCorrectState = this.caseState === awaitingClarification;

    return isDnOutcomeCase && featureIsEnabled && isCorrectState;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: config.document.filesWhiteList
    };

    return createUris(this.case.d8, docConfig);
  }

  get shareDocumentsAndNoUploads() {
    const shareCourtDocumentsAnswer = get(this.req.session, 'ShareCourtDocuments.upload');
    const uploadedDocumentsAnswer = get(this.req.session, 'Upload.files') || [];

    const doesWantToShareDocuments = parseBool(shareCourtDocumentsAnswer);
    const hasNoUploadedDocuments = uploadedDocumentsAnswer.length === 0;

    return doesWantToShareDocuments && hasNoUploadedDocuments;
  }

  get middleware() {
    return [
      idam.protect(),
      idam.logout(),
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = Done;
