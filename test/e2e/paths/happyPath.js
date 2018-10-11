Feature('Basic decree nisi path').retry(3);

Scenario('Happy path', async I => {
  I.amOnLoadedPage('/');
  I.seeHomePage();
  await I.loginToIdam();
  I.seeUndefendedPage();
  // I.seeReviewAosResponsePage(); - divdecreenisi user is having flag as null which skips this page
  I.seeApplyForDecreeNisiPage();
  I.seeMiniPetitionPage();
  I.seeLivedApartSinceSeparationPage();
  I.seeClaimCostsPage();
  I.seeShareCourtDocumentsPage();
  I.seeCheckYourAnswersPage();
  I.seeDonePage();
});
