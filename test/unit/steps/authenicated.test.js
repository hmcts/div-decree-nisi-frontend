const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const Undefended = require('steps/undefended/Undefended.step');
const Start = require('steps/start/Start.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');

describe(modulePath, () => {
  it('has idam.landingPage middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ idam.landingPage() ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'landingPage').returns(middleware.nextMock);
      sinon.stub(caseOrchestrationService, 'getApplication');
    });

    afterEach(() => {
      idam.landingPage.restore();
      caseOrchestrationService.getApplication.restore();
    });

    it('to undefended page', () => {
      caseOrchestrationService.getApplication.resolves();
      return redirect.navigatesToNext(Authenticated, Undefended);
    });

    it('to error page if get application fails', () => {
      caseOrchestrationService.getApplication.rejects();
      return redirect.navigatesToNext(Authenticated, Start);
    });
  });
});
