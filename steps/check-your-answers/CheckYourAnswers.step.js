const { CheckYourAnswers: CYA } = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo, action, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const caseOrchestrationService = require('services/caseOrchestrationService');

class CheckYourAnswers extends CYA {
  static get path() {
    return config.paths.checkYourAnswers;
  }

  get case() {
    return this.req.session.case.data;
  }

  next() {
    return action(caseOrchestrationService.submitApplication)
      .then(goTo(this.journey.steps.Done))
      .onFailure(redirectTo(this.journey.steps.Start));
  }

  get errorMessage() {
    return this.content.errors.required;
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = CheckYourAnswers;
