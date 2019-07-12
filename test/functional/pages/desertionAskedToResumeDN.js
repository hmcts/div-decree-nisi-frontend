const DesertionAskedToResumeDN = require(
  'steps/desertion-asked-to-resume-dn/DesertionAskedToResumeDN.step'
);
const DesertionAskedToResumeDNContent = require(
  'steps/desertion-asked-to-resume-dn/DesertionAskedToResumeDN.content'
);
const LivedApartSinceDesertion = require('steps/lived-apart-since-desertion/LivedApartSinceDesertion.step'); // eslint-disable-line
const commonContent = require('common/content');

function testDesertionAskedToResumeDN() {
  const I = this;

  I.amOnLoadedPage(DesertionAskedToResumeDN.path);
  I.checkOption(DesertionAskedToResumeDNContent.en.fields.desertionAskedToResumeDN.no); // eslint-disable-line
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(LivedApartSinceDesertion.path);
}

module.exports = { testDesertionAskedToResumeDN };
