const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const preserveSession = require('middleware/preserveSession');

class Exit extends ExitPoint {
  static get path() {
    return config.paths.exit;
  }

  get session() {
    return this.req.sess;
  }

  get middleware() {
    return [
      preserveSession,
      ...super.middleware
    ];
  }
}

module.exports = Exit;