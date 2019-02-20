const { Interstitial } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');

class ReviewAosResponseFromCoRespondent extends Interstitial {
  static get path() {
    return config.paths.reviewAosResponseFromCoRespondent;
  }

  get case() {
    return this.req.session.case.data;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  next() {
    return redirectTo(this.journey.steps.ApplyForDecreeNisi);
  }
}

module.exports = ReviewAosResponseFromCoRespondent;
