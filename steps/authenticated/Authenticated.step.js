const { Redirect } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class Authenticated extends Redirect {
  static get path() {
    return config.paths.authenticated;
  }

  next() {
    return redirectTo(this.journey.steps.Entry);
  }

  get middleware() {
    return [
      idam.landingPage,
      ...super.middleware,
      getWebchatOpeningHours
    ];
  }
}

module.exports = Authenticated;
