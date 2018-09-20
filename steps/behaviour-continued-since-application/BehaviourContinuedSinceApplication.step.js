/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');
const { getUserData } = require('middleware/ccd');

const { form, text } = require('@hmcts/one-per-page/forms');

class BehaviourContinuedSinceApplication extends Question {
  static get path() {
    return config.paths.behaviourContinuedSinceApplication;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const validate = Joi.string()
      .valid(['yes', 'no'])
      .required();

    const behaviourContinuedSinceApplication = text
      .joi(this.content.errors.required, validate);

    return form({ behaviourContinuedSinceApplication });
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: this.content.fields.changes.behaviourContinuedSinceApplication.title,
      answer: this.content.fields
        // eslint-disable-next-line max-len
        .changes.behaviourContinuedSinceApplication[this.fields.changes.behaviourContinuedSinceApplication.value]
    }));
    return answers;
  }

  next() {
    return goTo(this.journey.steps.ClaimCosts);
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = BehaviourContinuedSinceApplication;
