const { Question } = require('@hmcts/one-per-page/steps');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { getUserData } = require('middleware/ccd');

class ApplyForDecreeNisi extends Question {
  static get path() {
    return config.paths.applyForDecreeNisi;
  }

  get session() {
    return this.req.session;
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

  answers() {
    return answer(this, {
      question: this.content.fields.applyForDecreeNisi.title,
      answer: this.content.fields
        .applyForDecreeNisi[this.fields.applyForDecreeNisi.value]
    });
  }

  next() {
    if (this.fields.applyForDecreeNisi.value === 'no') {
      return goTo(this.journey.steps.ApplicationSavedExit);
    }

    return goTo(this.journey.steps.MiniPetition);
  }


  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = ApplyForDecreeNisi;
