const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const commonContent = require('common/content');

function seeCheckYourAnswersPage() {
  const I = this;

  I.seeCurrentUrlEquals(CheckYourAnswers.path);
  I.checkOption('statementOfTruth');
  I.navByClick(commonContent.en.continue);
}

module.exports = { seeCheckYourAnswersPage };
