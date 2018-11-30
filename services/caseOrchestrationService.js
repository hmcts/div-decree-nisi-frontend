const request = require('request-promise-native');
const config = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');
const { NOT_FOUND } = require('http-status-codes');

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
        const notValidState = !response.state || config.ccd.d8States.includes(response.state);
        // if not digital court or no state or state is d8 state, throw error
        if (!config.ccd.courts.includes(response.courts) || notValidState) {
          const error = new Error('No case found in a valid state');
          error.statusCode = NOT_FOUND;
          throw error;
        }

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
