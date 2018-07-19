const StartPage = require('steps/start/Start.step');

function seeHomePage() {
  const I = this;

  I.seeCurrentUrlEquals(StartPage.path);
  I.see('Start now');
  I.navByClick('Start now');
}

module.exports = { seeHomePage };
