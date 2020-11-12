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

function testLivedApartSinceLastIncidentDatePage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(LivedApartSinceLastIncidentDate.path, language);
  I.checkOption(LivedApartSinceLastIncidentDateContent[language].fields.changes.livedApartSinceLastIncidentDate.yes); // eslint-disable-line
  I.navByClick(commonContent[language].continue);

  I.seeCurrentUrlEquals(ClaimCosts.path);
}

module.exports = { testLivedApartSinceLastIncidentDatePage };
