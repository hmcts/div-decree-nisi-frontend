const { journey, sinon } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-aos-case/mock-case');
const config = require('config');
const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const petitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const reviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');

const session = {
  respDefendsDivorce: 'Yes'
};

describe('AosSubmittedAwaitingAnswer DN flow', () => {
  before(() => {
    const getStub = sinon.stub(request, 'get');
    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, {
        state: 'AosSubmittedAwaitingAnswer', data: session
      }));
  });
  after(() => {
    request.get.restore();
  });
  journey.test([
    { step: Start },
    { step: IdamLogin, body: { success: 'yes' } },
    { step: petitionProgressBar },
    { step: reviewAosResponse }
  ]);
});