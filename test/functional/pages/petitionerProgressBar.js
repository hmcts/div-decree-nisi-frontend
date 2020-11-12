const ProgressBarStep = require('steps/petition-progress-bar/PetitionProgressBar.step');

const ProgressBarStepContent = require('steps/petition-progress-bar/PetitionProgressBar.content');

function testProgressBar(language = 'en') {
  const I = this;
  I.waitInUrl(ProgressBarStep.path, 5);
  I.amOnLoadedPage(ProgressBarStep.path, language);
  I.see(ProgressBarStepContent[language].title);
}

module.exports = { testProgressBar };
