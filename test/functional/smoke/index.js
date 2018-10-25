const StartPage = require('steps/start/Start.step');
const StartPageContent = require('steps/start/Start.content');

Feature('Smoke test', { retries: 2 });

Scenario('Can see index page', I => {
  I.amOnLoadedPage('/');
  I.seeCurrentUrlEquals(StartPage.path);
  I.see(StartPageContent.en.title);
});
