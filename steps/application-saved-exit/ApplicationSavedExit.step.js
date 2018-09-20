const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');

const storePetitionerEmail = (req, res, next) => {
  res.locals.session.petitionerEmail = req.session.petitionerEmail;
  next();
};

class ApplicationSavedExit extends ExitPoint {
  static get path() {
    return config.paths.applicationSavedExit;
  }

  get middleware() {
    return [storePetitionerEmail, ...super.middleware];
  }
}

module.exports = ApplicationSavedExit;