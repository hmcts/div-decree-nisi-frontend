const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const CheckYourAnswersContent = require('steps/check-your-answers/CheckYourAnswers.content');

function testCheckYourAnswersPage() {
  const I = this;

  I.amOnLoadedPage(CheckYourAnswers.path);
  I.checkOption(CheckYourAnswers.en.fields.statementOfTruth.yes);

  I.see(CheckYourAnswersContent.en.title);
}

module.exports = { testCheckYourAnswersPage };
