/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const moment = require('moment');
const { form, object, date, convert, errorFor } = require('@hmcts/one-per-page/forms');

class AdulteryFirstFoundOut extends Question {
  static get path() {
    return config.paths.adulteryFirstFoundOut;
  }

  get session() {
    return this.req.session;
  }

  get form() {
    const validateFirstFoundDate = ({ adulteryFirstFoundDate = '' }) => {
      const marriageDate = moment(this.req.session.originalPetition.marriageDate).format('YYYY-MM-DD');
      const createdDate = moment(this.req.session.originalPetition.createdDate).format('YYYY-MM-DD');
      const hasGivenDate = this.fields.changes.adulteryFirstFoundDate.day.value && this.fields.changes.adulteryFirstFoundDate.month.value && this.fields.changes.adulteryFirstFoundDate.year.value
         && adulteryFirstFoundDate.isValid() && adulteryFirstFoundDate.isBetween(marriageDate, createdDate, null, []); // eslint-disable-line
      return hasGivenDate;
    };

    const fields = {
      adulteryFirstFoundDate: convert(
        d => moment(`${d.year}-${d.month}-${d.day}`, 'YYYY-MM-DD'), // eslint-disable-line
        date
      )
    };

    const changes = object(fields)
      .check(
        errorFor('adulteryFirstFoundDate', this.content.errors.requireFirstFoundDate),
        validateFirstFoundDate);

    return form({ changes });
  }

  next() {
    this.req.session.adulteryFirstFoundDate = this.fields.changes.adulteryFirstFoundDate.value;
    return redirectTo(this.journey.steps.LivedApartSinceAdultery);
  }

  answers() {
    return answer(this, {
      question: this.content.fields.changes.adulteryFirstFoundDate.question,
      answer: this.fields.changes.adulteryFirstFoundDate.value.format('DD/MM/YYYY')
    });
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = AdulteryFirstFoundOut;
