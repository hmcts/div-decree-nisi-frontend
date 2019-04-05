const modulePath = 'steps/entry/Entry.step';

const Entry = require(modulePath);
const PetitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const SystemMessage = require('steps/system-message/SystemMessage.step');
const idam = require('services/idam');
const { middleware, redirect, sinon, custom, expect } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');
const config = require('config');

describe(modulePath, () => {
  const sandbox = sinon.createSandbox();

  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Entry, [ idam.authenticate ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'authenticate').callsFake(middleware.nextMock);
      sinon.stub(caseOrchestrationService, 'getApplication');
      sinon.spy(caseOrchestrationHelper, 'handleErrorCodes');
    });

    afterEach(() => {
      idam.authenticate.restore();
      caseOrchestrationService.getApplication.restore();
      caseOrchestrationHelper.handleErrorCodes.restore();
    });

    describe('showSystemMessage feature off', () => {
      before(() => {
        sandbox.replace(config.features, 'showSystemMessage', false);
      });

      after(() => {
        sandbox.restore();
      });

      it('to PetitionProgressBar page', () => {
        caseOrchestrationService.getApplication.resolves();
        return redirect.navigatesToNext(Entry, PetitionProgressBar, null);
      });
    });

    describe('showSystemMessage feature on', () => {
      before(() => {
        sandbox.replace(config.features, 'showSystemMessage', true);
      });

      after(() => {
        sandbox.restore();
      });

      it('to SystemMessage page', () => {
        caseOrchestrationService.getApplication.resolves();
        return redirect.navigatesToNext(Entry, SystemMessage, null);
      });
    });

    it('calls caseOrchestrationHelper.handleErrorCodes on failure', () => {
      const error = new Error('An error has occoured on the Case Orchestartion Service');
      error.statusCode = INTERNAL_SERVER_ERROR;
      caseOrchestrationService.getApplication.rejects(error);
      return custom(Entry)
        .get()
        .expect(INTERNAL_SERVER_ERROR)
        .text(pageContent => {
          expect(pageContent.indexOf(error) !== -1).to.eql(true);
          return expect(caseOrchestrationHelper.handleErrorCodes.calledOnce).to.eql(true);
        });
    });
  });
});
