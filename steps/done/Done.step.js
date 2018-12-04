const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');

class Done extends ExitPoint {
  static get path() {
    return config.paths.done;
  }

  get case() {
    return this.req.session.case.data;
  }

  get middleware() {
    return [
      idam.protect(),
      idam.logout(),
      ...super.middleware
    ];
  }
}

module.exports = Done;
