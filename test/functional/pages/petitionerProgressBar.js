const ProgressBarStep = require('steps/petition-progress-bar/PetitionProgressBar.step');

const ProgressBarStepContent = require('steps/petition-progress-bar/PetitionProgressBar.content');

function testProgressBar() {
  const I = this;

  I.amOnLoadedPage(ProgressBarStep.path);
  I.see(ProgressBarStepContent.en.title);
}

module.exports = { testProgressBar };
