Feature('Smoke test', { retries: 2 });

Scenario('Can see index page', async I => {
  I.amOnLoadedPage('/');

  I.testHomePage();

  await I.testIdamPage();
});
