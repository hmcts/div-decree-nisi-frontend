const { shimSessionQuestion } = require('middleware/shimSession');
const { form, text } = require('@hmcts/one-per-page/forms');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');
const commonContent = require('common/content');

const constants = {
  viewOnlyState: 'AosSubmittedAwaitingAnswer',
  viewTemplate: './templates/ViewResponse.html',
  reviewTemplate: './templates/ReviewResponse.html',
  sep5yr: 'separation-5-years',
  sep2yr: 'separation-2-years',
  desertion: 'desertion',
  behaviour: 'unreasonable-behaviour',
  adultery: 'adultery',
  yes: 'Yes',
  no: 'No',
  notAccept: 'NoNoAdmission',
  AosCompleted: 'AosCompleted',
  differentAmount: 'DifferentAmount'
};

class ReviewAosResponse extends shimSessionQuestion {
  static get path() {
    return config.paths.reviewAosResponse;
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

  get behaviour() {
    return this.case.reasonForDivorce === this.consts.behaviour;
  }

  get desertion() {
    return this.case.reasonForDivorce === this.consts.desertion;
  }

  get adultery() {
    return this.case.reasonForDivorce === this.consts.adultery;
  }

  get sep2yr() {
    return this.case.reasonForDivorce === this.consts.sep2yr;
  }

  get sep5yr() {
    return this.case.reasonForDivorce === this.consts.sep5yr;
  }

  get doesNotConsent() {
    return this.case.respAdmitOrConsentToFact === this.consts.no;
  }

  get adulteryWishToName() {
    return this.case.reasonForDivorceAdulteryWishToName && this.case.reasonForDivorceAdulteryWishToName === this.consts.yes;
  }

  get receivedAosFromCoResp() {
    return this.case.coRespondentAnswers && this.case.coRespondentAnswers.aos.received === this.consts.yes;
  }

  get responseTemplate() {
    if (this.req.session.case.state === this.consts.viewOnlyState) {
      return this.consts.viewTemplate;
    }
    return this.consts.reviewTemplate;
  }

  next() {
    const respNotAdmitAdultery = () => {
      return this.adultery && this.case.respAdmitOrConsentToFact === this.consts.no && this.req.session.case.state === this.consts.AosCompleted;
    };

    const amendAplication = () => {
      return this.sep2yr && this.doesNotConsent && this.req.session.case.state === constants.AosCompleted;
    };

    const reviewAosRespCoRespondent = () => {
      return this.adultery && this.adulteryWishToName && this.receivedAosFromCoResp;
    };

    return branch(
      redirectTo(this.journey.steps.AmendApplication)
        .if(amendAplication),
      redirectTo(this.journey.steps.ReviewAosResponseFromCoRespondent)
        .if(reviewAosRespCoRespondent),
      redirectTo(this.journey.steps.RespNotAdmitAdultery)
        .if(respNotAdmitAdultery),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }

  get form() {
    const answers = ['yes'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const reviewAosResponse = text
      .joi('', validAnswers);

    return form({ reviewAosResponse });
  }

  answers() {
    const respondentAnswer = this.case.respWillDefendDivorce;
    return answer(this, {
      question: this.content.fields.reviewAosResponse.title,
      answer: respondentAnswer ? this.content.fields.reviewAosResponse[respondentAnswer.toLowerCase()] : ''
    });
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      checkWelshToggle
    ];
  }
}

module.exports = ReviewAosResponse;
