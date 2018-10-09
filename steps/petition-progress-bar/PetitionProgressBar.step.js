const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { goTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const caseOrchestrationMiddleware = require('middleware/caseOrchestrationMiddleware');

class PetitionProgressBar extends Interstitial {
  static get path() {
    return config.paths.petitionProgressBar;
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

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      caseOrchestrationMiddleware.getApplication
    ];
  }

  next() {
    return goTo(this.journey.steps.ReviewAosResponse);
  }

  get ccdStatus() {
    const ccdStatus = this.req.session.case.state.toLowerCase();
    const submittedFlow = ['submitted', 'awaitinghwfdecision', 'awaitingpetitioner', 'issued', 'pendingrejection'];
    const issuedFlow = ['aosawaiting', 'aosstarted'];
    const awaitFlow = ['awaitinglegaladvisorreferral', 'awaitingconsiderationdn'];

    if (submittedFlow.includes(ccdStatus)) {
      return 'submitted';
    } else if (issuedFlow.includes(ccdStatus)) {
      return 'issued';
    } else if (awaitFlow.includes(ccdStatus)) {
      return 'awaiting';
    }
    return '';
  }
}

module.exports = PetitionProgressBar;
