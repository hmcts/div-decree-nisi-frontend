const ClaimCosts = require(
  'steps/claim-costs/ClaimCosts.step'
);
const ClaimCostsContent = require(
  'steps/claim-costs/ClaimCosts.content'
);
const commonContent = require('common/content');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');

function testClaimCostsPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(ClaimCosts.path, language);
  I.click(ClaimCostsContent[language].fields.dnCosts.originalAmount);
  I.navByClick(commonContent[language].continue);
  I.waitInUrl(ShareCourtDocuments.path);
  I.seeCurrentUrlEquals(ShareCourtDocuments.path);
}

module.exports = { testClaimCostsPage };
