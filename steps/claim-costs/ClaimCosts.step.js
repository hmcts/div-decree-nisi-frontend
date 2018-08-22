const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { getUserData } = require('middleware/ccd');

class ClaimCosts extends Question {
  static get path() {
    return config.paths.claimCosts;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const answers = ['originalAmount', 'suggestedAmount', 'differentAmount'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const claimCosts = text
      .joi(this.content.errors.required, validAnswers);

    return form({ claimCosts });
  }

  next() {
    return goTo(this.journey.steps.End);
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = ClaimCosts;
