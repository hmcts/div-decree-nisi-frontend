const request = require('request-promise-native');
const config = require('config');

const feeCodeEndpoint = '/fees-and-payments/version/1/';

const getFee = feeType => {
  const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeType}`;
  return request.get({ uri, json: true });
};

module.exports = { getFee };