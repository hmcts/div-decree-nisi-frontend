const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const content = require('steps/check-your-answers/CheckYourAnswers.content');

function seeCheckYourAnswersPage() {
  const I = this;

  I.seeCurrentUrlEquals(CheckYourAnswers.path);
  I.checkOption('statementOfTruth');
  I.navByClick(content.en.submit);
}

module.exports = { seeCheckYourAnswersPage };
