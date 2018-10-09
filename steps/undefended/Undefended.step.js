const { Interstitial } = require('@hmcts/one-per-page/steps');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const caseOrchestrationMiddleware = require('middleware/caseOrchestrationMiddleware');

class Undefended extends Interstitial {
  static get path() {
    return config.paths.undefended;
  }

  get case() {
    return this.req.session.case.data;
  }

  get caseId() {
    return this.req.session.case.caseId;
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  next() {
    const respDefendsDivorce = this.req.session.case.respDefendsDivorce;
    let showReviewAosResponse = false;

    if (respDefendsDivorce) {
      const respDefended = ['yes', 'no'];
      showReviewAosResponse = respDefended.includes(respDefendsDivorce.toLowerCase()); // eslint-disable-line
    }

    return branch(
      redirectTo(this.journey.steps.ReviewAosResponse)
        .if(showReviewAosResponse),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      caseOrchestrationMiddleware.getApplication
    ];
  }
}

module.exports = Undefended;
