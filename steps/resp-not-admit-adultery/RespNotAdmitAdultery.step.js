const { Question, branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');

class RespNotAdmitAdultery extends Question {
  static get path() {
    return config.paths.respNotAdmitAdultery;
  }

  get case() {
    return this.req.session.case.data;
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
      redirectTo(this.journey.steps.AmendApplication).if(amendPetition),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }


  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = RespNotAdmitAdultery;
