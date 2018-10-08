const { Question } = require('@hmcts/one-per-page/steps');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const content = require('./ClaimCosts.content');

const respAmount = 'respAmount';
const originalAmount = 'originalAmount';
const alterAmount = 'alterAmount';
const dontClaim = 'dontClaim';

class ClaimCosts extends Question {
  static get path() {
    return config.paths.claimCosts;
  }

  get case() {
    return this.req.session.case.data;
  }

  get form() {
    const answers = [respAmount, originalAmount, alterAmount, dontClaim];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const fields = {
      divorceCostsOption: text.joi(this.content.errors.required, validAnswers),
      costsDifferentAmount: text
    };

    const validateNewAmount = ({ divorceCostsOption = '', costsDifferentAmount = '' }) => {
      if (divorceCostsOption === alterAmount && (!costsDifferentAmount.trim().length)) {
        return false;
      }

      return true;
    };

    const claimCosts = object(fields)
      .check(
        errorFor('costsDifferentAmount', this.content.errors.costsDifferentAmountRequired),
        validateNewAmount
      );


    return form({ claimCosts });
  }

  values() {
    const divorceCostsOption = this.fields.claimCosts.divorceCostsOption.value;

    const values = { divorceCostsOption };

    if (divorceCostsOption === alterAmount) {
      values.costsDifferentAmount = this.fields.claimCosts
        .costsDifferentAmount.value.trim();
    }

    return values;
  }

  answers() {
    const answers = [];
    let agreeAnswer = '';

    switch (this.fields.claimCosts.divorceCostsOption.value) {
    case respAmount:
      agreeAnswer = content.en.fields.claimCosts.suggestedAmount;
      break;
    case originalAmount:
      agreeAnswer = content.en.fields.claimCosts.courtSuggestedAmount;
      break;
    case alterAmount:
      agreeAnswer = content.en.fields.claimCosts.differentAmount;
      break;
    case dontClaim:
      agreeAnswer = content.en.fields.claimCosts.dontClaimDifferentAmount;
      break;
    default:
      agreeAnswer = '';
    }

    answers.push(answer(this, {
      question: this.content.fields.claimCosts.title,
      answer: agreeAnswer
    }));

    if (this.fields.claimCosts.divorceCostsOption.value === alterAmount) {
      const costsDifferentAmount = this.fields.claimCosts
        .costsDifferentAmount.value;

      answers.push(answer(this, {
        question: this.content.fields.amountToClaimAndReason.question,
        answer: costsDifferentAmount
      }));
    }

    return answers;
  }

  next() {
    return redirectTo(this.journey.steps.ShareCourtDocuments);
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = ClaimCosts;
