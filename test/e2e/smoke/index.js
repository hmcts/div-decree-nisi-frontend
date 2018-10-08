Feature('Smoke test', { retries: 2 });

Scenario('Can see index page', async I => {
  I.amOnLoadedPage('/');
  await I.loginToIdam();
  I.seeUndefendedPage();
});
