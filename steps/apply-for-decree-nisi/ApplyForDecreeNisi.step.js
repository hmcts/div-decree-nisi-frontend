const { Question } = require('@hmcts/one-per-page/steps');
const { branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const i18next = require('i18next');
const commonContent = require('common/content');
const idam = require('services/idam');
const Joi = require('joi');
const { isEqual, toLower } = require('lodash');
const {
  constants,
  isProcessServerService
} = require('helpers/petitionHelper');

class ApplyForDecreeNisi extends Question {
  static get path() {
    return config.paths.applyForDecreeNisi;
  }

  get case() {
    return this.req.session.case.data;
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const applyForDecreeNisi = text
      .joi(this.content.errors.required, validAnswers);

    return form({ applyForDecreeNisi });
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  answers() {
    return answer(this, {
      question: this.content.fields.applyForDecreeNisi.title,
      answer: this.content.fields
        .applyForDecreeNisi[this.fields.applyForDecreeNisi.value]
    });
  }

  next() {
    const declinesToApplyForDN = () => {
      return isEqual(toLower(this.fields.applyForDecreeNisi.value), constants.no);
    };

    return branch(
      redirectTo(this.journey.steps.Exit).if(declinesToApplyForDN),
      redirectTo(this.journey.steps.MiniPetition)
    );
  }


  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }

  get isServedByProcessServerService() {
    return isProcessServerService(this.case);
  }
}

module.exports = ApplyForDecreeNisi;
