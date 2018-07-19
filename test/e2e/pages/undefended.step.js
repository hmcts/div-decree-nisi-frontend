const UndefendedPage = require('steps/undefended/Undefended.step');

function seeUndefendedPage() {
  const I = this;

  I.seeCurrentUrlEquals(UndefendedPage.path);
}

module.exports = { seeUndefendedPage };
