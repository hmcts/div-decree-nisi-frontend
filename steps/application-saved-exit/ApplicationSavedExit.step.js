const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');

class ApplicationSavedExit extends ExitPoint {
  static get path() {
    return config.paths.applicationSavedExit;
  }
}

module.exports = ApplicationSavedExit;
