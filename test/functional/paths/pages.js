Feature('Test all pages');

Scenario('Pages', async I => {
  //Create user
  I.createAUser();
  //Create case
  I.createDnCaseForUser('basic-divorce-session');

  I.amOnLoadedPage('/');

  I.testHomePage();

  await I.testIdamPage();

  I.testProgressBar();

  I.testDnNoResponse();

  I.testAdulteryFirstFound();

  I.testApplyForDecreeNisiPage();

  I.testBehaviourContinuedSinceApplicationPage();

  I.testClaimCostsPage();

  I.testIntolerable();

  I.testLivedApartSinceAdulteryPage();

  I.testLivedApartSinceDesertionPage();

  I.testLivedApartSinceLastIncidentDatePage();

  I.testLivedApartSinceSeparationPage();

  I.testMiniPetitionPage();

  I.testReviewAosResponsePage();

  I.testShareCourtDocumentsPage();

  await I.testUploadPage();

  I.testCheckYourAnswersPage();

  I.testDonePage();

  await I.testExitPage();

  await I.testExitIntolerable();

  I.checkUrlsNotTested();
});
