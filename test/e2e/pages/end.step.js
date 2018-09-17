const DonePage = require('steps/done/Done.step');

function seeDonePage() {
  const I = this;

  I.seeCurrentUrlEquals(DonePage.path);
}

module.exports = { seeDonePage };
