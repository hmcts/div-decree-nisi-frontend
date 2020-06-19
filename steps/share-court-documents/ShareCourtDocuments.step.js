const { branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { parseBool } = require('@hmcts/one-per-page/util');
const { notDefined, awaitingClarification } = require('common/constants');

const constants = {
  adultery: 'adultery',
  no: 'No',
  notDefined,
  awaitingClarification
};

class ShareCourtDocuments extends Question {
  static get path() {
    return config.paths.shareCoreDocuments;
  }

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : constants.NotDefined;
  }

  get isAwaitingClarification() {
    const isDnOutcomeCase = parseBool(this.case.dnOutcomeCase);
    const featureIsEnabled = parseBool(config.features.awaitingClarification);
    const isCorrectState = this.caseState === constants.awaitingClarification;

    return isDnOutcomeCase && featureIsEnabled && isCorrectState;
  }

  get case() {
    return this.req.session.case.data;
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const upload = text
      .joi(this.content.errors.required, validAnswers);

    return form({ upload });
  }

  get respNotAdmittedAdultery() {
    return this.case.reasonForDivorce === constants.adultery && this.case.respAdmitOrConsentToFact === constants.no;
  }

  answers() {
    let title = this.content.fields.upload.title;
    if (this.isAwaitingClarification) {
      title = this.content.clarification.title;
    }

    const answers = [];
    answers.push(answer(this, {
      question: title,
      answer: this.content.fields.upload[this.fields.upload.value]
    }));

    return answers;
  }

  next() {
    const uploadFiles = () => {
      return this.fields.upload.value === 'yes';
    };

    return branch(
      redirectTo(this.journey.steps.Upload).if(uploadFiles),
      redirectTo(this.journey.steps.CheckYourAnswers)
    );
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = ShareCourtDocuments;
