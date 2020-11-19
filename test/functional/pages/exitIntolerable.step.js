const ExitIntolerablePage = require('steps/exit-intolerable/ExitIntolerable.step');
const ExitIntolerablePageContent = require('steps/exit-intolerable/ExitIntolerable.content');

async function testExitIntolerable(language = 'en') {
  const I = this;

  await I.testIdamPage();

  I.amOnLoadedPage(ExitIntolerablePage.path, language);

  I.see(ExitIntolerablePageContent[language].contact);
}

module.exports = { testExitIntolerable };
