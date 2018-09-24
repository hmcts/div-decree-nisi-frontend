const { Page } = require('@hmcts/one-per-page');
const config = require('config');

class ExitIntolerable extends Page {
  static get path() {
    return config.paths.exitIntolerable;
  }

  get session() {
    return this.req.session;
  }
}

module.exports = ExitIntolerable;
