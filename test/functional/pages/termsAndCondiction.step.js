const TermsAndConditions = require('steps/terms-and-conditions/TermsAndConditions.step');
const TermsAndConditionsContent = require('steps/terms-and-conditions/TermsAndConditions.content');

function testTermsAndConditionsPage() {
  const I = this;

  I.amOnLoadedPage(TermsAndConditions.path);

  I.see(TermsAndConditionsContent.en.title);
}

module.exports = { testTermsAndConditionsPage };
