const { shimSessionStaticPage } = require('middleware/shimSession');
const config = require('config');

class TermsAndConditions extends shimSessionStaticPage {
  static get ignorePa11yWarnings() {
    return ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'];
  }

  static get path() {
    return config.paths.termsAndConditions;
  }
}

module.exports = TermsAndConditions;
