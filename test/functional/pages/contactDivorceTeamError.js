
const ContactDivorceTeamError = require(
  'steps/contact-divorce-team-error/ContactDivorceTeamError.step'
);
const ContactDivorceTeamErrorContent = require(
  'steps/contact-divorce-team-error/ContactDivorceTeamError.content'
);

function testContactDivorceTeamError() {
  const I = this;

  I.amOnLoadedPage(ContactDivorceTeamError.path);

  I.see(ContactDivorceTeamErrorContent.en.title);
}

module.exports = { testContactDivorceTeamError };
