//const CheckYourAnswersContent = require('steps/check-your-answers/CheckYourAnswers.content');
//const config = require('config');
//const basicDivorceSession = require('test/resources/basic-divorce-session');
//
//const testHappyPath = async(I, language = 'en') => {
//  await I.retry(2).createAUser();
//  await I.retry(2).createDnCaseForUser(basicDivorceSession);
//
//  I.amOnLoadedPage('/', language);
//  await I.testIdamPage();
//
//  I.testProgressBar(language);
//  I.testApplyForDecreeNisiPage(language);
//  I.testMiniPetitionPage(language);
//
//  if (config.tests.functional.verifyOnCrossbrowser) {
//    I.testBehaviourContinuedSinceApplicationPage(language);
//  } else {
//    const isMocked = await I.grabCookie('mockIdamUserDetails');
//    if (isMocked) {
//      I.testLivedApartSinceSeparationPage(language);
//    } else {
//      I.testBehaviourContinuedSinceApplicationPage(language);
//    }
//  }
//
//  I.testClaimCostsPage(language);
//  I.testShareCourtDocumentsPage('no', language);
//
//  I.testCheckYourAnswersPage(language);
//  I.navByClick(CheckYourAnswersContent[language].submit);
//  if (config.tests.functional.verifyOnCrossbrowser) {
//    I.waitForText('LV18D81234', 30);
//  } else {
//    I.amOnLoadedPage(config.paths.done, language);
//  }
//};
//
//Feature('Integration Tests');
//
//Scenario('Happy Path for English language @cross-browser-test', async I => {
//  await testHappyPath(I, 'en');
//}).retry(2);
//
//Scenario('Happy Path for Welsh language', async I => {
//  await testHappyPath(I, 'cy');
//}).retry(2);
