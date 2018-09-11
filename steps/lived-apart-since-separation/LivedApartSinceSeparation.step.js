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
    return config.paths.approximateDatesOfLivingTogetherField;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const validateKillMe = ({ hasLivedApartSinceSeparationAnswer = '', approximateDatesOfLivingTogetherField = '' }) => {
      console.log(hasLivedApartSinceSeparationAnswer, approximateDatesOfLivingTogetherField);

      // only validate if user has answered hasLivedApartSinceSeparationAnswer
      const hasntAnsweredQuestion = !hasLivedApartSinceSeparationAnswer.length;
      if (hasntAnsweredQuestion) {
        return true;
      }
      const hasAnsweredYes = hasLivedApartSinceSeparationAnswer === 'yes';
      const hasAnsweredNo = hasLivedApartSinceSeparationAnswer === 'no';
      const hasGivenDates = approximateDatesOfLivingTogetherField.length > 0;
      return hasAnsweredNo || (hasAnsweredYes && hasGivenDates);
    };

    const fields = {
      hasLivedApartSinceSeparationAnswer: text.joi(this.content.errors.required, Joi.string()
        .valid(['yes', 'no'])
        .required()),
      approximateDatesOfLivingTogetherField: text
    };

    const changes = object(fields)
      .check(
        errorFor('approximateDatesOfLivingTogetherField', this.content.errors.required),
        validateKillMe);

    return form({ changes });
  }

  /*
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
  */

  next() {
    return goTo(this.journey.steps.ClaimCosts);
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = LivedApartSinceSeparation;
