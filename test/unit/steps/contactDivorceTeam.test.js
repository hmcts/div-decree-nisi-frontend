const modulePath = 'steps/contact-divorce-team/ContactDivorceTeam.step';

const ContactDivorceTeam = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
    const ignoreContent = ['continue'];
    return content(ContactDivorceTeam, {}, { ignoreContent });
  });
});
