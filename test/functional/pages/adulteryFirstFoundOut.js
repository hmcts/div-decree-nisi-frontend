const AdulteryFirstFoundOut = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.step');
const stepContent = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.content');
const livedApartSinceAdultery = require(
  'steps/lived-apart-since-adultery/LivedApartSinceAdultery.step'
);

const commonContent = require('common/content');

function testAdulteryFirstFound(language = 'en', day = '2', month = '3', year = '2017') {
  const I = this;

  I.amOnLoadedPage(AdulteryFirstFoundOut.path, language);
  I.fillField(stepContent[language].dayLabel, day);
  I.fillField(stepContent[language].monthLabel, month);
  I.fillField(stepContent[language].yearLabel, year);
  I.navByClick(commonContent[language].continue);

  I.seeCurrentUrlEquals(livedApartSinceAdultery.path);
}

module.exports = { testAdulteryFirstFound };
