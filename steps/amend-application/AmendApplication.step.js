const { Interstitial } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');

class AmendApplication extends Interstitial {
  static get path() {
    return config.paths.amendApplication;
  }

  get case() {
    return this.req.session.case.data;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return redirectTo(this.journey.steps.ShareCourtDocuments);
  }
}

module.exports = AmendApplication;
