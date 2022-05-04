/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');
const i18next = require('i18next');
const commonContent = require('common/content');
const { form, text } = require('@hmcts/one-per-page/forms');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class Intolerable extends Question {
  static get path() {
    return config.paths.intolerable;
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

    const intolerable = text.joi(this.content.errors.required, validate);

    return form({ intolerable });
  }

  answers() {
    return answer(this, {
      question: this.content.fields.changes.intolerable.title,
      answer: this.content.fields.changes.intolerable[this.fields.intolerable.value]
    });
  }

  next() {
    const hasAnsweredYes = this.fields.intolerable.value === 'yes';

    return branch(
      redirectTo(this.journey.steps.AdulteryFirstFoundOut).if(hasAnsweredYes),
      redirectTo(this.journey.steps.ExitIntolerable)
    );
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect()
    ];
  }
}

module.exports = Intolerable;
