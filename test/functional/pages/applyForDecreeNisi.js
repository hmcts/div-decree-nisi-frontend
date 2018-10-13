const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const ApplyForDecreeNisiContent = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.content');
const commonContent = require('common/content');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');

function testApplyForDecreeNisiPage() {
  const I = this;

  I.amOnLoadedPage(ApplyForDecreeNisi.path);
  I.checkOption(ApplyForDecreeNisiContent.en.fields.applyForDecreeNisi.yes);
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(MiniPetition.path);
}

module.exports = { testApplyForDecreeNisiPage };
