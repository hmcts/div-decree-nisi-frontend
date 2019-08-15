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
  I.waitInUrl(BehaviourContinuedSinceApplication.path, 5);
  I.retry(2).click(BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.yes); // eslint-disable-line
  I.navByClick(commonContent.en.continue);
  I.waitInUrl(ClaimCosts.path, 5);
  I.seeCurrentUrlEquals(ClaimCosts.path);
}

module.exports = { testBehaviourContinuedSinceApplicationPage };
