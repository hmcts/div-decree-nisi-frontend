const EndPage = require('steps/end/End.step');

function seeEndPage() {
  const I = this;

  I.seeCurrentUrlEquals(EndPage.path);
}

module.exports = { seeEndPage };
