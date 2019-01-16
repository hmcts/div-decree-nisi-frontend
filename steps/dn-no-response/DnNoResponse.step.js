const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

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
    return this.res.locals.applicationFee['application-without-notice-fee'].amount;
  }

  get enforcemetFee() {
    return this.res.locals.applicationFee['enforcement-fee'].amount;
  }

  get middleware() {
    return [
      getFeeFromFeesAndPayments('application-without-notice-fee'),
      getFeeFromFeesAndPayments('enforcement-fee')
    ];
  }
}

module.exports = DnNoResponse;
