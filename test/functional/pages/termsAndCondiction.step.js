const TermsAndConditions = require('steps/terms-and-conditions/TermsAndConditions.step');
const TermsAndConditionsContent = require('steps/terms-and-conditions/TermsAndConditions.content');

function testTermsAndConditionsPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(TermsAndConditions.path, language);

  I.see(TermsAndConditionsContent[language].title);
}

module.exports = { testTermsAndConditionsPage };
