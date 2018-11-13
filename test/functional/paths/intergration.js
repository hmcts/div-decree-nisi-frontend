const CheckYourAnswersContent = require('steps/check-your-answers/CheckYourAnswers.content');
const config = require('config');

Feature('Integration Tests');

Scenario('Happy Path', async I => {
  I.createAUser();

  I.createDnCaseForUser('test/resources/basic-divorce-session.json');

  I.amOnLoadedPage('/');

  I.testHomePage();

  await I.testIdamPage();

  I.testProgressBar();

  I.testApplyForDecreeNisiPage();

  I.testMiniPetitionPage();

  I.testLivedApartSinceSeparationPage();

  I.testClaimCostsPage();

  I.testShareCourtDocumentsPage('no');

  I.testCheckYourAnswersPage();
  I.navByClick(CheckYourAnswersContent.en.submit);

  I.amOnLoadedPage(config.paths.done);
});
