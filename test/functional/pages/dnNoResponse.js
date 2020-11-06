const DnNoResponse = require('steps/dn-no-response/DnNoResponse.step');

const DnNoResponseContent = require('steps/dn-no-response/DnNoResponse.content');

function testDnNoResponse(language = 'en') {
  const I = this;

  I.amOnLoadedPage(DnNoResponse.path, language);
  I.see(DnNoResponseContent[language].title);
}

module.exports = { testDnNoResponse };
