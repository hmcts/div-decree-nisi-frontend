const LivedApartSinceLastIncidentDate = require(
  'steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.step'
);
const LivedApartSinceLastIncidentDateContent = require(
  'steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.content'
);
const commonContent = require('common/content');
const ClaimCosts = require(
  'steps/claim-costs/ClaimCosts.step'
);

function testLivedApartSinceLastIncidentDatePage() {
  const I = this;

  I.amOnLoadedPage(LivedApartSinceLastIncidentDate.path);
  I.checkOption(LivedApartSinceLastIncidentDateContent.en.fields.changes.livedApartSinceLastIncidentDate.yes); // eslint-disable-line
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(ClaimCosts.path);
}

module.exports = { testLivedApartSinceLastIncidentDatePage };
