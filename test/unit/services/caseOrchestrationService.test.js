const moduleName = 'services/caseOrchestrationService';

const caseOrchestrationService = require(moduleName);
const request = require('request-promise-native');
const config = require('config');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(moduleName, () => {
  beforeEach(() => {
    sinon.stub(request, 'get');
  });

  afterEach(() => {
    request.get.restore();
  });

  it('gets application from cos', done => {
    const exampleCosResponse = { foo: 'bar' }; // eslint-disable-line id-blacklist
    request.get.resolves(exampleCosResponse);
    const req = { cookies: { '__auth-token': 'token' }, session: {} };

    const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
    const headers = { Authorization: 'Bearer token' };

    caseOrchestrationService.getApplication(req)
      .then(response => {
        sinon.assert.calledWith(request.get, { uri, headers, json: true });
        expect(response).to.eql({ case: exampleCosResponse });
      })
      .then(done, done);
  });

  it('does not get application if already in session', done => {
    const req = { cookies: { '__auth-token': 'token' }, session: { case: {} } };

    caseOrchestrationService.getApplication(req)
      .then(() => {
        expect(request.get.called).to.eql(false);
      })
      .then(done, done);
  });

  it('defines submit application', () => {
    expect(caseOrchestrationService.hasOwnProperty('submitApplication')).to.eql(true);
  });
});
