const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const ApplyForDecreeNisiContent = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.content');
const commonContent = require('common/content');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');

function testApplyForDecreeNisiPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(ApplyForDecreeNisi.path, language);
  I.waitInUrl(ApplyForDecreeNisi.path);
  I.retry(2).click(ApplyForDecreeNisiContent[language].fields.applyForDecreeNisi.yes);
  I.navByClick(commonContent[language].continue);
  I.waitInUrl(MiniPetition.path);
  I.seeCurrentUrlEquals(MiniPetition.path);
}

module.exports = { testApplyForDecreeNisiPage };
