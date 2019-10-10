const { journey, sinon } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-case/mock-case');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');

const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const petitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const Entry = require('steps/entry/Entry.step');

const feesAndPaymentsService = require('services/feesAndPaymentsService');

const session = {
  respDefendsDivorce: null
};

describe('Case State: DNisRefused - feature dnIsRefused is off', () => {
  const sandbox = sinon.createSandbox();
  before(() => {
    sandbox.stub(config, 'features').value({
      dnIsRefused: false
    });

    const getStub = sinon.stub(request, 'get');
    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, {
        state: 'DNisRefused',
        data: session
      }));

    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  after(() => {
    request.get.restore();
    feesAndPaymentsService.getFee.restore();
    sandbox.restore();
  });

  journey.test([
    { step: Start },
    { step: IdamLogin, body: { success: 'yes' } },
    { step: Entry },
    { step: petitionProgressBar }
  ]);
});

describe('Case State: DNisRefused - feature dnIsRefused is on', () => {
  const sandbox = sinon.createSandbox();

  before(() => {
    sandbox.stub(config, 'features').value({
      dnIsRefused: true
    });

    sinon.stub(caseOrchestrationService, 'amendRejectedApplication');
    sinon.stub(redirectToFrontendHelper, 'redirectToFrontendAmend');

    const getStub = sinon.stub(request, 'get');
    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, {
        state: 'DNisRefused',
        data: session
      }));

    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  after(() => {
    request.get.restore();
    feesAndPaymentsService.getFee.restore();
    redirectToFrontendHelper.redirectToFrontendAmend.restore();
    caseOrchestrationService.amendRejectedApplication.restore();
    sandbox.restore();
  });

  journey.test([
    { step: Start },
    { step: IdamLogin, body: { success: 'yes' } },
    { step: Entry },
    { step: petitionProgressBar }
  ]);
});
