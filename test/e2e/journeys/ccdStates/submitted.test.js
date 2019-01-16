const { journey, sinon } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-case/mock-case');
const config = require('config');

const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const petitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const Entry = require('steps/entry/Entry.step');

const session = {
  respWillDefendDivorce: null
};

describe(
  'Case State : Submitted/AwaitingHWFDecision/AwaitingDocuments/Issued/PendingRejection',
  () => {
    before(() => {
      const getStub = sinon.stub(request, 'get');
      getStub
        .withArgs(sinon.match({
          uri: `${config.services.orchestrationService.getCaseUrl}`
        }))
        .resolves(merge({}, mockCaseResponse, { state: 'Submitted', data: session }));
    });

    after(() => {
      request.get.restore();
    });

    journey.test([
      { step: Start },
      { step: IdamLogin, body: { success: 'yes' } },
      { step: Entry },
      { step: petitionProgressBar }
    ]);
  });
