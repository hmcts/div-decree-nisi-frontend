const moduleName = 'services/caseOrchestrationService';

const caseOrchestrationService = require(moduleName);
const request = require('request-promise-native');
const config = require('config');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');

describe(moduleName, () => {
  beforeEach(() => {
    sinon.stub(request, 'get');
    sinon.stub(request, 'post');
    sinon.stub(request, 'put');
  });

  afterEach(() => {
    request.get.restore();
    request.post.restore();
    request.put.restore();
  });

  describe('#getApplication', () => {
    beforeEach(() => {
      sinon.stub(caseOrchestrationHelper, 'validateResponse').returnsArg(1);
    });

    afterEach(() => {
      caseOrchestrationHelper.validateResponse.restore();
    });

    it('success', done => {
      const exampleCosResponse = { courts: 'serviceCentre', state: 'someState', foo: 'bar' };
      request.get.resolves(exampleCosResponse);
      const req = { cookies: { '__auth-token': 'token' }, session: {} };

      const uri = `${config.services.orchestrationService.getCaseUrl}`;
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

    it('rejects if error code returned', () => {
      const error = new Error('Server error');
      error.statusCode = INTERNAL_SERVER_ERROR;
      request.get.rejects(error);
      const req = { cookies: { '__auth-token': 'token' }, session: {} };

      return expect(caseOrchestrationService.getApplication(req))
        .to.be.rejectedWith(error);
    });
  });

  describe('submitApplication', () => {
    let req = {};
    let uri = '';
    let headers = {};

    const exampleSubmitBody = {
      foo: 'bar',
      bar: 'foo'
    };

    beforeEach(() => {
      sinon.stub(caseOrchestrationHelper, 'formatSessionForSubmit').returns(exampleSubmitBody);

      req = { cookies: { '__auth-token': 'token' }, session: { case: { caseId: '1234' } } };

      uri = `${config.services.orchestrationService.submitCaseUrl}/${req.session.case.caseId}`;
      headers = { Authorization: 'Bearer token' };
    });

    afterEach(() => {
      caseOrchestrationHelper.formatSessionForSubmit.restore();
    });

    it('submits case', done => {
      request.post.resolves();

      caseOrchestrationService.submitApplication(req)
        .then(() => {
          sinon.assert.calledWith(request.post, {
            uri,
            headers,
            json: true,
            body: exampleSubmitBody
          });
        })
        .then(done, done);
    });

    it('throws error if bad response from submission', () => {
      request.post.rejects();

      return expect(caseOrchestrationService.submitApplication(req))
        .to.be.rejectedWith('Error');
    });
  });

  it('throws error if bad response from get', () => {
    request.get.rejects();

    const req = {
      cookies: { '__auth-token': 'token' },
      session: {}
    };

    return expect(caseOrchestrationService.getApplication(req))
      .to.be.rejectedWith('Error');
  });

  describe('Amend Application', () => {
    let req = {};
    let uri = '';
    let headers = {};

    beforeEach(() => {
      req = { cookies: { '__auth-token': 'token' }, session: { case: { caseId: '1234' } } };
      const { caseId } = req.session.case;
      uri = `${config.services.orchestrationService.amendPetitionUrl}/${caseId}`;
      headers = { Authorization: 'Bearer token' };
    });


    it('sends the amend instruction to endpoint', done => {
      request.put.resolves();

      caseOrchestrationService.amendApplication(req)
        .then(() => {
          sinon.assert.calledWith(request.put, {
            uri,
            headers,
            json: true
          });
        })
        .then(done, done);
    });

    it('throws error if bad response from amend application endpoint', () => {
      request.put.rejects();

      return expect(caseOrchestrationService.amendApplication(req))
        .to.be.rejectedWith('Error');
    });
  });
});
