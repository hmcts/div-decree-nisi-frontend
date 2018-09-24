const BehaviourContinuedSinceApplication = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step'
);
const BehaviourContinuedSinceApplicationContent = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.content'
);
const commonContent = require('common/content');

function seeBehaviourContinuedSinceApplicationPage() {
  const I = this;

  I.seeCurrentUrlEquals(BehaviourContinuedSinceApplication.path);
  I.checkOption(BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.yes);
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeBehaviourContinuedSinceApplicationPage };
