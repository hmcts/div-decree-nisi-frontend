const BehaviourContinuedSinceApplication = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step'
);
const BehaviourContinuedSinceApplicationContent = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.content'
);
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const commonContent = require('common/content');

function testBehaviourContinuedSinceApplicationPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(BehaviourContinuedSinceApplication.path, language);
  I.waitInUrl(BehaviourContinuedSinceApplication.path);
  I.retry(2).click(BehaviourContinuedSinceApplicationContent[language].fields.changes.behaviourContinuedSinceApplication.yes); // eslint-disable-line
  I.navByClick(commonContent[language].continue);
  I.waitInUrl(ClaimCosts.path);
  I.seeCurrentUrlEquals(ClaimCosts.path);
}

module.exports = { testBehaviourContinuedSinceApplicationPage };
