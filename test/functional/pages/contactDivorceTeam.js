
const ContactDivorceTeam = require('steps/contact-divorce-team/ContactDivorceTeam.step');
const ContactDivorceTeamContent = require('steps/contact-divorce-team/ContactDivorceTeam.content');

function testContactDivorceTeam(language = 'en') {
  const I = this;

  I.amOnLoadedPage(ContactDivorceTeam.path, language);

  I.see(ContactDivorceTeamContent[language].title);
}

module.exports = { testContactDivorceTeam };
