const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const MiniPetitionContent = require('steps/mini-petition/MiniPetition.content');
const commonContent = require('common/content');
const LivedApartSinceSeparation = require('steps/lived-apart-since-separation/LivedApartSinceSeparation.step'); // eslint-disable-line

function testMiniPetitionPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(MiniPetition.path, language);
  I.waitInUrl(MiniPetition.path);
  I.retry(2).click(MiniPetitionContent[language].fields.changes.hasBeenChanges.no);
  I.waitForText(MiniPetitionContent[language].fields.changes.statementOfTruthNoChanges.yes);
  I.retry(2).click(MiniPetitionContent[language].fields.changes.statementOfTruthNoChanges.yes);
  I.navByClick(commonContent[language].continue);
}

module.exports = { testMiniPetitionPage };
