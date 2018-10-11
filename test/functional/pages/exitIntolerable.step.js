const ExitIntolerablePage = require('steps/exit-intolerable/ExitIntolerable.step');
const ExitIntolerablePageContent = require('steps/exit-intolerable/ExitIntolerable.content');

async function testExitIntolerable() {
  const I = this;

  await I.testIdamPage();

  I.amOnLoadedPage(ExitIntolerablePage.path);

  I.see(ExitIntolerablePageContent.en.contact);
}

module.exports = { testExitIntolerable };
