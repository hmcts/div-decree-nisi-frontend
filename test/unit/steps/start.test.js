const modulePath = 'steps/start/Start.step';

const Start = require(modulePath);
const Undefended = require('steps/undefended/Undefended.step');
const Entry = require('steps/entry/Entry.step');
const { middleware, content, expect, custom } = require('@hmcts/one-per-page-test-suite');
const { MOVED_TEMPORARILY } = require('http-status-codes');

const idam = require('services/idam');

describe(modulePath, () => {
  it('renders the page on GET', () => {
    const session = { case: { data: {} } };
    return content(Start, session, { ignoreContent: ['continue'] });
  });
  context('navigation', () => {
    it('to undefended page', () => {
      const session = {
        case: {}
      };
      return custom(Start)
        .withSession(session)
        .post()
        .expect('Location', Undefended.path)
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
  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Start, [ idam.setRedirectUri ]);
  });
});
