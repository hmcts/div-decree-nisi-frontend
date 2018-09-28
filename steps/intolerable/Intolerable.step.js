/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { branch, goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');
const { getUserData } = require('middleware/ccd');

const { form, text } = require('@hmcts/one-per-page/forms');

class Intolerable extends Question {
  static get path() {
    return config.paths.intolerable;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const validate = Joi.string()
      .valid(['yes', 'no'])
      .required();

    const intolerable = text.joi(this.content.errors.required, validate);

    return form({ intolerable });
  }

  answers() {
    return answer(this, {
      question: this.content.fields.changes.intolerable.title,
      answer: this.content.fields.changes.intolerable[this.fields.intolerable.value]
    });
  }

  next() {
    const hasAnsweredYes = this.fields.intolerable.value === 'yes';

    return branch(
      goTo(this.journey.steps.AdulteryFirstFoundOut).if(hasAnsweredYes),
      goTo(this.journey.steps.ExitIntolerable)
    );
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = Intolerable;
