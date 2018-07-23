Feature('Basic decree nisi path');

Scenario('Happy path', I => {
  I.amOnLoadedPage('/');
  I.seeHomePage();
  I.loginToIdam();
  I.seeUndefendedPage();
  I.seeEndPage();
});
