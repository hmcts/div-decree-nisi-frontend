const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
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
    const declinesToApplyForDN = () => {
      return this.fields.applyForDecreeNisi.value === 'no';
    };

    return branch(
      goTo(this.journey.steps.ApplicationSavedExit).if(declinesToApplyForDN),
      goTo(this.journey.steps.MiniPetition)
    );
  }


  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = ApplyForDecreeNisi;