const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');
const preserveSession = require('middleware/preserveSession');
const caseOrchestrationMiddleware = require('middleware/caseOrchestrationMiddleware');

class Done extends ExitPoint {
  static get path() {
    return config.paths.done;
  }

  get session() {
    return this.req.preservedSession;
  }

  get middleware() {
    return [
      idam.protect(),
      caseOrchestrationMiddleware.submitApplication,
      preserveSession,
      idam.logout(),
      ...super.middleware
    ];
  }
}

module.exports = Done;
