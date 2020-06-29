const { shimSessionExitPoint } = require('middleware/shimSession');
const config = require('config');
const idam = require('services/idam');

class Exit extends shimSessionExitPoint {
  static get path() {
    return config.paths.exit;
  }

  get middleware() {
    return [
      idam.protect(),
      ...super.middleware,
      idam.logout()
    ];
  }
}

module.exports = Exit;
