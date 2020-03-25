const modulePath = 'steps/accessibility-statement/AccessibilityStatement.step';

const PrivacyPolicy = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
    const ignoreContent = [
      'continue',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'clarificationCourtFeedback',
      'backLink',
      'signIn'
    ];
    return content(PrivacyPolicy, {}, { ignoreContent });
  });
});
