const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class AccessibilityStatement extends Page {
  static get path() {
    return config.paths.accessibilityStatement;
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours
    ];
  }
}

module.exports = AccessibilityStatement;
