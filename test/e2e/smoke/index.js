Feature('Smoke test').retry(3);

Scenario('Can see index page', I => {
  I.amOnLoadedPage('/');
  I.seeHomePage();
});
