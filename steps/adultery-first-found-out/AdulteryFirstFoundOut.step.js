/* eslint-disable max-len */
const { shimSessionQuestion } = require('middleware/shimSession');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const moment = require('moment');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const checkWelshToggle = require('middleware/checkWelshToggle');

class AdulteryFirstFoundOut extends shimSessionQuestion {
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
      const hasGivenDate = firstFoundDate.isBetween(marriageDate, createdDate, null, []); // eslint-disable-line
      return hasGivenDate;
    };

    return form({
      adulteryFirstFoundDate: convert(
        d => moment(`${d.year}-${d.month}-${d.day}`, 'YYYY-MM-DD'), // eslint-disable-line
        date.required({
          allRequired: this.content.fields.adulteryFirstFoundDate.allRequired,
          dayRequired: this.content.fields.adulteryFirstFoundDate.dayRequired,
          monthRequired: this.content.fields.adulteryFirstFoundDate.monthRequired,
          yearRequired: this.content.fields.adulteryFirstFoundDate.yearRequired
        })
      ).check(this.content.errors.requireFirstFoundDate, validateFirstFoundDate)
    });
  }

  next() {
    this.case.adulteryFirstFoundDate = this.fields.adulteryFirstFoundDate.value;
    return redirectTo(this.journey.steps.LivedApartSinceAdultery);
  }

  answers() {
    return answer(this, {
      question: this.content.fields.adulteryFirstFoundDate.question,
      answer: this.fields.adulteryFirstFoundDate.value.format('Do MMMM YYYY')
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

module.exports = AdulteryFirstFoundOut;
