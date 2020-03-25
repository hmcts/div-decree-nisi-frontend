const modulePath = 'steps/exit-intolerable/ExitIntolerable.step';

const ExitIntolerable = require(modulePath);
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
      'signIn'
    ];

    const session = { case: { data: {} } };
    return content(ExitIntolerable, session, { ignoreContent });
  });
});
