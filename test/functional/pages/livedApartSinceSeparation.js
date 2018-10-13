const LivedApartSinceSeparation = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.step'
);
const LivedApartSinceSeparationContent = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.content'
);
const commonContent = require('common/content');
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');

function testLivedApartSinceSeparationPage() {
  const I = this;

  I.amOnLoadedPage(LivedApartSinceSeparation.path);
  I.checkOption(LivedApartSinceSeparationContent.en.fields.changes.livedApartSinceSeparation.yes);
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(ClaimCosts.path);
}

module.exports = { testLivedApartSinceSeparationPage };
