const { Question } = require('@hmcts/one-per-page/steps');
const { branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const i18next = require('i18next');
const commonContent = require('common/content');

const constants = {
  no: 'no',
  yes: 'yes',
  deemed: 'deemed',
  dispensed: 'dispensed'
};

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

  get isDeemedApproved() {
    return this.isEqual(this.case.serviceApplicationGranted, constants.yes) && this.isEqual(this.case.serviceApplicationType, constants.deemed);
  }

  get isDispensedApproved() {
    return this.isEqual(this.case.serviceApplicationGranted, constants.yes) && this.isEqual(this.case.serviceApplicationType, constants.dispensed);
  }

  isEqual(dataElement, constant) {
    return dataElement && dataElement.toLowerCase() === constant;
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
      return this.fields.applyForDecreeNisi.value === constants.no;
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
}

module.exports = ApplyForDecreeNisi;
