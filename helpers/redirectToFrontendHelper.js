const config = require('config');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const authTokenString = '__auth-token';

const redirectToFrontend = (req, res) => {
  logger.info('Redirecting user to Petitioner Frontend as no case was found on CCD');

  const petitionerFrontend = config.services.petitionerFrontend;
  const queryString = `?${authTokenString}=${req.cookies[authTokenString]}`;
  res.redirect(`${petitionerFrontend.url}${petitionerFrontend.landing}${queryString}`);
};

module.exports = redirectToFrontend;