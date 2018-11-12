const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');
const { NOT_FOUND } = require('http-status-codes');
const redirectToFrontend = require('helpers/redirectToFrontendHelper');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.entry;
  }

  next() {
    return action(caseOrchestrationService.getApplication)
      .then(redirectTo(this.journey.steps.PetitionProgressBar))
      .onFailure((error, req, res, next) => {
        if (error.statusCode === NOT_FOUND) {
          redirectToFrontend(req, res);
        } else {
          next(error);
        }
      });
  }

  get middleware() {
    return [...super.middleware, idam.authenticate()];
  }
}

module.exports = Entry;
