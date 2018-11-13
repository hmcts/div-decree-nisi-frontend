const { Redirect } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');
const { NOT_FOUND, FORBIDDEN } = require('http-status-codes');
const { redirectToFrontend, redirectToAos } = require('helpers/redirectToFrontendHelper');
const redirectToIndex = require('middleware/redirectToIndex');

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
        }

        if (error.statusCode === FORBIDDEN) {
          redirectToAos(req, res);
        }

        next(error);
      });
  }

  get middleware() {
    return [
      idam.landingPage(),
      redirectToIndex.redirectToIndexIfNoSession,
      ...super.middleware
    ];
  }
}

module.exports = Authenticated;
