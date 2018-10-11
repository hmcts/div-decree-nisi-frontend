const Intolerable = require(
  'steps/intolerable/Intolerable.step'
);
const IntolerableContnet = require(
  'steps/intolerable/Intolerable.content'
);
const AdulteryFirstFoundOut = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.step');
const commonContent = require('common/content');

function testIntolerable() {
  const I = this;

  I.amOnLoadedPage(Intolerable.path);
  I.checkOption(IntolerableContnet.en.fields.changes.intolerable.yes);
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(AdulteryFirstFoundOut.path);
}

module.exports = { testIntolerable };
