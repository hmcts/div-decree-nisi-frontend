
const ContactDivorceTeam = require('steps/contact-divorce-team/ContactDivorceTeam.step');
const ContactDivorceTeamContent = require('steps/contact-divorce-team/ContactDivorceTeam.content');

function testContactDivorceTeam() {
  const I = this;

  I.amOnLoadedPage(ContactDivorceTeam.path);

  I.see(ContactDivorceTeamContent.en.title);
}

module.exports = { testContactDivorceTeam };
