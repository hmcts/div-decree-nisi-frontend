/* eslint-disable */

const IdamMockLogin = require('mocks/steps/idamLogin/IdamLogin.step');

Feature('Smoke test');

Scenario('Can see index page', async I => {
  I.amOnLoadedPage('/');

  // temporarliy disable smoke
  // const currentPath = await I.getCurrentUrl();
  //
  // if (currentPath === IdamMockLogin.path) {
  //   I.seeCurrentUrlEquals(IdamMockLogin.path);
  // } else {
  //   I.seeInCurrentUrl('/login?');
  // }
}).retry(3);
