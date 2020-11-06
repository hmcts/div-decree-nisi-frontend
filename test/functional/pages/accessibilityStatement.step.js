const AccessibilityStatement = require('steps/accessibility-statement/AccessibilityStatement.step');
const AccessibilityStatementContent = require(
  'steps/accessibility-statement/AccessibilityStatement.content'
);

function testAccessibilityStatementPage(language = 'en') {
  const I = this;
  I.amOnLoadedPage(AccessibilityStatement.path, language);
  I.see(AccessibilityStatementContent[language].title);
}

module.exports = { testAccessibilityStatementPage };
