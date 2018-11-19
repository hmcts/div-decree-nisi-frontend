const modulePath = 'steps/start/Start.step';

const Start = require(modulePath);
const progressBarPage = require('steps/petition-progress-bar/PetitionProgressBar.step');
const Entry = require('steps/entry/Entry.step');
const { content, expect, custom } = require('@hmcts/one-per-page-test-suite');
const { MOVED_TEMPORARILY } = require('http-status-codes');

describe(modulePath, () => {
  it('renders the page on GET', () => {
    const session = { case: { data: {} } };
    return content(Start, session, { ignoreContent: ['continue'] });
  });
  context('navigation', () => {
    it('to PetitionProgressBar page', () => {
      const session = {
        case: {}
      };
      return custom(Start)
        .withSession(session)
        .post()
        .expect('Location', progressBarPage.path)
        .expect(MOVED_TEMPORARILY);
    });

    it('to entry page', () => {
      return custom(Start)
        .post()
        .expect('Location', Entry.path)
        .expect(MOVED_TEMPORARILY);
    });
  });
  it('ignores pa11y warnings', () => {
    expect(Start.ignorePa11yWarnings).to.include('WCAG2AA.Principle1.Guideline1_3.1_3_1.H48');
  });
});
