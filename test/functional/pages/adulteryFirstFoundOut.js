const AdulteryFirstFoundOut = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.step');
const livedApartSinceAdultery = require(
  'steps/lived-apart-since-adultery/LivedApartSinceAdultery.step'
);
const commonContent = require('common/content');

function testAdulteryFirstFound(day = '2', month = '3', year = '2017') {
  const I = this;

  I.amOnLoadedPage(AdulteryFirstFoundOut.path);
  I.fillField('Day', day);
  I.fillField('Month', month);
  I.fillField('Year', year);
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(livedApartSinceAdultery.path);
}

module.exports = { testAdulteryFirstFound };
