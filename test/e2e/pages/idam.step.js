const IdamMockLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const content = require('mocks/steps/idamLogin/IdamLogin.content');

async function loginToIdam(success = true) {
  const I = this;
  const currentPath = await I.getCurrentUrl();

  if (currentPath === IdamMockLogin.path) {
    I.seeCurrentUrlEquals(IdamMockLogin.path);
    if (success) {
      I.checkOption(content.en.fields.success.yes);
    } else {
      I.checkOption(content.en.fields.success.no);
    }
    I.navByClick('Continue');
  } else {
    I.seeInCurrentUrl('/login?');
    I.fillField('username', 'divdecreenisi@mailinator.com');
    I.fillField('password', 'Password21');
    I.navByClick('Sign in');
    I.wait(3);
  }
}

module.exports = { loginToIdam };
