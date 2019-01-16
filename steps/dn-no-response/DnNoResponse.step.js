const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');
const { appWithoutNoticeFee, enforcementFee } = require('middleware/feesAndPaymentsMiddleware');

class DnNoResponse extends Page {
  static get path() {
    return config.paths.dnNoResponse;
  }

  get case() {
    return this.req.session.case.data;
  }

  get flowControl() {
    return stopHere(this);
  }

  get feeToResendApplication() {
    return appWithoutNoticeFee;
  }

  get enforcemetFee() {
    return enforcementFee;
  }
}

module.exports = DnNoResponse;
