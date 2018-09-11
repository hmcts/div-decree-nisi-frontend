/* eslint-disable max-len,no-console */
const { Question } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');
const { getUserData } = require('middleware/ccd');

const { form, text, errorFor, object } = require('@hmcts/one-per-page/forms');

class LivedApartSinceSeparation extends Question {
  static get path() {
    return config.paths.livedApartSinceSeparation;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const validateKillMe = ({ livedApartSinceSeparation = '', approximateDatesOfLivingTogetherField = '' }) => {
      // only validate if user has answered hasLivedApartSinceSeparationAnswer
      const hasntAnsweredQuestion = !livedApartSinceSeparation.length;
      if (hasntAnsweredQuestion) {
        return true;
      }
      const hasAnsweredYes = livedApartSinceSeparation === 'yes';
      const hasAnsweredNo = livedApartSinceSeparation === 'no';
      const hasGivenDates = approximateDatesOfLivingTogetherField.length > 0;
      return hasAnsweredYes || (hasAnsweredNo && hasGivenDates);
    };

    const fields = {
      livedApartSinceSeparation: text.joi(this.content.errors.required, Joi.string()
        .valid(['yes', 'no'])
        .required()),
      approximateDatesOfLivingTogetherField: text
    };

    const changes = object(fields)
      .check(
        errorFor('approximateDatesOfLivingTogetherField', this.content.errors.requireDatesOfLivingTogether),
        validateKillMe);

    return form({ changes });
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: this.content.fields.hasLivedApartSinceSeparationAnswer.title,
      answer: this.content.fields
        .hasLivedApartSinceSeparationAnswer[
          this.fields.hasLivedApartSinceSeparationAnswer.value]
    }));
    answers.push(answer(this, {
      question: this.content.fields.approximateDatesOfLivingTogetherField.title,
      answer: this.content.fields
        .approximateDatesOfLivingTogetherField[
          this.fields.approximateDatesOfLivingTogetherField.value
        ]
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

module.exports = LivedApartSinceSeparation;
