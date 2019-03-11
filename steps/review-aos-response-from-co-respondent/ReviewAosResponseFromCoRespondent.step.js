const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { parseBool } = require('@hmcts/one-per-page/util');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');

const constants = {
  respAdmitOrConsentToFact: 'respAdmitOrConsentToFact',
  no: 'No'
};
class ReviewAosResponseFromCoRespondent extends Question {
  static get path() {
    return config.paths.reviewAosResponseFromCoRespondent;
  }

  get case() {
    return this.req.session.case.data;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
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
      return this.case[constants.respAdmitOrConsentToFact] === constants.no;
    };

    return branch(
      redirectTo(this.journey.steps.RespNotAdmitAdultery)
        .if(parseBool(config.features.release520) && respNotAdmitAdultery),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }
}

module.exports = ReviewAosResponseFromCoRespondent;
