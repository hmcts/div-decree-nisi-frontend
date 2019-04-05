const modulePath = 'steps/system-message/SystemMessage.step';

const SystemMessage = require(modulePath);
const PetitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const { content, navigatesToNext } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
    const ignoreContent = ['continue', 'serviceName', 'signOut'];
    const session = { case: { data: {} } };
    return content(SystemMessage, session, { ignoreContent });
  });

  it('redirects to PetitionProgressBar page', () => {
    return navigatesToNext(SystemMessage, PetitionProgressBar);
  });
});
