const { Question } = require('@hmcts/one-per-page/steps');
const { branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { getFeeFromFeesAndPayments, feeTypes } = require('middleware/feesAndPaymentsMiddleware');
const i18next = require('i18next');
const commonContent = require('common/content');

class RespNotAdmitAdultery extends Question {
  static get path() {
    return config.paths.respNotAdmitAdultery;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const amendPetition = text
      .joi(this.content.errors.required, validAnswers);

    return form({ amendPetition });
  }

  answers() {
    return answer(this, {
      question: this.content.fields.amendPetition.title,
      answer: this.content.fields
        .amendPetition[this.fields.amendPetition.value]
    });
  }

  next() {
    const amendPetition = () => {
      return this.fields.amendPetition.value === 'yes';
    };

    return branch(
      redirectTo(this.journey.steps.AmendApplication)
        .if(amendPetition),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }

  get amendFee() {
    return this.res.locals.applicationFee ? this.res.locals.applicationFee[feeTypes.amendFee] : '';
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments(feeTypes.amendFee)
    ];
  }
}

module.exports = RespNotAdmitAdultery;
