/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');

const { form, text, errorFor, object } = require('@hmcts/one-per-page/forms');

class LivedApartSinceDesertion extends Question {
  static get path() {
    return config.paths.livedApartSinceDesertion;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const validateDatesOfLivingTogether = ({ livedApartSinceDesertion = '', approximateDatesOfLivingTogetherField = '' }) => {
      // only validate if user has answered livedApartSinceDesertion
      const hasntAnsweredQuestion = !livedApartSinceDesertion.length;
      if (hasntAnsweredQuestion) {
        return true;
      }
      const hasAnsweredYes = livedApartSinceDesertion === 'yes';
      const hasAnsweredNo = livedApartSinceDesertion === 'no';
      const hasGivenDates = approximateDatesOfLivingTogetherField.length > 0;
      return hasAnsweredYes || (hasAnsweredNo && hasGivenDates);
    };

    const validate = Joi.string()
      .valid(['yes', 'no'])
      .required();

    const livedApartSinceDesertion = text.joi(this.content.errors.required, validate);

    const fields = {
      livedApartSinceDesertion,
      approximateDatesOfLivingTogetherField: text
    };

    const changes = object(fields)
      .check(
        errorFor('approximateDatesOfLivingTogetherField', this.content.errors.requireDatesOfLivingTogether),
        validateDatesOfLivingTogether);

    return form({ changes });
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: this.content.fields.changes.livedApartSinceDesertion.title,
      answer: this.content.fields
        // eslint-disable-next-line max-len
        .changes.livedApartSinceDesertion[this.fields.changes.livedApartSinceDesertion.value]
    }));

    if (this.fields.changes.livedApartSinceDesertion.value === 'no') {
      answers.push(answer(this, {
        // eslint-disable-next-line max-len
        question: this.content.fields.changes.approximateDatesOfLivingTogetherField.title,
        answer: this.fields.changes.approximateDatesOfLivingTogetherField.value
      }));
    }

    return answers;
  }

  next() {
    return redirectTo(this.journey.steps.ClaimCosts);
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = LivedApartSinceDesertion;
