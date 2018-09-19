const moduleName = 'middleware/caseOrchestrationMiddleware';

const caseOrchestrationService = require('services/caseOrchestrationService');
const mockCaseOrchestrationService = require('mocks/services/caseOrchestrationService');
const caseOrchestrationMiddleware = require(moduleName);
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

const getApplicationResponse = { test: 'testData' };

let service = caseOrchestrationService;
if (['development'].includes(config.environment)) {
  service = mockCaseOrchestrationService;
}

describe(moduleName, () => {
  describe('submitApplication', () => {
    it('defined', () => {
      expect(caseOrchestrationMiddleware.hasOwnProperty('submitApplication')).to.eql(true);
    });

    it('adds response to req.session', done => {
      sinon.stub(service, 'submitApplication')
        .resolves(getApplicationResponse);

      const req = { session: {} };
      const res = { };
      const next = () => {
        expect(req.session).to.eql(getApplicationResponse);
        done();
      };

      caseOrchestrationMiddleware.submitApplication(req, res, next);

      service.submitApplication.restore();
    });

    it('returns error if rejected', done => {
      const errorMessage = 'error message';
      sinon.stub(service, 'submitApplication').rejects(errorMessage);

      const req = { session: {} };
      const res = { };
      const next = error => {
        expect(error.name).to.eql(errorMessage);
        done();
      };

      caseOrchestrationMiddleware.submitApplication(req, res, next);

      service.submitApplication.restore();
    });
  });

  describe('getApplication', () => {
    it('defined', () => {
      expect(caseOrchestrationMiddleware.hasOwnProperty('getApplication')).to.eql(true);
    });

    it('adds response to req.session', done => {
      sinon.stub(service, 'getApplication').resolves(getApplicationResponse);

      const req = { session: {} };
      const res = { };
      const next = () => {
        expect(req.session).to.eql(getApplicationResponse);
        done();
      };

      caseOrchestrationMiddleware.getApplication(req, res, next);

      service.getApplication.restore();
    });

    it('returns error if rejected', done => {
      const errorMessage = 'error message';
      sinon.stub(service, 'getApplication').rejects(errorMessage);

      const req = { session: {} };
      const res = { };
      const next = error => {
        expect(error.name).to.eql(errorMessage);
        done();
      };

      caseOrchestrationMiddleware.getApplication(req, res, next);

      service.getApplication.restore();
    });
  });
});
