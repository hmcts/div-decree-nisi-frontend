const modulePath = 'steps/exit-no-case/ExitNoCase.step';

const ExitNoCase = require(modulePath);
const config = require('config');
const idam = require('services/idam');
const { middleware, custom } = require('@hmcts/one-per-page-test-suite');
const destroySession = require('@hmcts/one-per-page/src/session/destroySession');
const { METHOD_NOT_ALLOWED, MOVED_TEMPORARILY } = require('http-status-codes');

describe(modulePath, () => {
  it('has idam.landingPage middleware', () => {
    return middleware.hasMiddleware(ExitNoCase, [ destroySession, idam.logout() ]);
  });

  it('redirects to petitioner frontend', () => {
    return custom(ExitNoCase)
      .get()
      .expect('Location', config.services.petitionerFrontend.url)
      .expect(MOVED_TEMPORARILY);
  });

  it('returns method not allowed', () => {
    return custom(ExitNoCase)
      .post()
      .expect(METHOD_NOT_ALLOWED);
  });
});
