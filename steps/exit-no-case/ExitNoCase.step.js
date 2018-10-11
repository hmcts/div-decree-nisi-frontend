const { BaseStep } = require('@hmcts/one-per-page');
const idam = require('services/idam');
const config = require('config');
const destroySession = require('@hmcts/one-per-page/src/session/destroySession');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

class ExitNoCase extends BaseStep {
  static get path() {
    return config.paths.exitNoCase;
  }

  handler(req, res) {
    if (req.method === 'GET') {
      res.redirect(config.services.petitionerFrontend.url);
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }

  get middleware() {
    return [...super.middleware, destroySession, idam.logout()];
  }
}

module.exports = ExitNoCase;
