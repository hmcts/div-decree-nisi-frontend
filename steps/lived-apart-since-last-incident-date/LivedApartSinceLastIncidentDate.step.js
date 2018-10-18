/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');

const { form, text, errorFor, object } = require('@hmcts/one-per-page/forms');

class LivedApartSinceLastIncidentDate extends Question {
  static get path() {
    return config.paths.livedApartSinceLastIncidentDate;
  }

  get case() {
    return this.req.session.case.data;
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
    const skipClaimCosts = this.case.d8DivorceCostsClaim === 'No';
    return branch(
      redirectTo(this.journey.steps.ShareCourtDocuments).if(skipClaimCosts),
      redirectTo(this.journey.steps.ClaimCosts)
    );
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = LivedApartSinceLastIncidentDate;
