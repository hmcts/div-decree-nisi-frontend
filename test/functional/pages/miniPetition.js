const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const MiniPetitionContent = require('steps/mini-petition/MiniPetition.content');
const commonContent = require('common/content');
const Intolerable = require('steps/intolerable/Intolerable.step');

function testMiniPetitionPage() {
  const I = this;

  I.amOnLoadedPage(MiniPetition.path);
  I.checkOption(MiniPetitionContent.en.fields.changes.hasBeenChanges.no);
  I.checkOption(MiniPetitionContent.en.fields.changes.statementOfTruthNoChanges.yes);
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(Intolerable.path);
}

module.exports = { testMiniPetitionPage };
