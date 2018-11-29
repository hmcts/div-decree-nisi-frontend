const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const PetitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const idam = require('services/idam');
const { middleware, redirect, sinon, custom, expect } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const config = require('config');
const redirectToEntry = require('middleware/redirectToEntry');

describe(modulePath, () => {
  it('has idam.landingPage middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ idam.landingPage ]);
  });

  it('has conditional redirect middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ redirectToEntry.redirectToEntryIfNoSession ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'landingPage').callsFake(middleware.nextMock);
      sinon.stub(redirectToEntry, 'redirectToEntryIfNoSession').callsFake(middleware.nextMock);
      sinon.stub(caseOrchestrationService, 'getApplication');
    });

    afterEach(() => {
      idam.landingPage.restore();
      redirectToEntry.redirectToEntryIfNoSession.restore();
      caseOrchestrationService.getApplication.restore();
    });

    it('to PetitionProgressBar page', () => {
      caseOrchestrationService.getApplication.resolves();
      return redirect.navigatesToNext(Authenticated, PetitionProgressBar);
    });

    it('to error page if error is not 404', () => {
      const error = new Error('An error has occoured on the Case Orchestartion Service');
      error.statusCode = INTERNAL_SERVER_ERROR;
      caseOrchestrationService.getApplication.rejects(error);
      return custom(Authenticated)
        .get()
        .expect(INTERNAL_SERVER_ERROR)
        .text(pageContent => {
          return expect(pageContent.indexOf(error) !== -1).to.eql(true);
        });
    });

    it('to petitioner frontend  if error is 404', () => {
      const error = new Error('The case does not exist on CCD');
      error.statusCode = NOT_FOUND;
      caseOrchestrationService.getApplication.rejects(error);

      const authTokenString = '__auth-token';
      const petitionerFrontend = config.services.petitionerFrontend;
      // Undefined since req.cookies['__auth-token'] is not set in the test
      const queryString = `?${authTokenString}=undefined`;
      const expectedUrl = `${petitionerFrontend.url}${petitionerFrontend.landing}${queryString}`;

      return custom(Authenticated)
        .get()
        .expect('location', expectedUrl);
    });
  });
});
