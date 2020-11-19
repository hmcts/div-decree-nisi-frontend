const livedApartSinceAdultery = require(
  'steps/lived-apart-since-adultery/LivedApartSinceAdultery.step'
);
const livedApartSinceAdulteryContent = require(
  'steps/lived-apart-since-adultery/LivedApartSinceAdultery.content'
);
const ClaimsCosts = require('steps/claim-costs/ClaimCosts.step');
const commonContent = require('common/content');

function testLivedApartSinceAdulteryPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(livedApartSinceAdultery.path, language);
  I.checkOption(livedApartSinceAdulteryContent[language].fields.livedApart.livedApartSinceAdultery.no);
  I.fillField('livedApart.datesLivedTogether', 'some details');
  I.navByClick(commonContent[language].continue);
  I.seeCurrentUrlEquals(ClaimsCosts.path);

  I.seeCurrentUrlEquals(ClaimsCosts.path);
}

module.exports = { testLivedApartSinceAdulteryPage };
