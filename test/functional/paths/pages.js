const basicDivorceSession = require('test/resources/basic-divorce-session');

const testAllPages = async(I, language = 'en') => {
  await I.retry(2).createAUser();

  await I.retry(2).createDnCaseForUser(basicDivorceSession);

  I.amOnLoadedPage('/', language);

  await I.testIdamPage();

  I.testProgressBar(language);

  I.testDnNoResponse(language);

  I.testAmendApplication(language);

  I.testRespNotAdmitAdultery(language);

  I.testReviewAosResponseFromCoRespondent(language);

  I.testAdulteryFirstFound(language);

  I.testApplyForDecreeNisiPage(language);

  I.testBehaviourContinuedSinceApplicationPage(language);

  I.testClaimCostsPage(language);

  I.testIntolerable(language);

  I.testLivedApartSinceAdulteryPage(language);

  I.testLivedApartSinceDesertionPage(language);

  I.testLivedApartSinceLastIncidentDatePage(language);

  I.testLivedApartSinceSeparationPage(language);

  I.testMiniPetitionPage(language);

  I.testReviewAosResponsePage(language);

  I.testShareCourtDocumentsPage('yes', language);

  await I.testUploadPage(language);

  I.testDesertionAskedToResumeDN(language);

  I.testCourtFeedback(language);

  I.testCheckYourAnswersPage(language);

  await I.testDonePage();

  await I.testExitPage();

  await I.testExitIntolerable();

  I.testContactDivorceTeam();

  I.testContactDivorceTeamError();

  I.testCookiesPolicyPage();

  I.testPrivacyPolicyPage();

  I.testTermsAndConditionsPage();

  I.testAccessibilityStatementPage();

  I.checkUrlsNotTested();
};

Feature('Test all pages');

Scenario('Pages with English language', async I => {
  await testAllPages(I, 'en');
}).retry(3);

Scenario('Pages with Welsh language', async I => {
  await testAllPages(I, 'cy');
}).retry(3);
