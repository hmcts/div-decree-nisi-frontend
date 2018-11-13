const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const PetitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const idam = require('services/idam');
const { middleware, redirect, sinon, custom, expect } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');
const { NOT_FOUND, INTERNAL_SERVER_ERROR, FORBIDDEN } = require('http-status-codes');
const config = require('config');
const redirectToIndex = require('middleware/redirectToIndex');

describe(modulePath, () => {
  it('has idam.landingPage middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ idam.landingPage() ]);
  });

  it('has conditional redirect middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ redirectToIndex.redirectToIndexIfNoSession ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'landingPage').returns(middleware.nextMock);
      sinon.stub(redirectToIndex, 'redirectToIndexIfNoSession').callsFake(middleware.nextMock);
      sinon.stub(caseOrchestrationService, 'getApplication');
    });

    afterEach(() => {
      idam.landingPage.restore();
      redirectToIndex.redirectToIndexIfNoSession.restore();
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

    it('to aos if error is 403', () => {
      const error = new Error('Respondent user');
      error.statusCode = FORBIDDEN;
      caseOrchestrationService.getApplication.rejects(error);

      const authTokenString = '__auth-token';
      const aosFrontend = config.services.aosFrontend;
      // Undefined since req.cookies['__auth-token'] is not set in the test
      const queryString = `?${authTokenString}=undefined`;
      const expectedUrl = `${aosFrontend.url}${aosFrontend.landing}${queryString}`;

      return custom(Authenticated)
        .get()
        .expect('location', expectedUrl);
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
