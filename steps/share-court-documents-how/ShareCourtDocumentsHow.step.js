const { branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { notDefined, awaitingClarification } = require('common/constants');

const constants = {
  adultery: 'adultery',
  no: 'No',
  notDefined,
  awaitingClarification
};

class ShareCourtDocumentsHow extends Question {
  static get path() {
    return config.paths.shareCoreDocumentsHow;
  }

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : constants.NotDefined;
  }

  get case() {
    return this.req.session.case.data;
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const clarificationDigital = text
      .joi(this.content.errors.required, validAnswers);

    return form({ clarificationDigital });
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: this.content.fields.clarificationDigital.title,
      answer: this.content.fields.clarificationDigital[
        this.fields.clarificationDigital.value
      ]
    }));

    return answers;
  }

  next() {
    const uploadFiles = () => {
      return this.fields.clarificationDigital.value === 'yes';
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

module.exports = ShareCourtDocumentsHow;
