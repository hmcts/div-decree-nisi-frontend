const commonContent = require('common/content');
const config = require('config');

Feature('Integration Tests');

Scenario('Happy Path', async I => {
  I.amOnLoadedPage('/');

  I.testHomePage();

  await I.testIdamPage();

  I.testProgressBar();

  I.testApplyForDecreeNisiPage();

  I.testMiniPetitionPage();

  I.testLivedApartSinceSeparationPage();

  I.testClaimCostsPage();

  I.testShareCourtDocumentsPage();

  I.testCheckYourAnswersPage();
  I.navByClick(commonContent.en.continue);
  I.amOnLoadedPage(config.paths.done);

  I.testDonePage();
});
