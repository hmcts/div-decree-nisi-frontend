/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const moment = require('moment');
const { form, date, convert } = require('@hmcts/one-per-page/forms');

class AdulteryFirstFoundOut extends Question {
  static get path() {
    return config.paths.adulteryFirstFoundOut;
  }

  get case() {
    return this.req.session.case.data;
  }

  get form() {
    const validateFirstFoundDate = firstFoundDate => {
      const marriageDate = moment(this.case.marriageDate).format('YYYY-MM-DD');
      const createdDate = moment(this.case.createdDate).format('YYYY-MM-DD');
      const hasGivenDate = firstFoundDate.isValid() && firstFoundDate.isBetween(marriageDate, createdDate, null, []); // eslint-disable-line
      return hasGivenDate;
    };

    return form({
      adulteryFirstFoundDate: convert(
        d => moment(`${d.year}-${d.month}-${d.day}`, 'YYYY-MM-DD'), // eslint-disable-line
        date.required({
          allRequired: this.content.errors.requireFirstFoundDate,
          dayRequired: this.content.errors.requireFirstFoundDate,
          monthRequired: this.content.errors.requireFirstFoundDate,
          yearRequired: this.content.errors.requireFirstFoundDate
        })
      ).check(this.content.errors.requireFirstFoundDate, validateFirstFoundDate)
    });
  }

  next() {
    return redirectTo(this.journey.steps.LivedApartSinceAdultery);
  }

  answers() {
    return answer(this, {
      question: this.content.fields.adulteryFirstFoundDate.question,
      answer: this.fields.adulteryFirstFoundDate.value.format('DD/MM/YYYY')
    });
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = AdulteryFirstFoundOut;
