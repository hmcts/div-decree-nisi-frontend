const DnNoResponse = require('steps/dn-no-response/DnNoResponse.step');

const DnNoResponseContent = require('steps/dn-no-response/DnNoResponse.content');

function testDnNoResponse() {
  const I = this;

  I.amOnLoadedPage(DnNoResponse.path);
  I.see(DnNoResponseContent.en.title);
}

module.exports = { testDnNoResponse };
