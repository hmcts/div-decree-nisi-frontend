const StartPage = require('steps/start/Start.step');
const StartPageContent = require('steps/start/Start.content');

function seeHomePage() {
  const I = this;

  I.seeCurrentUrlEquals(StartPage.path);
  I.see(StartPageContent.en.title);
  I.navByClick(StartPageContent.en.startNow);
}

module.exports = { seeHomePage };
