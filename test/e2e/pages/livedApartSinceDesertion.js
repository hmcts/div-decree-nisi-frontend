const LivedApartSinceDesertion = require(
  'steps/lived-apart-since-desertion/LivedApartSinceDesertion.step'
);
const LivedApartSinceDesertionContent = require(
  'steps/lived-apart-since-desertion/LivedApartSinceDesertion.content'
);
const commonContent = require('common/content');

function seeLivedApartSinceDesertionPage() {
  const I = this;

  I.seeCurrentUrlEquals(LivedApartSinceDesertion.path);
  I.checkOption(LivedApartSinceDesertionContent.en.fields.changes.livedApartSinceDesertion.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeLivedApartSinceDesertionPage };
