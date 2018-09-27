const LivedApartSinceLastIncidentDate = require(
  'steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.step'
);
const LivedApartSinceLastIncidentDateContent = require(
  'steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.content'
);
const commonContent = require('common/content');

function seeLivedApartSinceLastIncidentDatePage() {
  const I = this;

  I.seeCurrentUrlEquals(LivedApartSinceLastIncidentDate.path);
  I.checkOption(LivedApartSinceLastIncidentDateContent.en.fields.changes.livedApartSinceLastIncidentDate.yes); // eslint-disable-line
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeLivedApartSinceLastIncidentDatePage };
