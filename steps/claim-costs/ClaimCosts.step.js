const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');

class ClaimCosts extends Question {
  static get path() {
    return config.paths.claimCosts;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = ['originalAmount', 'suggestedAmount', 'dontClaimDifferentAmount'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const claimCosts = text
      .joi(this.content.errors.required, validAnswers);

    return form({ claimCosts });
  }

  answers() {
    return answer(this, {
      question: this.content.fields.claimCosts.title,
      answer: this.content.fields.claimCosts[this.fields.claimCosts.value]
    });
  }

  next() {
    return redirectTo(this.journey.steps.ShareCourtDocuments);
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = ClaimCosts;
