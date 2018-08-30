const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { getUserData } = require('middleware/ccd');

class ReviewAosResponse extends Question {
  static get path() {
    return config.paths.reviewAosResponse;
  }

  get session() {
    return this.req.session;
  }

  next() {
    return goTo(this.journey.steps.ApplyForDecreeNisi);
  }

  get form() {
    const answers = ['yes'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const reviewAosResponse = text
      .joi('', validAnswers);

    return form({ reviewAosResponse });
  }

  answers() {
    return answer(this, {
      question: this.content.fields.reviewAosResponse.title,
      answer: this.content.fields.reviewAosResponse.yes
    });
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = ReviewAosResponse;
