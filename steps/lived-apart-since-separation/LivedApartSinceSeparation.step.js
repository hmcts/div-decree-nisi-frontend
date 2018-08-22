const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { getUserData } = require('middleware/ccd');

class LivedApartSinceSeparation extends Question {
  static get path() {
    return config.paths.livedApartSinceSeparation;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const livedApartSinceSeparation = text
      .joi(this.content.errors.required, validAnswers);

    return form({ livedApartSinceSeparation });
  }

  next() {
    return goTo(this.journey.steps.End);
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = LivedApartSinceSeparation;
