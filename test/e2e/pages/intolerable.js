const Intolerable = require(
  'steps/intolerable/Intolerable.step'
);
const IntolerableContnet = require(
  'steps/intolerable/Intolerable.content'
);
const commonContent = require('common/content');

function seeIntolerable() {
  const I = this;

  I.seeCurrentUrlEquals(Intolerable.path);
  I.checkOption(IntolerableContnet.en.fields.changes.intolerable.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeIntolerable };
