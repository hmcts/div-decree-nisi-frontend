const { branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');

class ShareCourtDocuments extends Question {
  static get path() {
    return config.paths.shareCoreDocuments;
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

  answers() {
    const answers = [];
    answers.push(answer(this, {
      question: this.content.fields.upload.title,
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
