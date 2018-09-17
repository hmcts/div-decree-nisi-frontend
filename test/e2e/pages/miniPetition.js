const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const MiniPetitionContent = require('steps/mini-petition/MiniPetition.content');
const commonContent = require('common/content');

function seeMiniPetitionPage() {
  const I = this;

  I.seeCurrentUrlEquals(MiniPetition.path);
  I.checkOption(MiniPetitionContent.en.fields.changes.hasBeenChanges.no);
  I.checkOption(MiniPetitionContent.en.fields.changes.statementOfTruthNoChanges.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeMiniPetitionPage };
