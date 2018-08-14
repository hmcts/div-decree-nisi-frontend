const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const MiniPetitionContent = require('steps/mini-petition/MiniPetition.content');
const commonContent = require('common/content');

function seeMiniPetitionPage() {
  const I = this;

  I.seeCurrentUrlEquals(MiniPetition.path);
  I.checkOption(MiniPetitionContent.en.fields.statementOfTruth.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeMiniPetitionPage };
