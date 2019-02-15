const AmendApplication = require('steps/amend-application/AmendApplication.step');
const AmendContent = require('steps/amend-application/AmendApplication.content');

function testAmendApplication() {
  const I = this;

  I.amOnLoadedPage(AmendApplication.path);

  I.see(AmendContent.en.title);
}

module.exports = { testAmendApplication };