const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const CheckYourAnswersContent = require('steps/check-your-answers/CheckYourAnswers.content');

function testCheckYourAnswersPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(CheckYourAnswers.path, language);
  I.retry(2).click(CheckYourAnswersContent[language].fields.statementOfTruth.yes);
  I.see(CheckYourAnswersContent[language].title);
}

module.exports = { testCheckYourAnswersPage };
