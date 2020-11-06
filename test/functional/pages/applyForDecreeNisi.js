const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const ApplyForDecreeNisiContent = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.content');
const commonContent = require('common/content');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');

function testApplyForDecreeNisiPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(ApplyForDecreeNisi.path);
  I.waitInUrl(ApplyForDecreeNisi.path, 5);
  I.retry(2).click(ApplyForDecreeNisiContent[language].fields.applyForDecreeNisi.yes);
  I.navByClick(commonContent[language].continue);
  I.waitInUrl(MiniPetition.path, 5);
  I.seeCurrentUrlEquals(MiniPetition.path);
}

module.exports = { testApplyForDecreeNisiPage };
