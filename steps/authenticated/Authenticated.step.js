const { Redirect } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');

class Authenticated extends Redirect {
  static get path() {
    return config.paths.authenticated;
  }

  next() {
    return action(caseOrchestrationService.getApplication)
      .then(redirectTo(this.journey.steps.PetitionProgressBar))
      .onFailure(redirectTo(this.journey.steps.ExitNoCase));
  }

  get middleware() {
    return [...super.middleware, idam.landingPage()];
  }
}

module.exports = Authenticated;
