'use strict';

const Helper = codecept_helper; // eslint-disable-line

class ElementExist extends Helper {
  checkElementExist(selector) {
    const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
    const isWebDriver = typeof this.helpers.WebDriver !== 'undefined';

    return helper
      ._locate(selector)
      .then(els => {
        if (isWebDriver) {
          return Boolean(els.value.length);
        }
        return Boolean(els.length);
      });
  }
}

module.exports = ElementExist;
