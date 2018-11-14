const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');

const constants = {
  originalAmount: 'originalAmount',
  specificAmount: 'specificAmount',
  endClaim: 'endClaim',
  respAgreeToCosts: 'respAgreeToCosts',
  yes: 'Yes',
  no: 'No'
};

class ClaimCosts extends Question {
  static get path() {
    return config.paths.claimCosts;
  }

  get case() {
    return this.req.session.case.data;
  }

  get consts() {
    return constants;
  }

  notExist(key) {
    return this.case[key] === this.consts.no;
  }

  get form() {
    const answers = [
      this.consts.originalAmount,
      this.consts.specificAmount,
      this.consts.endClaim
    ];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const claimCosts = text
      .joi(this.content.errors.required, validAnswers);

    return form({ claimCosts });
  }

  answers() {
    return answer(this, {
      question: this.content.fields.claimCosts.title,
      answer: this.content.fields.claimCosts[this.fields.claimCosts.value]
    });
  }

  next() {
    return redirectTo(this.journey.steps.ShareCourtDocuments);
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = ClaimCosts;
