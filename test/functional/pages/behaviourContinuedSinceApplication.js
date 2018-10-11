const BehaviourContinuedSinceApplication = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step'
);
const BehaviourContinuedSinceApplicationContent = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.content'
);
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const commonContent = require('common/content');

function testBehaviourContinuedSinceApplicationPage() {
  const I = this;

  I.amOnLoadedPage(BehaviourContinuedSinceApplication.path);
  I.checkOption(BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.yes); // eslint-disable-line
  I.navByClick(commonContent.en.continue);

  I.seeCurrentUrlEquals(ClaimCosts.path);
}

module.exports = { testBehaviourContinuedSinceApplicationPage };
