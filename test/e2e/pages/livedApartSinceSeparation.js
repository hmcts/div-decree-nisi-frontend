const LivedApartSinceSeparation = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.step'
);
const LivedApartSinceSeparationContent = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.content'
);
const commonContent = require('common/content');

function seeLivedApartSinceSeparationPage() {
  const I = this;

  I.seeCurrentUrlEquals(LivedApartSinceSeparation.path);
  I.checkOption(LivedApartSinceSeparationContent.en.fields.changes.livedApartSinceSeparation.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeLivedApartSinceSeparationPage };