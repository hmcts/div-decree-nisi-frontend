const IdamLogin = require('mocks/steps/idamLogin/idamLogin.step');
const content = require('mocks/steps/idamLogin/idamLogin.content');

function loginToIdam(success = true) {
  const I = this;

  I.seeCurrentUrlEquals(IdamLogin.path);
  if (success) {
    I.checkOption(content.en.fields.success.yes);
  } else {
    I.checkOption(content.en.fields.success.no);
  }
  I.navByClick('Continue');
}

module.exports = { loginToIdam };
