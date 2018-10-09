const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.entry;
  }

  next() {
    return action(caseOrchestrationService.getApplication)
      .then(redirectTo(this.journey.steps.Undefended))
      .onFailure(redirectTo(this.journey.steps.Start));
  }

  get middleware() {
    return [...super.middleware, idam.authenticate()];
  }
}

module.exports = Entry;
