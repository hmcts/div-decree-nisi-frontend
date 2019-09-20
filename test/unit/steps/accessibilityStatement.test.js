const modulePath = 'steps/accessibility-statement/AccessibilityStatement.step';

const PrivacyPolicy = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
    return content(PrivacyPolicy);
  });
});