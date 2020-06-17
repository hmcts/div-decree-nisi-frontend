/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const i18next = require('i18next');
const commonContent = require('common/content');
const { form, text, errorFor, object } = require('@hmcts/one-per-page/forms');

class DesertionAskedToResumeDN extends Question {
  static get path() {
    return config.paths.desertionAskedToResumeDN;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get watches() {
    return {
      'DesertionAskedToResumeDN.changes.desertionAskedToResumeDN': (previousValue, currentValue, remove) => {
        if (currentValue === 'no') {
          remove('DesertionAskedToResumeDN.changes.desertionAskedToResumeDNRefused');
          remove('DesertionAskedToResumeDN.changes.desertionAskedToResumeDNDetails');
        }
      },
      'DesertionAskedToResumeDN.changes.desertionAskedToResumeDNRefused': (previousValue, currentValue, remove) => {
        if (currentValue === 'no') {
          remove('DesertionAskedToResumeDN.changes.desertionAskedToResumeDNDetails');
        }
      }
    };
  }

  get form() {
    const validateRefusalReasons = ({ desertionAskedToResumeDN = '', desertionAskedToResumeDNRefused = '', desertionAskedToResumeDNDetails = '' }) => {
      // only validate if user has answered desertionAskedToResumeDN
      const hasntAnsweredQuestion = !desertionAskedToResumeDN.length;
      if (hasntAnsweredQuestion) {
        return true;
      }
      if (desertionAskedToResumeDN === 'yes') {
        const hasntAnsweredRefusalQues = !desertionAskedToResumeDNRefused.length;
        // only validate if user has answered desertionAskedToResumeDNRefused
        if (hasntAnsweredRefusalQues) {
          return true;
        }
        if (desertionAskedToResumeDNRefused === 'yes') {
          return desertionAskedToResumeDNDetails.length > 0;
        }
      }
      return true;
    };

    const validateRefusalDetails = ({ desertionAskedToResumeDN = '', desertionAskedToResumeDNRefused = '' }) => {
      // only validate if user has answered desertionAskedToResumeDN
      const hasntAnsweredQuestion = !desertionAskedToResumeDN.length;
      if (hasntAnsweredQuestion) {
        return true;
      }
      if (desertionAskedToResumeDN === 'yes') {
        const hasntAnsweredRefusalQues = !desertionAskedToResumeDNRefused.length;
        // Validate if user has answered desertionAskedToResumeDNRefused
        if (hasntAnsweredRefusalQues) {
          return false;
        }
      }
      return true;
    };

    const validate = Joi.string()
      .valid(['yes', 'no'])
      .required();

    const desertionAskedToResumeDN = text.joi(this.content.errors.required, validate);

    const fields = {
      desertionAskedToResumeDN,
      desertionAskedToResumeDNRefused: text,
      desertionAskedToResumeDNDetails: text
    };

    const changes = object(fields)
      .check(
        errorFor('desertionAskedToResumeDNRefused', this.content.errors.requiredRefusalDetails),
        validateRefusalDetails
      )
      .check(
        errorFor('desertionAskedToResumeDNDetails', this.content.errors.requiredDesertionAskedToResumeDNDetails),
        validateRefusalReasons
      );

    return form({ changes });
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: this.content.fields.desertionAskedToResumeDN.title,
      answer: this.content.fields
        // eslint-disable-next-line max-len
        .desertionAskedToResumeDN[this.fields.changes.desertionAskedToResumeDN.value]
    }));

    if (this.fields.changes.desertionAskedToResumeDN.value === 'yes') {
      answers.push(answer(this, {
        // eslint-disable-next-line max-len
        question: this.content.fields.desertionAskedToResumeDNRefused.title,
        answer: this.content.fields.desertionAskedToResumeDNRefused[this.fields.changes.desertionAskedToResumeDNRefused.value]
      }));

      if (this.fields.changes.desertionAskedToResumeDNRefused.value === 'yes') {
        answers.push(answer(this, {
          // eslint-disable-next-line max-len
          question: this.content.fields.desertionAskedToResumeDNDetails.title,
          answer: this.fields.changes.desertionAskedToResumeDNDetails.value
        }));
      }
    }

    return answers;
  }

  values() {
    const desertionAskedToResumeDN = this.fields.changes.desertionAskedToResumeDN.value;
    if (desertionAskedToResumeDN === 'no') {
      return { 'changes.desertionAskedToResumeDN': desertionAskedToResumeDN };
    }
    const desertionAskedToResumeDNRefused = this.fields.changes.desertionAskedToResumeDNRefused.value;
    if (desertionAskedToResumeDNRefused === 'no') {
      return {
        'changes.desertionAskedToResumeDN': desertionAskedToResumeDN,
        'changes.desertionAskedToResumeDNRefused': desertionAskedToResumeDNRefused
      };
    }
    const desertionAskedToResumeDNDetails = this.fields.changes.desertionAskedToResumeDNDetails.value;
    return {
      'changes.desertionAskedToResumeDN': desertionAskedToResumeDN,
      'changes.desertionAskedToResumeDNRefused': desertionAskedToResumeDNRefused,
      'changes.desertionAskedToResumeDNDetails': desertionAskedToResumeDNDetails
    };
  }

  next() {
    return redirectTo(this.journey.steps.LivedApartSinceDesertion);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = DesertionAskedToResumeDN;
