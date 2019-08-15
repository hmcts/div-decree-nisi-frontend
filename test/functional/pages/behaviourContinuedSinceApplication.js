const BehaviourContinuedSinceApplication = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step'
);
const BehaviourContinuedSinceApplicationContent = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.content'
);
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const commonContent = require('common/content');
const config = require('config');

function testBehaviourContinuedSinceApplicationPage() {
  const I = this;

  I.waitInUrl(BehaviourContinuedSinceApplication.path, 5);
  I.amOnLoadedPage(BehaviourContinuedSinceApplication.path);
  if (config.tests.functional.verifyOnCrossbrowser) {
    I.wait(2);
  }
  I.click(BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.yes); // eslint-disable-line
  I.navByClick(commonContent.en.continue);
  I.waitInUrl(ClaimCosts.path, 5);
  I.seeCurrentUrlEquals(ClaimCosts.path);
}

module.exports = { testBehaviourContinuedSinceApplicationPage };
