const caseOrchestrationService = require('services/caseOrchestrationService');
const mockCaseOrchestrationService = require('mocks/services/caseOrchestrationService');
const config = require('config');

let service = caseOrchestrationService;
if (['development'].includes(config.environment)) {
  service = mockCaseOrchestrationService;
}

const middleware = {
  getApplication: (req, res, next) => {
    service
      .getApplication(req)
      .then(response => {
        Object.assign(req.session, response);
      })
      .then(next)
      .catch(next);
  },
  submitApplication: (req, res, next) => {
    service
      .submitApplication(req)
      .then(response => {
        Object.assign(req.session, response);
      })
      .then(next)
      .catch(next);
  }
};

module.exports = middleware;
