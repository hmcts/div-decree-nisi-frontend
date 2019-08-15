const ProgressBarStep = require('steps/petition-progress-bar/PetitionProgressBar.step');

const ProgressBarStepContent = require('steps/petition-progress-bar/PetitionProgressBar.content');

function testProgressBar() {
  const I = this;
  I.waitInUrl(ProgressBarStep.path, 5);
  I.amOnLoadedPage(ProgressBarStep.path);
  I.see(ProgressBarStepContent.en.title);
}

module.exports = { testProgressBar };
