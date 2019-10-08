const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');
const { createUris } = require('@hmcts/div-document-express-handler');
const { parseBool } = require('@hmcts/one-per-page/util');
const { notDefined, awaitingClarification } = require('common/constants');

class Done extends ExitPoint {
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

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: config.document.filesWhiteList
    };

    return createUris(this.case.d8, docConfig);
  }

  get hasUploadedDocuments() {
    if (this.req.session.Upload) {
      const hasSubmittedFiles = this.req.session.Upload.files && this.req.session.Upload.files.length;
      return hasSubmittedFiles;
    }
    return false;
  }

  get middleware() {
    return [
      idam.protect(),
      idam.logout(),
      ...super.middleware
    ];
  }
}

module.exports = Done;
