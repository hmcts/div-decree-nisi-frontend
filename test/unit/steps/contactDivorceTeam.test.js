const modulePath = 'steps/contact-divorce-team/ContactDivorceTeam.step';

const ContactDivorceTeam = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
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
      'clarificationCourtFeedback',
      'signIn',
      'languageToggle'
    ];
    return content(ContactDivorceTeam, {}, { ignoreContent });
  });
});
