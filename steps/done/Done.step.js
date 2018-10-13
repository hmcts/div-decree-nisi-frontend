const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');
const preserveSession = require('middleware/preserveSession');

class Done extends ExitPoint {
  static get path() {
    return config.paths.done;
  }

  get case() {
    return this.req.preservedSession.case.data;
  }

  get caseId() {
    return this.req.preservedSession.case.caseId;
  }

  get middleware() {
    return [
      idam.protect(),
      preserveSession,
      idam.logout(),
      ...super.middleware
    ];
  }
}

module.exports = Done;
