const ExitPage = require('steps/exit/Exit.step');
const ExitPageContent = require('steps/exit/Exit.content');

async function testExitPage() {
  const I = this;

  await I.testIdamPage();

  I.amOnLoadedPage(ExitPage.path);

  I.see(ExitPageContent.en.title);
}

module.exports = { testExitPage };
