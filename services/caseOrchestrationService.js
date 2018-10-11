const request = require('request-promise-native');
const config = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

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
        logger.error(`Trying to connect to Case orchestartion service error: ${error}`);
        throw error;
      });
  },
  submitApplication: () => {
    return Promise.resolve();
  }
};

module.exports = methods;
