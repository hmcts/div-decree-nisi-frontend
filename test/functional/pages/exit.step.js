const ExitPage = require('steps/exit/Exit.step');
const ExitPageContent = require('steps/exit/Exit.content');

async function testExitPage(language = 'en') {
  const I = this;

  await I.testIdamPage();

  I.amOnLoadedPage(ExitPage.path, language);

  I.waitInUrl(ExitPage.path);

  I.see(ExitPageContent[language].title);
}

module.exports = { testExitPage };
