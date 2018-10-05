const ClaimCosts = require(
  'steps/claim-costs/ClaimCosts.step'
);
const ClaimCostsContent = require(
  'steps/claim-costs/ClaimCosts.content'
);
const commonContent = require('common/content');

function seeClaimCostsPage() {
  const I = this;

  I.seeCurrentUrlEquals(ClaimCosts.path);
  I.checkOption(ClaimCostsContent.en.fields.claimCosts.differentAmount);
  I.fillField('#claimCosts-costsDifferentAmount', 'Amount and reason');
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeClaimCostsPage };
