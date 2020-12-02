const IdamMockLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const content = require('mocks/steps/idamLogin/IdamLogin.content');
const PetitionProgressBarPage = require('steps/petition-progress-bar/PetitionProgressBar.step');
const idamConfigHelper = require('test/functional/helpers/idamConfigHelper.js');

async function testIdamPage(success = true) {
  const I = this;

  I.wait(2);
  I.amOnLoadedPage('/');

  const currentPath = await I.getCurrentUrl();
  if (currentPath !== PetitionProgressBarPage.path) {
    if (currentPath === IdamMockLogin.path) {
      I.waitInUrl(IdamMockLogin.path);
      I.seeCurrentUrlEquals(IdamMockLogin.path);
      if (success) {
        I.checkOption(content.en.fields.success.yes);
      } else {
        I.checkOption(content.en.fields.success.no);
      }
      I.navByClick('Continue');
    } else {
      I.waitInUrl('/login?');
      await I.seeInCurrentUrl('/login?');
      I.fillField('username', idamConfigHelper.getTestEmail());
      I.fillField('password', idamConfigHelper.getTestPassword());
      I.navByClick('Sign in');
      I.wait(3);
    }
  }

  I.wait(3);
  I.waitInUrl(PetitionProgressBarPage.path);
}

module.exports = { testIdamPage };
