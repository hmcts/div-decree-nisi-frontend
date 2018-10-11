const LivedApartSinceDesertion = require(
  'steps/lived-apart-since-desertion/LivedApartSinceDesertion.step'
);
const LivedApartSinceDesertionContent = require(
  'steps/lived-apart-since-desertion/LivedApartSinceDesertion.content'
);
const ClaimCosts = require(
  'steps/claim-costs/ClaimCosts.step'
);
const commonContent = require('common/content');

function testLivedApartSinceDesertionPage() {
  const I = this;

  I.amOnLoadedPage(LivedApartSinceDesertion.path);
  I.checkOption(LivedApartSinceDesertionContent.en.fields.changes.livedApartSinceDesertion.yes);
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(ClaimCosts.path);
}

module.exports = { testLivedApartSinceDesertionPage };
