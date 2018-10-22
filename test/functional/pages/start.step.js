const StartPage = require('steps/start/Start.step');
const StartPageContent = require('steps/start/Start.content');

function testHomePage() {
  const I = this;

  I.seeCurrentUrlEquals(StartPage.path);
  I.see(StartPageContent.en.title);
}

module.exports = { testHomePage };
