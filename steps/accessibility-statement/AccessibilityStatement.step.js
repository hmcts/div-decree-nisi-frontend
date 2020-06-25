const { shimSessionStaticPage } = require('middleware/shimSession');
const config = require('config');
const checkWelshToggle = require('middleware/checkWelshToggle');

class AccessibilityStatement extends shimSessionStaticPage {
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
