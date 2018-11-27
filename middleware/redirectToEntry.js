// if session is not setup
const sessionCookie = 'session';

const redirectToEntryIfNoSession = (req, res, next) => {
  if (!req.cookies[sessionCookie]) {
    return res.redirect('/entry');
  }

  return next();
};

module.exports = { redirectToEntryIfNoSession };