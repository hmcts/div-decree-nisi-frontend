Feature('Basic decree nisi path').retry(3);

Scenario('Happy path', async I => {
  I.amOnLoadedPage('/');
  I.seeHomePage();
  await I.loginToIdam();
  I.seeUndefendedPage();
  I.seeReviewAosResponsePage();
  I.seeApplyForDecreeNisiPage();
  I.seeMiniPetitionPage();
  I.seeIntolerable();
  I.seeAdulteryFirstFound();
  I.seeLivedApartSinceAdulteryPage();
  I.seeClaimCostsPage();
  I.seeShareCourtDocumentsPage();
  I.seeCheckYourAnswersPage();
  I.seeDonePage();
});
