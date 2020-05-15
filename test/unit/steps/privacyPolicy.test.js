const modulePath = 'steps/privacy-policy/PrivacyPolicy.step';

const PrivacyPolicy = require(modulePath);
const { middleware, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has no middleware', () => {
    return middleware.hasMiddleware(PrivacyPolicy, []);
  });

  describe('values', () => {
    it('displays correct details', () => {
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'continue',
        'yourName',
        'clarificationCourtFeedback',
        'backLink',
        'signIn',
        'languageToggle'
      ];

      return content(PrivacyPolicy, {}, { ignoreContent });
    });
  });
});
