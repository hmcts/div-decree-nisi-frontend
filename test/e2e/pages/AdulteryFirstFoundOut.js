const AdulteryFirstFoundOut = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.step');

const commonContent = require('common/content');

function seeAdulterFirstFound(day = '2', month = '3', year = '2017') {
  const I = this;

  I.seeCurrentUrlEquals(AdulteryFirstFoundOut.path);
  I.fillField('Day', day);
  I.fillField('Month', month);
  I.fillField('Year', year);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeAdulterFirstFound };
