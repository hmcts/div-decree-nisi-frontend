const request = require('request-promise-native');
const config = require('config');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const feeCodeEndpoint = '/fees-and-payments/version/1/';

const getFee = feeType => {
  logger.error({
    message: 'config loaded',
    config
  });
  const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeType}`;
  return request.get({ uri, json: true });
};

module.exports = { getFee };