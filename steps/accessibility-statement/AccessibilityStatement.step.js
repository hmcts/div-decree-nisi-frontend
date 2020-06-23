const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const checkWelshToggle = require('middleware/checkWelshToggle');

class AccessibilityStatement extends Page {
  static get path() {
    return config.paths.accessibilityStatement;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = AccessibilityStatement;
