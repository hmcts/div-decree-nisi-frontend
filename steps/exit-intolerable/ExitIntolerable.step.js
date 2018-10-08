const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');

class ExitIntolerable extends Page {
  static get path() {
    return config.paths.exitIntolerable;
  }

  get case() {
    return this.req.session.case.data;
  }

  get flowControl() {
    return stopHere(this);
  }
}

module.exports = ExitIntolerable;
