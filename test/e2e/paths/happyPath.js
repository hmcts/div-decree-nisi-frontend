Feature('Basic decree nisi path');

Scenario('Happy path', async I => {
  I.amOnLoadedPage('/');
  I.seeHomePage();
  await I.loginToIdam();
  I.seeUndefendedPage();
  I.seeEndPage();
});
