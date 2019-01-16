const request = require('request-promise-native');
const config = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');

const authTokenString = '__auth-token';

const methods = {
  getApplication: req => {
    // no need to fetch case if we already have it
    if (req.session.case) {
      return Promise.resolve();
    }

    const uri = `${config.services.orchestrationService.getCaseUrl}`;
    const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };

    return request.get({ uri, headers, json: true })
      .then(response => {
        return caseOrchestrationHelper.validateResponse(req, response);
      })
      .then(response => {
        return Object.assign(req.session, { case: response });
      })
      .catch(error => {
        logger.error(`Trying to retrieve case from case orchestartion service: ${error}`);
        throw error;
      });
  },
  submitApplication: req => {
    const { caseId } = req.session.case;

    const uri = `${config.services.orchestrationService.submitCaseUrl}/${caseId}`;
    const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };
    const body = caseOrchestrationHelper.formatSessionForSubmit(req);

    return request.post({ uri, headers, json: true, body })
      .catch(error => {
        logger.error(`Trying to submit case to case orchestartion service: ${error}`);
        throw error;
      });
  }
};

module.exports = methods;
