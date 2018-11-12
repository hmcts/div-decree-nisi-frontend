// if session is not setup
const sessionCookie = 'session';

const redirectToIndexIfNoSession = (req, res, next) => {
  if (!req.cookies[sessionCookie]) {
    return res.redirect('/');
  }

  return next();
};

module.exports = redirectToIndexIfNoSession;