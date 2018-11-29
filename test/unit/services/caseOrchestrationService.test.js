const moduleName = 'services/caseOrchestrationService';

const caseOrchestrationService = require(moduleName);
const request = require('request-promise-native');
const config = require('config');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');
const { NOT_FOUND, FORBIDDEN } = require('http-status-codes');

describe(moduleName, () => {
  beforeEach(() => {
    sinon.stub(request, 'get');
    sinon.stub(request, 'post');
  });

  afterEach(() => {
    request.get.restore();
    request.post.restore();
  });

  describe('get case', () => {
    it('gets application from cos', done => {
      const exampleCosResponse = { courts: 'serviceCentre', state: 'someState', foo: 'bar' };
      request.get.resolves(exampleCosResponse);
      const req = { cookies: { '__auth-token': 'token' }, session: {}, idam: { userDetails: {} } };

      const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
      const headers = { Authorization: 'Bearer token' };

      caseOrchestrationService.getApplication(req)
        .then(response => {
          sinon.assert.calledWith(request.get, { uri, headers, json: true });
          expect(response).to.eql({ case: exampleCosResponse });
        })
        .then(done, done);
    });

    it('gets application from cos if respondent and petitioner are same', done => {
      const email = 'some@email.address';
      const exampleCosResponse = {
        state: 'someState',
        courts: 'serviceCentre',
        data: {
          respEmailAddress: email,
          petitionerEmail: email
        }
      };

      request.get.resolves(exampleCosResponse);
      const req = {
        cookies: { '__auth-token': 'token' },
        session: {},
        idam: {
          userDetails: { email }
        }
      };

      const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
      const headers = { Authorization: 'Bearer token' };

      caseOrchestrationService.getApplication(req)
        .then(response => {
          sinon.assert.calledWith(request.get, { uri, headers, json: true });
          expect(response).to.eql({ case: exampleCosResponse });
        })
        .then(done, done);
    });

    it('gets application from cos and respondent user', done => {
      const email = 'some@email.address';
      const exampleCosResponse = { data: { respEmailAddress: email } };
      request.get.resolves(exampleCosResponse);
      const req = {
        cookies: { '__auth-token': 'token' },
        session: {},
        idam: {
          userDetails: { email }
        }
      };

      const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
      const headers = { Authorization: 'Bearer token' };

      caseOrchestrationService.getApplication(req)
        .catch(error => {
          sinon.assert.calledWith(request.get, { uri, headers, json: true });
          expect(FORBIDDEN).to.eql(error.statusCode);
        })
        .then(done, done);
    });

    it('gets application from cos but returns not found when no state', done => {
      const exampleCosResponse = { courts: 'serviceCentre', foo: 'bar' };
      request.get.resolves(exampleCosResponse);
      const req = {
        cookies: { '__auth-token': 'token' },
        session: {},
        idam: {
          userDetails: {}
        }
      };

      const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
      const headers = { Authorization: 'Bearer token' };

      caseOrchestrationService.getApplication(req)
        .catch(error => {
          sinon.assert.calledWith(request.get, { uri, headers, json: true });
          expect(NOT_FOUND).to.eql(error.statusCode);
        })
        .then(done, done);
    });

    it('gets application from cos but returns not found when state is AwaitingPayment', done => {
      const exampleCosResponse = { courts: 'serviceCentre', state: 'AwaitingPayment', foo: 'bar' };
      request.get.resolves(exampleCosResponse);
      const req = { cookies: { '__auth-token': 'token' }, session: {} };

      const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
      const headers = { Authorization: 'Bearer token' };

      caseOrchestrationService.getApplication(req)
        .catch(error => {
          sinon.assert.calledWith(request.get, { uri, headers, json: true });
          expect(NOT_FOUND).to.eql(error.statusCode);
        })
        .then(done, done);
    });

    it('gets application from cos but returns not found when courts is missing', done => {
      const exampleCosResponse = { state: 'someState', foo: 'bar' };
      request.get.resolves(exampleCosResponse);
      const req = { cookies: { '__auth-token': 'token' }, session: {} };

      const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
      const headers = { Authorization: 'Bearer token' };

      caseOrchestrationService.getApplication(req)
        .catch(error => {
          sinon.assert.calledWith(request.get, { uri, headers, json: true });
          expect(NOT_FOUND).to.eql(error.statusCode);
        })
        .then(done, done);
    });

    it('gets application from cos but returns not found when courts is not digital', done => {
      const exampleCosResponse = { courts: 'eastMidlands', state: 'someState', foo: 'bar' };
      request.get.resolves(exampleCosResponse);
      const req = { cookies: { '__auth-token': 'token' }, session: {} };

      const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
      const headers = { Authorization: 'Bearer token' };

      caseOrchestrationService.getApplication(req)
        .catch(error => {
          sinon.assert.calledWith(request.get, { uri, headers, json: true });
          expect(NOT_FOUND).to.eql(error.statusCode);
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
  });

  describe('submission', () => {
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
});
