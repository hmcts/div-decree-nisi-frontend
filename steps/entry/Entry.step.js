const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');
const { parseBool } = require('@hmcts/one-per-page/util');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.entry;
  }

  next() {
    const nextStep = parseBool(config.features.showSystemMessage) ? this.journey.steps.SystemMessage : this.journey.steps.PetitionProgressBar;
    return action(caseOrchestrationService.getApplication)
      .then(redirectTo(nextStep))
      .onFailure(caseOrchestrationHelper.handleErrorCodes);
  }

  get middleware() {
    return [...super.middleware, idam.authenticate];
  }
}

module.exports = Entry;
