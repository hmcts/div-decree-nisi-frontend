const { shimSessionStaticPage } = require('middleware/shimSession');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');
const commonContent = require('common/content');
const { getFeeFromFeesAndPayments, feeTypes } = require('middleware/feesAndPaymentsMiddleware');

class DnNoResponse extends shimSessionStaticPage {
  static get path() {
    return config.paths.dnNoResponse;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
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
      getFeeFromFeesAndPayments(feeTypes.enforcementFee),
      checkWelshToggle
    ];
  }
}

module.exports = DnNoResponse;
