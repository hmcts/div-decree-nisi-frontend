const IdamMockLogin = require('mocks/steps/idamLogin/IdamLogin.step');

Feature('Smoke test', { retries: 2 });

Scenario('Can see index page', async I => {
  I.amOnLoadedPage('/');

  const currentPath = await I.getCurrentUrl();

  if (currentPath === IdamMockLogin.path) {
    I.seeCurrentUrlEquals(IdamMockLogin.path);
  } else {
    I.seeInCurrentUrl('/login?');
  }
});
