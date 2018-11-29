const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');

const { NOT_FOUND, MULTIPLE_CHOICES } = require('http-status-codes');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

class Entry extends EntryPoint {
  static get path() {
    return config.paths.entry;
  }

  next() {
    return action(caseOrchestrationService.getApplication)
      .then(redirectTo(this.journey.steps.PetitionProgressBar))
      .onFailure((error, req, res, next) => {
        if (error.statusCode === NOT_FOUND) {
          logger.info('Redirecting user to Petitioner Frontend as no case was found on CCD');
          res.redirect(config.services.petitionerFrontend.url);
        } else if (error.statusCode === MULTIPLE_CHOICES) {
          res.redirect(config.paths.contactDivorceTeam);
        } else {
          next(error);
        }
      });
  }

  get middleware() {
    return [...super.middleware, idam.authenticate];
  }
}

module.exports = Entry;
