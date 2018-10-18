const LivedApartSinceAdultery = require(
  'steps/lived-apart-since-adultery/LivedApartSinceAdultery.step'
);
const LivedApartSinceAdulteryContent = require(
  'steps/lived-apart-since-adultery/LivedApartSinceAdultery.content'
);
const commonContent = require('common/content');

function seeLivedApartSinceAdulteryPage() {
  const I = this;

  I.seeCurrentUrlEquals(LivedApartSinceAdultery.path);
  I.checkOption(LivedApartSinceAdulteryContent.en.fields.livedApart.livedApartSinceAdultery.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeLivedApartSinceAdulteryPage };