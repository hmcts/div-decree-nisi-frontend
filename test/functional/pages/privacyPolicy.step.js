const PrivacyPolicy = require('steps/privacy-policy/PrivacyPolicy.step');
const PrivacyPolicyContent = require('steps/privacy-policy/PrivacyPolicy.content');

function testPrivacyPolicyPage() {
  const I = this;

  I.amOnLoadedPage(PrivacyPolicy.path);

  I.see(PrivacyPolicyContent.en.title);
}

module.exports = { testPrivacyPolicyPage };
