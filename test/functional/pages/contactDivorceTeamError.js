
const ContactDivorceTeamError = require(
  'steps/contact-divorce-team-error/ContactDivorceTeamError.step'
);
const ContactDivorceTeamErrorContent = require(
  'steps/contact-divorce-team-error/ContactDivorceTeamError.content'
);

function testContactDivorceTeamError(language = 'en') {
  const I = this;

  I.amOnLoadedPage(ContactDivorceTeamError.path, language);

  I.see(ContactDivorceTeamErrorContent[language].title);
}

module.exports = { testContactDivorceTeamError };
