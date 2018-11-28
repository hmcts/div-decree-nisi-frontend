const ClaimCosts = require(
  'steps/claim-costs/ClaimCosts.step'
);
const ClaimCostsContent = require(
  'steps/claim-costs/ClaimCosts.content'
);
const commonContent = require('common/content');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');

function testClaimCostsPage() {
  const I = this;

  I.amOnLoadedPage(ClaimCosts.path);
  I.checkOption(ClaimCostsContent.en.fields.dnCosts.originalAmount);
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(ShareCourtDocuments.path);
}

module.exports = { testClaimCostsPage };
