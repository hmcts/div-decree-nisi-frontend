/* eslint-disable max-len */
const { shimSessionQuestion } = require('middleware/shimSession');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const checkWelshToggle = require('middleware/checkWelshToggle');

const { form, text } = require('@hmcts/one-per-page/forms');

class CourtFeedback extends shimSessionQuestion {
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
    return [
      ...super.middleware,
      idam.protect(),
      checkWelshToggle
    ];
  }

  answers() {
    return answer(this, {
      question: this.content.fields.response.title,
      answer: this.fields.response.value
    });
  }
}

module.exports = CourtFeedback;
