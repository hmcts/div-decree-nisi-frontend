const request = require('request-promise-native');
const config = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const methods = {
  getApplication: req => {
    const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
    const authTokenString = '__auth-token';
    const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };

    return request.get({ uri, headers, json: true })
      .then(response => {
        return { case: response };
      })
      .catch(error => {
        logger.error(`Trying to connect to Case orchestartion service error: ${error}`);
        throw error;
      });
  },
  submitApplication: () => {
    return new Promise(resolve => {
      resolve({});
    });
  }
};

module.exports = methods;
