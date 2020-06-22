const { shimSessionCYA } = require('middleware/shimSession');
const { goTo, action, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const caseOrchestrationService = require('services/caseOrchestrationService');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const { parseBool } = require('@hmcts/one-per-page/util');
const { notDefined, awaitingClarification } = require('common/constants');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');
const commonContent = require('common/content');

class CheckYourAnswers extends shimSessionCYA {
  static get path() {
    return config.paths.checkYourAnswers;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : notDefined;
  }

  get isAwaitingClarification() {
    const isDnOutcomeCase = parseBool(this.case.dnOutcomeCase);
    const featureIsEnabled = parseBool(config.features.awaitingClarification);
    const isCorrectState = this.caseState === awaitingClarification;

    return isDnOutcomeCase && featureIsEnabled && isCorrectState;
  }

  get dnClaimCosts() {
    if (this.req.session.ClaimCosts) {
      return this.req.session.ClaimCosts.dnCosts.claimCosts;
    }
    return false;
  }

  next() {
    return action(caseOrchestrationService.submitApplication)
      .then(goTo(this.journey.steps.Done))
      .onFailure((error, req, res) => {
        const { session } = req;
        // push error into session to display error message to user
        session.temp = { CheckYourAnswers: Object.assign({}, session.CheckYourAnswers, { submitError: 'error' }) };
        return redirectTo(this.journey.steps.CheckYourAnswers)
          .redirect(req, res);
      });
  }

  get errorMessage() {
    return this.content.errors.required;
  }

  get submitError() {
    return this.content.errors.submitError;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      checkWelshToggle
    ];
  }

  get form() {
    const answers = ['yes'];
    return form({
      statementOfTruth: text.joi(
        this.errorMessage,
        Joi.required().valid(answers)
      ),
      submitError: text.joi(
        this.submitError,
        Joi.valid([''])
      )
    });
  }
}

module.exports = CheckYourAnswers;
