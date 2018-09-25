const { mockSession } = require('test/fixtures');

const AdulteryFirstFoundOut = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.step');

const commonContent = require('common/content');

function seeAdulterFirstFound(day = mockSession.Day.toString(),
  month = mockSession.Month.toString(),
  year = mockSession.Year.toString()) {
  const I = this;

  I.seeCurrentUrlEquals(AdulteryFirstFoundOut.path);
  I.fillField('Day', day);
  I.fillField('Month', month);
  I.fillField('Year', year);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeAdulterFirstFound };
