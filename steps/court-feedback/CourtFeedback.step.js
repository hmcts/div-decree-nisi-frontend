/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');

const { form, text } = require('@hmcts/one-per-page/forms');

class CourtFeedback extends Question {
  static get path() {
    return config.paths.courtFeedback;
  }

  get case() {
    return this.req.session.case.data;
  }

  get form() {
    const validate = Joi.string()
      .required();

    const response = text.joi(this.content.errors.required, validate);

    return form({ response });
  }

  next() {
    return redirectTo(this.journey.steps.ShareCourtDocuments);
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }

  answers() {
    return answer(this, {
      question: this.content.fields.response.title,
      answer: this.fields.response.value
    });
  }
}

module.exports = CourtFeedback;
