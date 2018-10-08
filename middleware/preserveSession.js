// preserve session to render done page
const preserveSession = (req, res, next) => {
  req.preservedSession = req.session;
  next();
};

module.exports = preserveSession;
