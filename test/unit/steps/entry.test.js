const modulePath = 'steps/entry/Entry.step';

const Entry = require(modulePath);
const progressBarPage = require('steps/petition-progress-bar/PetitionProgressBar.step');
const ExitNoCase = require('steps/exit-no-case/ExitNoCase.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');

describe(modulePath, () => {
  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Entry, [ idam.authenticate() ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'authenticate').returns(middleware.nextMock);
      sinon.stub(caseOrchestrationService, 'getApplication');
    });

    afterEach(() => {
      idam.authenticate.restore();
      caseOrchestrationService.getApplication.restore();
    });

    it('to PetitionProgressBar page', () => {
      caseOrchestrationService.getApplication.resolves();
      return redirect.navigatesToNext(Entry, progressBarPage, null);
    });

    it('to ExitNoCase page if get application fails', () => {
      caseOrchestrationService.getApplication.rejects();
      return redirect.navigatesToNext(Entry, ExitNoCase);
    });
  });
});