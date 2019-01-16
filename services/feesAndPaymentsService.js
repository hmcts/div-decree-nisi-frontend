const request = require('request-promise-native');
const config = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const feeCodeEndpoint = '/fees-and-payments/version/1/';

const feeTypes = {
  issueFee: 'petition-issue-fee',
  amendFee: 'amend-fee',
  defendPetitionFee: 'defended-petition-fee',
  generalAppFee: 'general-application-fee',
  appFinancialOrderFee: 'application-financial-order-fee',
  appWithoutNoticeFee: 'application-without-notice-fee',
  getAllFees: 'get-all-fees'
};

const getFee = feeUrl => {
  const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeUrl}`;
  return request.get({ uri, json: true })
    .then(response => {
      return response ? response.amount : null;
    })
    .catch(error => {
      logger.error(`Trying to retrieve fee from fees and payment service: ${error}`);
      throw error;
    });
};

const issueFeeForApplication = () => {
  return getFee(feeTypes.issueFee);
};

const amendFee = () => {
  return getFee(feeTypes.amendFee);
};

const defendPetitionFee = () => {
  return getFee(feeTypes.defendPetitionFee);
};

const generalAppFee = () => {
  return getFee(feeTypes.generalAppFee);
};

const appFinancialOrderFee = () => {
  return getFee(feeTypes.appFinancialOrderFee);
};

const appWithoutNoticeFee = () => {
  return getFee(feeTypes.appWithoutNoticeFee);
};

const getAllFees = () => {
  return getFee(feeTypes.getAllFees);
};


module.exports = {
  getFee,
  issueFeeForApplication,
  amendFee,
  defendPetitionFee,
  generalAppFee,
  appFinancialOrderFee,
  appWithoutNoticeFee,
  getAllFees
};