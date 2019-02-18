const { Interstitial } = require('@hmcts/one-per-page/steps');
const { action } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const caseOrchestrationService = require('services/caseOrchestrationService');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');

class AmendApplication extends Interstitial {
  static get path() {
    return config.paths.amendApplication;
  }

  get case() {
    return this.req.session.case.data;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return action(caseOrchestrationService.amendApplication)
      .then(redirectToFrontendHelper.redirectToFrontendAmend);
  }
}

module.exports = AmendApplication;
