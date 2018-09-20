const ApplicationSavedExit = require('steps/application-saved-exit/ApplicationSavedExit.step');

function seeApplicationSavedExitPage() {
  const I = this;

  I.seeCurrentUrlEquals(ApplicationSavedExit.path);
}

module.exports = { seeApplicationSavedExitPage };
