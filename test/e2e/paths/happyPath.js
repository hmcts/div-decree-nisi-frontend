Feature('Basic decree nisi path').retry(3);

Scenario.skip('Happy path', async I => {
  I.amOnLoadedPage('/');
  I.seeHomePage();
  await I.loginToIdam();
  I.seeUndefendedPage();
  I.seeReviewAosResponsePage();
  I.seeApplyForDecreeNisiPage();
  I.seeMiniPetitionPage();
  I.seeLivedApartSinceSeparationPage();
  I.seeClaimCostsPage();
  I.seeShareCourtDocumentsPage();
  I.seeCheckYourAnswersPage();
  I.seeDonePage();
});
