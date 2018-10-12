const request = require('request-promise-native');
const config = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const sessionToCosMapping = require('resources/sessionToCosMapping');
const { get } = require('lodash');

const formatSessionForSubmit = session => {
  return Object.keys(sessionToCosMapping)
    .reduce((body, key) => {
      const value = get(session, key);
      if (value) {
        body[sessionToCosMapping[key]] = value;
      }
      return body;
    }, {});
};

const authTokenString = '__auth-token';

const methods = {
  getApplication: req => {
    // no need to fetch case if we already have it
    if (req.session.case) {
      return Promise.resolve();
    }

    const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
    const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };

    return request.get({ uri, headers, json: true })
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
    const body = formatSessionForSubmit(req.session);

    return request.post({ uri, headers, json: true, body })
      .catch(error => {
        logger.error(`Trying to submit case to case orchestartion service: ${error}`);
        throw error;
      });
  }
};

module.exports = methods;
