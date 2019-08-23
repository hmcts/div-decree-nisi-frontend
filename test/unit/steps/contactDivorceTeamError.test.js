const modulePath = 'steps/contact-divorce-team-error/ContactDivorceTeamError.step';

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
      'continue'
    ];
    return content(ContactDivorceTeam, {}, { ignoreContent });
  });
});
