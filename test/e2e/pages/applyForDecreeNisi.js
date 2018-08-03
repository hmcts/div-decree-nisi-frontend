const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const ApplyForDecreeNisiContent = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.content');
const commonContent = require('common/content');

function seeApplyForDecreeNisiPage() {
  const I = this;

  I.seeCurrentUrlEquals(ApplyForDecreeNisi.path);
  I.checkOption(ApplyForDecreeNisiContent.en.fields.applyForDecreeNisi.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeApplyForDecreeNisiPage };
