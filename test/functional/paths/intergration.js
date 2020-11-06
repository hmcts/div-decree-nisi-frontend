const CheckYourAnswersContent = require('steps/check-your-answers/CheckYourAnswers.content');
const config = require('config');
const basicDivorceSession = require('test/resources/basic-divorce-session');

const testHappyPath = async(I, language = 'en') => {
  await I.createAUser();
  await I.createDnCaseForUser(basicDivorceSession);

  I.amOnLoadedPage('/', language);
  await I.testIdamPage();

  I.testProgressBar();
  I.testApplyForDecreeNisiPage();
  I.testMiniPetitionPage();

  if (config.tests.functional.verifyOnCrossbrowser) {
    I.testBehaviourContinuedSinceApplicationPage();
  } else {
    const isMocked = await I.grabCookie('mockIdamUserDetails');
    if (isMocked) {
      I.testLivedApartSinceSeparationPage();
    } else {
      I.testBehaviourContinuedSinceApplicationPage();
    }
  }

  I.testClaimCostsPage();
  I.testShareCourtDocumentsPage('no');

  I.testCheckYourAnswersPage();
  I.navByClick(CheckYourAnswersContent.en.submit);
  if (config.tests.functional.verifyOnCrossbrowser) {
    I.retry(2).waitForText('LV18D81234');
  } else {
    I.amOnLoadedPage(config.paths.done);
  }
};

Feature('Integration Tests');

Scenario('Happy Path for English language', async I => {
  await testHappyPath(I, 'en');
}).retry(2);

Scenario('Happy Path for Welsh language', async I => {
  await testHappyPath(I, 'cy');
}).retry(2);