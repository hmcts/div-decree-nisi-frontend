const config = require('config');
const logger = require('services/logger').getLogger(__filename);

const authTokenString = '__auth-token';

const redirectToUrl = (req, res, baseUrl) => {
  const queryString = `${baseUrl}?${authTokenString}=${req.cookies[authTokenString]}`;
  res.redirect(`${queryString}`);
};

const redirectToFrontend = (req, res) => {
  logger.infoWithReq(req, 'redirect_to_petitioner', 'Redirecting user to Petitioner Frontend as no case was found on CCD');

  const petitionerFrontend = config.services.petitionerFrontend;
  redirectToUrl(req, res, `${petitionerFrontend.url}${petitionerFrontend.landing}`);
};

const redirectToFrontendAmend = (req, res) => {
  logger.infoWithReq(req, 'redirect_to_petitioner', 'Redirecting user to Petitioner Frontend to amend application');

  const petitionerFrontend = config.services.petitionerFrontend;
  res.redirect(`${petitionerFrontend.url}${petitionerFrontend.landing}?toNextUnansweredPage=true&${authTokenString}=${req.cookies[authTokenString]}`);
};

const redirectToAos = (req, res) => {
  logger.infoWithReq(req, 'redirecting_to_respondent', 'Redirecting user to AOS. User is a respondent user');

  const aosFrontend = config.services.aosFrontend;
  redirectToUrl(req, res, `${aosFrontend.url}${aosFrontend.landing}`);
};

module.exports = { redirectToFrontend, redirectToAos, redirectToFrontendAmend };
