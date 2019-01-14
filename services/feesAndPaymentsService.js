const request = require('request-promise-native');
const config = require('config');

const feeCodeEndpoint = '/fees-and-payments/version/1/';

const get = feeUrl => {
  const uri = `${config.services.feesAndPayments.baseUrl}${feeCodeEndpoint}${feeUrl}`;
  return request.get({ uri, json: true });
};

module.exports = { get };