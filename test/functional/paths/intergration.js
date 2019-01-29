const CheckYourAnswersContent = require('steps/check-your-answers/CheckYourAnswers.content');
const config = require('config');
const basicDivorceSession = require('test/resources/basic-divorce-session');

Feature('Integration Tests');

Scenario('Happy Path', async I => {
  await I.createAUser();

  await I.createDnCaseForUser(basicDivorceSession);

  I.amOnLoadedPage('/');

  await I.testIdamPage();

  I.testProgressBar();

  I.testApplyForDecreeNisiPage();

  I.testMiniPetitionPage();

  I.testBehaviourContinuedSinceApplicationPage();

  I.testClaimCostsPage();

  I.testShareCourtDocumentsPage('no');

  I.testCheckYourAnswersPage();
  I.navByClick(CheckYourAnswersContent.en.submit);

  I.amOnLoadedPage(config.paths.done);
}).retry(3);
