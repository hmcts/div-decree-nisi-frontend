const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');
const ccd = require('middleware/ccd');

class MiniPetition extends Question {
  static get path() {
    return config.paths.miniPetition;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = ['yes'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const statementOfTruth = text
      .joi(this.content.errors.required, validAnswers);

    return form({ statementOfTruth });
  }

  answers() {
    return answer(this, {
      question: this.content.fields.statementOfTruth.title,
      answer: this.content.fields
        .statementOfTruth[this.fields.statementOfTruth.value]
    });
  }

  next() {
    return goTo(this.journey.steps.LivedApartSinceSeparation);
  }

  get middleware() {
    return [...super.middleware, idam.protect(), ccd.getUserData];
  }
}

module.exports = MiniPetition;
