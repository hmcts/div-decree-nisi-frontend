const { Question } = require('@hmcts/one-per-page/steps');
const { form, text, errorFor, object } = require('@hmcts/one-per-page/forms');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');

class LivedApartSinceAdultery extends Question {
  static get path() {
    return config.paths.livedApartSinceAdultery;
  }

  get case() {
    return this.req.session.case.data;
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const fields = {
      livedApartSinceAdultery: text
        .joi(this.content.errors.required, validAnswers),
      datesLivedTogether: text
    };

    const validateDatesLivedApart = ({ livedApartSinceAdultery = '', datesLivedTogether = '' }) => {
      // only validate if user has answered hasBeenChanges
      const hasntAnsweredQuestion = !livedApartSinceAdultery.length;
      if (hasntAnsweredQuestion) {
        return true;
      }
      const hasAnsweredYesLivedApart = livedApartSinceAdultery === 'yes';
      const hasAnsweredNoLivedApart = livedApartSinceAdultery === 'no';
      const hasGivenDetails = datesLivedTogether.length > 0;
      return hasAnsweredYesLivedApart || (hasAnsweredNoLivedApart && hasGivenDetails);
    };


    const livedApart = object(fields)
      .check(
        errorFor('datesLivedTogether', this.content.errors.requireDatesLivedTogether),
        validateDatesLivedApart
      );

    return form({ livedApart });
  }

  values() {
    const selectedValue = this.fields.livedApart.livedApartSinceAdultery.value;
    if (selectedValue === 'yes') {
      return { 'changes.livedApartSinceAdultery': selectedValue };
    } else if (selectedValue === 'no') {
      return {
        'changes.livedApartSinceAdultery': selectedValue,
        'changes.datesLivedTogether': this.fields.livedApart.datesLivedTogether.value
      };
    }
    return {};
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: this.content.fields.livedApart.livedApartSinceAdultery.title,
      answer: this.content.fields
        .livedApart.livedApartSinceAdultery[
          this.fields.livedApart.livedApartSinceAdultery.value
        ]
    }));

    if (this.fields.livedApart.livedApartSinceAdultery.value === 'no') {
      answers.push(answer(this, {
        question: this.content.fields.livedApart.datesLivedTogether.title,
        answer: this.fields.livedApart.datesLivedTogether.value
      }));
    }

    return answers;
  }

  next() {
    const skipClaimCosts = this.case.claimsCosts === 'No';
    return branch(
      redirectTo(this.journey.steps.ShareCourtDocuments).if(skipClaimCosts),
      redirectTo(this.journey.steps.ClaimCosts)
    );
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = LivedApartSinceAdultery;
