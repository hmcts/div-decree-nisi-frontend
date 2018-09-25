/* eslint-disable max-len */
const { Question } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const { getUserData } = require('middleware/ccd');
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
      const hasGivenDate = adulteryFirstFoundDate.isAfter(this.req.session.originalPetition.marriageDate) && !adulteryFirstFoundDate.isAfter(moment.now());
      return hasGivenDate;
    };

    const fields = {
      adulteryFirstFoundDate: convert(
        d => moment(`${d.day}/${d.month}/${d.year}`, 'DD/MM/YYYY'), // eslint-disable-line
        date.required({
          dayRequired: this.content.fields.changes.adulteryFirstFoundDate.dayRequired,
          monthRequired: this.content.fields.changes.adulteryFirstFoundDate.monthRequired,
          yearRequired: this.content.fields.changes.adulteryFirstFoundDate.yearRequired
        })
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
    return goTo(this.journey.steps.LivedApartSinceLastIncidentDate);
  }

  answers() {
    return answer(this, {
      question: this.content.fields.changes.adulteryFirstFoundDate.question,
      answer: this.fields.changes.adulteryFirstFoundDate.value
    });
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }
}

module.exports = AdulteryFirstFoundOut;
