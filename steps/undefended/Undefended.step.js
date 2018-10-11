const { Interstitial } = require('@hmcts/one-per-page/steps');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');

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

  get respDefendsDivorce() {
    return this.case.respDefendsDivorce;
  }

  next() {
    const showReviewAosResponse = this.respDefendsDivorce && ['yes', 'no'].includes(this.respDefendsDivorce.toLowerCase()); // eslint-disable-line

    return branch(
      redirectTo(this.journey.steps.ReviewAosResponse)
        .if(showReviewAosResponse),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }
}

module.exports = Undefended;