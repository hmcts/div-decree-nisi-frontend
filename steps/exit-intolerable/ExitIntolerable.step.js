const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');

class ExitIntolerable extends Page {
  static get path() {
    return config.paths.exitIntolerable;
  }

  get session() {
    return this.req.session;
  }

  get flowControl() {
    return stopHere(this);
  }
}

module.exports = ExitIntolerable;
