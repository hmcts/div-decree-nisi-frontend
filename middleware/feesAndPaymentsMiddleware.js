const feesAndPaymentsService = require('services/feesAndPaymentsService');
const logger = require('services/logger').getLogger(__filename);

const feeTypes = {
  issueFee: 'petition-issue-fee',
  amendFee: 'amend-fee',
  defendPetitionFee: 'defended-petition-fee',
  generalAppFee: 'general-application-fee',
  enforcementFee: 'enforcement-fee',
  appFinancialOrderFee: 'application-financial-order-fee',
  appWithoutNoticeFee: 'application-without-notice-fee'
};

const getFeeFromFeesAndPayments = feeType => {
  return (req, res, next) => {
    if (!res.locals.applicationFee) {
      res.locals.applicationFee = {};
    }
    return feesAndPaymentsService.getFee(feeType)
      .then(response => {
        res.locals.applicationFee[feeType] = response.amount;
        return next();
      })
      .catch(error => {
        logger.error(`Failed to fetch fee details for the feeType ${feeType}: ${error}`);
        next(error);
      });
  };
};


module.exports = {
  getFeeFromFeesAndPayments,
  feeTypes
};