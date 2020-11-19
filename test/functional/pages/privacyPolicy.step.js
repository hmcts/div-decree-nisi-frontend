const PrivacyPolicy = require('steps/privacy-policy/PrivacyPolicy.step');
const PrivacyPolicyContent = require('steps/privacy-policy/PrivacyPolicy.content');

function testPrivacyPolicyPage(language = 'en') {
  const I = this;
  I.amOnLoadedPage(PrivacyPolicy.path, language);
  I.see(PrivacyPolicyContent[language].title);
}

module.exports = { testPrivacyPolicyPage };
