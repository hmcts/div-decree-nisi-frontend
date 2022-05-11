const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

const constants = {
  respAdmitOrConsentToFact: 'respAdmitOrConsentToFact',
  no: 'No',
  AosCompleted: 'AosCompleted'
};
class ReviewAosResponseFromCoRespondent extends Question {
  static get path() {
    return config.paths.reviewAosResponseFromCoRespondent;
  }

  get case() {
    return this.req.session.case.data;
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect()
    ];
  }

  get form() {
    const answers = ['yes'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const reviewAosCRResponse = text
      .joi('', validAnswers);

    return form({ reviewAosCRResponse });
  }

  answers() {
    const coRespAnswer = this.case.coRespondentAnswers ? this.case.coRespondentAnswers.defendsDivorce : null;
    return answer(this, {
      question: this.content.fields.reviewAosCRResponse.title,
      answer: this.content.fields.reviewAosCRResponse[
        coRespAnswer ? coRespAnswer.toLowerCase() : ''
      ]
    });
  }

  next() {
    const respNotAdmitAdultery = () => {
      return this.case[constants.respAdmitOrConsentToFact] === constants.no && this.req.session.case.state === constants.AosCompleted;
    };

    return branch(
      redirectTo(this.journey.steps.RespNotAdmitAdultery)
        .if(respNotAdmitAdultery),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }
}

module.exports = ReviewAosResponseFromCoRespondent;
