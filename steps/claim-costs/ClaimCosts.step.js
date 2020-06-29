const { Question } = require('@hmcts/one-per-page/steps');
const { form, text, errorFor, object } = require('@hmcts/one-per-page/forms');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const i18next = require('i18next');
const commonContent = require('common/content');

const constants = {
  originalAmount: 'originalAmount',
  differentAmount: 'differentAmount',
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

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
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
      this.consts.differentAmount,
      this.consts.endClaim
    ];

    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const fields = {
      claimCosts: text
        .joi(this.content.errors.required, validAnswers),
      costsDifferentDetails: text
    };

    const validateCostsDifferentDetails = ({ claimCosts = '', costsDifferentDetails = '' }) => {
      // only validate if user has answered hasBeenChanges
      const isSpecAmntSelected = claimCosts === this.consts.differentAmount;
      if (!isSpecAmntSelected) {
        return true;
      }
      return costsDifferentDetails.length > 0;
    };

    const dnCosts = object(fields)
      .check(
        errorFor('costsDifferentDetails', this.content.errors.requiredCostsDifferentDetails),
        validateCostsDifferentDetails
      );

    return form({ dnCosts });
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: this.content.fields.dnCosts.title,
      answer: this.content.fields.dnCosts[this.fields.dnCosts.claimCosts.value]
    }));

    if (this.fields.dnCosts.claimCosts.value === this.consts.differentAmount) {
      answers.push(answer(this, {
        question: this.content.fields.dnCosts.costsDifferentDetails.title,
        answer: this.fields.dnCosts.costsDifferentDetails.value
      }));
    }

    return answers;
  }

  values() {
    const claimcostsValue = this.fields.dnCosts.claimCosts.value;

    switch (claimcostsValue) {
    case this.consts.originalAmount:
      return { 'dnCosts.claimCosts': claimcostsValue };
    case this.consts.differentAmount:
      return {
        'dnCosts.claimCosts': claimcostsValue,
        'dnCosts.costsDifferentDetails': this.fields.dnCosts.costsDifferentDetails.value
      };
    case this.consts.endClaim:
      return { 'dnCosts.claimCosts': claimcostsValue };
    default: return {};
    }
  }


  next() {
    return redirectTo(this.journey.steps.ShareCourtDocuments);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = ClaimCosts;
