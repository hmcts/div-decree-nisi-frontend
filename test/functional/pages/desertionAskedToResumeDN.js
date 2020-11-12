const DesertionAskedToResumeDN = require(
  'steps/desertion-asked-to-resume-dn/DesertionAskedToResumeDN.step'
);
const DesertionAskedToResumeDNContent = require(
  'steps/desertion-asked-to-resume-dn/DesertionAskedToResumeDN.content'
);
const LivedApartSinceDesertion = require('steps/lived-apart-since-desertion/LivedApartSinceDesertion.step'); // eslint-disable-line
const commonContent = require('common/content');

function testDesertionAskedToResumeDN(language = 'en') {
  const I = this;

  I.amOnLoadedPage(DesertionAskedToResumeDN.path, language);
  I.checkOption(DesertionAskedToResumeDNContent[language].fields.desertionAskedToResumeDN.no); // eslint-disable-line
  I.navByClick(commonContent[language].continue);

  I.seeCurrentUrlEquals(LivedApartSinceDesertion.path);
}

module.exports = { testDesertionAskedToResumeDN };
