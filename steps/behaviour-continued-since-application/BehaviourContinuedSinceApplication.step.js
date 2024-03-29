/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');
const moment = require('moment');
const { form, text, object, date, convert, errorFor } = require('@hmcts/one-per-page/forms');
const i18next = require('i18next');
const commonContent = require('common/content');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class BehaviourContinuedSinceApplication extends Question {
  static get path() {
    return config.paths.behaviourContinuedSinceApplication;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get form() {
    const validate = Joi.string()
      .valid(['yes', 'no'])
      .required();

    const validateIncidentDate = ({ behaviourContinuedSinceApplication = '', lastIncidentDate = '' }) => {
      // only validate if user has answered behaviourContinuedSinceApplication
      const hasntAnsweredQuestion = !behaviourContinuedSinceApplication.length;
      if (hasntAnsweredQuestion) {
        return true;
      }
      const hasAnsweredYes = behaviourContinuedSinceApplication === 'yes';
      const hasAnsweredNo = behaviourContinuedSinceApplication === 'no';
      const marriageDate = moment(this.case.marriageDate).format('YYYY-MM-DD');

      const hasGivenDate = this.fields.changes.lastIncidentDate.day.value && this.fields.changes.lastIncidentDate.month.value && this.fields.changes.lastIncidentDate.year.value
       && lastIncidentDate.isBetween(marriageDate, moment.now(), null, []); // eslint-disable-line
      return hasAnsweredYes || (hasAnsweredNo && hasGivenDate);
    };

    const behaviourContinuedSinceApplication = text
      .joi(this.content.errors.required, validate);

    const fields = {
      behaviourContinuedSinceApplication,
      lastIncidentDate: convert(
        d => moment(`${d.year}-${d.month}-${d.day}`, 'YYYY-MM-DD'), // eslint-disable-line
        date
      )
    };

    const changes = object(fields)
      .check(
        errorFor('lastIncidentDate', this.content.errors.requireLastIncidentDate),
        validateIncidentDate);

    return form({ changes });
  }

  values() {
    const behaviourContinues = this.fields.changes.behaviourContinuedSinceApplication.value;
    if (behaviourContinues === 'yes') {
      return { 'changes.behaviourContinuedSinceApplication': behaviourContinues };
    } else if (behaviourContinues === 'no') {
      return {
        'changes.behaviourContinuedSinceApplication': behaviourContinues,
        'changes.lastIncidentDate': this.fields.changes.lastIncidentDate.value
      };
    }
    return {};
  }

  next() {
    const hasAnsweredYes = this.fields.changes.behaviourContinuedSinceApplication.value === 'yes';
    const hasAnsweredNo = this.fields.changes.behaviourContinuedSinceApplication.value === 'no';
    const skipClaimCosts = this.case.claimsCosts === 'No';

    if (hasAnsweredNo) {
      this.case.lastIncidentDate = this.fields.changes.lastIncidentDate.value;
    }
    return branch(
      redirectTo(this.journey.steps.ShareCourtDocuments).if(hasAnsweredYes && skipClaimCosts),
      redirectTo(this.journey.steps.ClaimCosts).if(hasAnsweredYes),
      redirectTo(this.journey.steps.LivedApartSinceLastIncidentDate)
    );
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: this.content.fields.changes.behaviourContinuedSinceApplication.title,
      answer: this.content.fields
        // eslint-disable-next-line max-len
        .changes.behaviourContinuedSinceApplication[this.fields.changes.behaviourContinuedSinceApplication.value]
    }));

    if (this.fields.changes.behaviourContinuedSinceApplication.value === 'no') {
      answers.push(answer(this, {
        // eslint-disable-next-line max-len
        question: this.content.fields.changes.lastIncidentDate.question,
        answer: this.fields.changes.lastIncidentDate.value.format('Do MMMM YYYY')
      }));
    }
    return answers;
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect()
    ];
  }
}

module.exports = BehaviourContinuedSinceApplication;
