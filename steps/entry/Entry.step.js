const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.entry;
  }

  next() {
    return action(caseOrchestrationService.getApplication)
      .then(redirectTo(this.journey.steps.PetitionProgressBar))
      .onFailure(caseOrchestrationHelper.handleErrorCodes);
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.authenticate
    ];
  }
}

module.exports = Entry;
