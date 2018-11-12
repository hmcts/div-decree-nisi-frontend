const config = require('config');

const authTokenString = '__auth-token';

const redirectOnCondition = (req, res, next) => {
  // If state, there must be a CCD case
  const hasCcdCase = req.session && req.session.case;
  if (hasCcdCase && (!req.session.case.state || config.ccd.d8States.includes(req.session.case.state))) {
    // Set on query with authToken value
    const appLandingPage = `${config.services.petitionerFrontend.url}${config.services.petitionerFrontend.landing}`;
    const queryString = `?${authTokenString}=${req.cookies[authTokenString]}`;
    return res.redirect(`${appLandingPage}${queryString}`);
  }

  return next();
};

module.exports = { redirectOnCondition };