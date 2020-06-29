const { shimSessionStaticPage } = require('middleware/shimSession');
const config = require('config');

class AccessibilityStatement extends shimSessionStaticPage {
  static get path() {
    return config.paths.accessibilityStatement;
  }
}

module.exports = AccessibilityStatement;
