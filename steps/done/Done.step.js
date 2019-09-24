const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');
const { createUris } = require('@hmcts/div-document-express-handler');
const { parseBool } = require('@hmcts/one-per-page/util');

const constants = {
  NotDefined: 'notdefined',
  awaitingClarification: 'awaitingclarification'
};

class Done extends ExitPoint {
  static get path() {
    return config.paths.done;
  }

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : constants.NotDefined;
  }

  get isAwaitingClarification() {
    return this.caseState === constants.awaitingClarification && parseBool(config.features.awaitingClarification);
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

  get middleware() {
    return [
      idam.protect(),
      idam.logout(),
      ...super.middleware
    ];
  }
}

module.exports = Done;
