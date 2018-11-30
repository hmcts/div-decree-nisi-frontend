const { Redirect } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');
const { NOT_FOUND, MULTIPLE_CHOICES } = require('http-status-codes');
const redirectToFrontend = require('helpers/redirectToFrontendHelper');
const redirectToEntry = require('middleware/redirectToEntry');

class Authenticated extends Redirect {
  static get path() {
    return config.paths.authenticated;
  }

  next() {
    return action(caseOrchestrationService.getApplication)
      .then(redirectTo(this.journey.steps.PetitionProgressBar))
      .onFailure((error, req, res, next) => {
        if (error.statusCode === NOT_FOUND) {
          redirectToFrontend(req, res);
        } else if (error.statusCode === MULTIPLE_CHOICES) {
          res.redirect(config.paths.contactDivorceTeam);
        } else {
          next(error);
        }
      });
  }

  get middleware() {
    return [
      idam.landingPage,
      redirectToEntry.redirectToEntryIfNoSession,
      ...super.middleware
    ];
  }
}

module.exports = Authenticated;
