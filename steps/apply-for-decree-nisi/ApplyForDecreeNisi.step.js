const { shimSessionQuestion } = require('middleware/shimSession');
const { branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');

class ApplyForDecreeNisi extends shimSessionQuestion {
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
