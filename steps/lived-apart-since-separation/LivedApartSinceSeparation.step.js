const { Question } = require('@hmcts/one-per-page/steps');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');
const i18next = require('i18next');
const commonContent = require('common/content');
const { form, text, errorFor, object } = require('@hmcts/one-per-page/forms');

class LivedApartSinceSeparation extends Question {
  static get path() {
    return config.paths.livedApartSinceSeparation;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get form() {
    const validateDatesOfLivingTogether = ({ livedApartSinceSeparation = '', approximateDatesOfLivingTogetherField = '' }) => {
      // only validate if user has answered livedApartSinceSeparation
      const hasntAnsweredQuestion = !livedApartSinceSeparation.length;
      if (hasntAnsweredQuestion) {
        return true;
      }
      const hasAnsweredYes = livedApartSinceSeparation === 'yes';
      const hasAnsweredNo = livedApartSinceSeparation === 'no';
      const hasGivenDetails = approximateDatesOfLivingTogetherField.length > 0;
      return hasAnsweredYes || (hasAnsweredNo && hasGivenDetails);
    };

    const validate = Joi.string()
      .valid(['yes', 'no'])
      .required();

    const livedApartSinceSeparation = text.joi(this.content.errors.required,
      validate);

    const fields = {
      livedApartSinceSeparation,
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
      question: this.content.fields.changes.livedApartSinceSeparation.title,
      answer: this.content.fields
      // eslint-disable-next-line max-len
        .changes.livedApartSinceSeparation[this.fields.changes.livedApartSinceSeparation.value]
    }));

    if (this.fields.changes.livedApartSinceSeparation.value === 'no') {
      answers.push(answer(this, {
        // eslint-disable-next-line max-len
        question: this.content.fields.changes.approximateDatesOfLivingTogetherField.title,
        answer: this.fields.changes.approximateDatesOfLivingTogetherField.value
      }));
    }

    return answers;
  }

  values() {
    const selectedValue = this.fields.changes.livedApartSinceSeparation.value;
    if (selectedValue === 'yes') {
      return { 'changes.livedApartSinceSeparation': selectedValue };
    } else if (selectedValue === 'no') {
      return {
        'changes.livedApartSinceSeparation': selectedValue,
        'changes.approximateDatesOfLivingTogetherField': this.fields.changes.approximateDatesOfLivingTogetherField.value
      };
    }
    return {};
  }

  next() {
    const skipClaimCosts = this.case.claimsCosts === 'No';
    return branch(
      redirectTo(this.journey.steps.ShareCourtDocuments).if(skipClaimCosts),
      redirectTo(this.journey.steps.ClaimCosts)
    );
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = LivedApartSinceSeparation;
