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

function testLivedApartSinceDesertionPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(LivedApartSinceDesertion.path, language);
  I.checkOption(LivedApartSinceDesertionContent[language].fields.changes.livedApartSinceDesertion.yes);
  I.navByClick(commonContent[language].continue);

  I.seeCurrentUrlEquals(ClaimCosts.path);
}

module.exports = { testLivedApartSinceDesertionPage };
