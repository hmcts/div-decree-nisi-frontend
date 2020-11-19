const AmendApplication = require('steps/amend-application/AmendApplication.step');
const AmendContent = require('steps/amend-application/AmendApplication.content');

function testAmendApplication(language = 'en') {
  const I = this;

  I.amOnLoadedPage(AmendApplication.path, language);

  I.see(AmendContent[language].title);
}

module.exports = { testAmendApplication };