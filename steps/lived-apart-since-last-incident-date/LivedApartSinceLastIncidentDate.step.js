/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');
const { getUserData } = require('middleware/ccd');

const { form, text, errorFor, object } = require('@hmcts/one-per-page/forms');

class LivedApartSinceLastIncidentDate extends Question {
  static get path() {
    return config.paths.livedApartSinceLastIncidentDate;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const validateDatesOfLivingTogether = ({ livedApartSinceLastIncidentDate = '', approximateDatesOfLivingTogetherField = '' }) => {
      // only validate if user has answered livedApartSinceLastIncidentDate
      const hasntAnsweredQuestion = !livedApartSinceLastIncidentDate.length;
      if (hasntAnsweredQuestion) {
        return true;
      }
      const hasAnsweredYes = livedApartSinceLastIncidentDate === 'yes';
      const hasAnsweredNo = livedApartSinceLastIncidentDate === 'no';
      const hasGivenDates = approximateDatesOfLivingTogetherField.length > 0;
      return hasAnsweredYes || (hasAnsweredNo && hasGivenDates);
    };

    const validate = Joi.string()
      .valid(['yes', 'no'])
      .required();

    const livedApartSinceLastIncidentDate = text.joi(this.content.errors.required, validate);

    const fields = {
      livedApartSinceLastIncidentDate,
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
      question: this.content.fields.changes.livedApartSinceLastIncidentDate.title,
      answer: this.content.fields
        // eslint-disable-next-line max-len
        .changes.livedApartSinceLastIncidentDate[this.fields.changes.livedApartSinceLastIncidentDate.value]
    }));

    if (this.fields.changes.livedApartSinceLastIncidentDate.value === 'no') {
      answers.push(answer(this, {
        // eslint-disable-next-line max-len
        question: this.content.fields.changes.approximateDatesOfLivingTogetherField.title,
        answer: this.fields.changes.approximateDatesOfLivingTogetherField.value
      }));
    }

    return answers;
  }

  next() {
    return goTo(this.journey.steps.ClaimCosts);
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = LivedApartSinceLastIncidentDate;
