const { Page } = require('@hmcts/one-per-page');
const config = require('config');

class ExitIntolerable extends Page {
  static get path() {
    return config.paths.exitIntolerable;
  }
}

module.exports = ExitIntolerable;
