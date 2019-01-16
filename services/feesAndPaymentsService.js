const request = require('request-promise-native');
const config = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const feeCodeEndpoint = '/fees-and-payments/version/1/';

const get = feeUrl => {
  const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeUrl}`;
  return request.get({ uri, json: true })
    .catch(error => {
      logger.error(`Trying to retrieve fee from fees and payment service: ${error}`);
      throw error;
    });
};

module.exports = { get };