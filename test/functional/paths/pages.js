Feature('Test all pages');

Scenario('Pages', async I => {
  I.amOnLoadedPage('/');

  I.testHomePage();

  await I.testIdamPage();

  I.testUndefendedPage();

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
