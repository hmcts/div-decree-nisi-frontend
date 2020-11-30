const Intolerable = require(
  'steps/intolerable/Intolerable.step'
);
const IntolerableContnet = require(
  'steps/intolerable/Intolerable.content'
);
const AdulteryFirstFoundOut = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.step');
const commonContent = require('common/content');

function testIntolerable(language = 'en') {
  const I = this;

  I.amOnLoadedPage(Intolerable.path, language);
  I.checkOption(IntolerableContnet[language].fields.changes.intolerable.yes);
  I.navByClick(commonContent[language].continue);

  I.waitInUrl(AdulteryFirstFoundOut.path);
  I.seeCurrentUrlEquals(AdulteryFirstFoundOut.path);
}

module.exports = { testIntolerable };
