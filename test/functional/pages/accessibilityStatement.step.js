const AccessibilityStatement = require('steps/accessibility-statement/AccessibilityStatement.step');
const AccessibilityStatementContent = require(
  'steps/accessibility-statement/AccessibilityStatement.content'
);

function testAccessibilityStatementPage() {
  const I = this;
  I.amOnLoadedPage(AccessibilityStatement.path);
  I.see(AccessibilityStatementContent.en.title);
}

module.exports = { testAccessibilityStatementPage };
