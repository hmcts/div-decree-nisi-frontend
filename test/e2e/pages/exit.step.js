const ExitPage = require('steps/exit/Exit.step');

function seeExitPage() {
  const I = this;

  I.seeCurrentUrlEquals(ExitPage.path);
}

module.exports = { seeExitPage };
