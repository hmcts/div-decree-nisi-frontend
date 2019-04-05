const IdamMockLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const content = require('mocks/steps/idamLogin/IdamLogin.content');
const PetitionProgressBarPage = require('steps/petition-progress-bar/PetitionProgressBar.step');
const SystemMessage = require('steps/system-message/SystemMessage.step');
const idamConfigHelper = require('test/functional/helpers/idamConfigHelper.js');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');

async function testIdamPage(success = true) {
  const I = this;

  I.amOnLoadedPage('/');

  const currentPath = await I.getCurrentUrl();

  if (currentPath !== PetitionProgressBarPage.path) {
    if (currentPath === IdamMockLogin.path) {
      I.seeCurrentUrlEquals(IdamMockLogin.path);
      if (success) {
        I.checkOption(content.en.fields.success.yes);
      } else {
        I.checkOption(content.en.fields.success.no);
      }
      I.navByClick('Continue');
    } else {
      await I.seeInCurrentUrl('/login?');
      I.fillField('username', idamConfigHelper.getTestEmail());
      I.fillField('password', idamConfigHelper.getTestPassword());
      I.navByClick('Sign in');
      I.wait(3);
    }
  }

  if (parseBool(config.features.showSystemMessage)) {
    I.seeCurrentUrlEquals(PetitionProgressBarPage.path);
  } else {
    I.seeCurrentUrlEquals(SystemMessage.path);
  }
}

module.exports = { testIdamPage };
