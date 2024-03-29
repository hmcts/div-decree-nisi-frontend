const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');
const i18next = require('i18next');
const commonContent = require('common/content');
const { getFeeFromFeesAndPayments, feeTypes } = require('middleware/feesAndPaymentsMiddleware');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class DnNoResponse extends Page {
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

  get enforcementFee() {
    return this.res.locals.applicationFee ? this.res.locals.applicationFee[feeTypes.enforcementFee] : '';
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      getFeeFromFeesAndPayments(feeTypes.appWithoutNoticeFee),
      getFeeFromFeesAndPayments(feeTypes.enforcementFee)
    ];
  }
}

module.exports = DnNoResponse;
