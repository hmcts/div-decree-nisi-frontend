const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { goTo } = require('@hmcts/one-per-page/flow');

const idam = require('services/idam');
const { getUserData } = require('middleware/ccd');

class PetitionProgressBar extends Interstitial {
  static get path() {
    return config.paths.petitionProgressBar;
  }

  get session() {
    return this.req.session;
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  get middleware() {
    return [...super.middleware, idam.protect(), getUserData];
  }

  next() {
    return goTo(this.journey.steps.ReviewAosResponse);
  }

  get ccdStatus() {
    const ccdStatus = this.req.session.originalPetition.status;
    const submittedFlow = ['Submitted', 'AwaitingHWFDecision', 'AwaitingPetitioner', 'Issued', 'PendingRejection'];
    const issuedFlow = ['AwaitingAOS', 'AOSstarted'];
    const awaitFlow = ['AwaitingLegalAdvisorReferral', 'AwaitingConsiderationDN'];

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
