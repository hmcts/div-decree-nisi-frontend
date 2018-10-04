const progressBarStep = require('steps/petition-progress-bar/PetitionProgressBar.step');

function seeProgressBar() {
  const I = this;

  I.seeCurrentUrlEquals(progressBarStep.path);
}

module.exports = { seeProgressBar };
