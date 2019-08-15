const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const ApplyForDecreeNisiContent = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.content');
const commonContent = require('common/content');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');

function testApplyForDecreeNisiPage() {
  const I = this;

  I.amOnLoadedPage(ApplyForDecreeNisi.path);
  I.waitInUrl(ApplyForDecreeNisi.path, 5);
  I.retry(2).click(ApplyForDecreeNisiContent.en.fields.applyForDecreeNisi.yes);
  I.navByClick(commonContent.en.continue);
  I.waitInUrl(MiniPetition.path, 5);
  I.seeCurrentUrlEquals(MiniPetition.path);
}

module.exports = { testApplyForDecreeNisiPage };
