const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');

const { getFeeFromFeesAndPayments, feeTypes } = require('middleware/feesAndPaymentsMiddleware');

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
    return this.res.locals.applicationFee ? this.res.locals.applicationFee[feeTypes.appWithoutNoticeFee] : '';
  }

  get enforcemetFee() {
    return this.res.locals.applicationFee ? this.res.locals.applicationFee[feeTypes.enforcementFee] : '';
  }

  get middleware() {
    return [
      ...super.middleware,
      getFeeFromFeesAndPayments(feeTypes.appWithoutNoticeFee),
      getFeeFromFeesAndPayments(feeTypes.enforcementFee)
    ];
  }
}

module.exports = DnNoResponse;
