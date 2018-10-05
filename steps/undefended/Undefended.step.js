const { Interstitial } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const { getUserData } = require('middleware/ccd');

class Undefended extends Interstitial {
  static get path() {
    return config.paths.undefended;
  }

  get session() {
    return this.req.session;
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  next() {
    return redirectTo(this.journey.steps.ReviewAosResponse);
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = Undefended;
