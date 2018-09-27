'use strict';

const Helper = codecept_helper; // eslint-disable-line

class ElementExist extends Helper {
  checkElementExist(selector) {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
    const isWebDriverIO = typeof this.helpers.WebDriverIO !== 'undefined';

    return helper
      ._locate(selector)
      .then(els => {
        if (isWebDriverIO) {
          return Boolean(els.value.length);
        }
        return Boolean(els.length);
      });
  }

  getPaymentIsOnStub() {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;

    return helper.grabCurrentUrl()
      .then(url => {
        return url.includes('/pay/gov-pay-stub');
      })
      .catch(error => {
        throw error;
      });
  }
}

module.exports = ElementExist;
