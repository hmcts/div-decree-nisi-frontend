const { CheckYourAnswers: CYA } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const ccd = require('middleware/ccd');

class CheckYourAnswers extends CYA {
  static get path() {
    return config.paths.checkYourAnswers;
  }

  get session() {
    return this.req.session;
  }

  next() {
    return redirectTo(this.journey.steps.Done);
  }

  get errorMessage() {
    return this.content.errors.required;
  }

  get middleware() {
    return [...super.middleware, idam.protect(), ccd.getUserData];
  }
}

module.exports = CheckYourAnswers;
