const BehaviourContinuedSinceApplication = require(
  'steps/lived-apart-since-desertion/BehaviourContinuedSinceApplication.step'
);
const BehaviourContinuedSinceApplicationContent = require(
  'steps/lived-apart-since-desertion/BehaviourContinuedSinceApplication.content'
);
const commonContent = require('common/content');

function seeBehaviourContinuedSinceApplicationPage() {
  const I = this;

  I.seeCurrentUrlEquals(BehaviourContinuedSinceApplication.path);
  I.checkOption(BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeBehaviourContinuedSinceApplicationPage };
