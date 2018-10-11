const DonePage = require('steps/done/Done.step');
const DoneContent = require('steps/done/Done.content');

function testDonePage() {
  const I = this;

  I.amOnLoadedPage(DonePage.path);

  I.see(DoneContent.en.applicationComplete);
}

module.exports = { testDonePage };
