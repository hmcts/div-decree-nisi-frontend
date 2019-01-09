const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const {
  caseStateMap, permitDNReasonMap,
  caseIdDispalyStateMap, aosCompletedOptionsMap
} = require('./petitionerStateTemplates');

const constants = {
  adultery: 'adultery',
  sep2Yr: 'separation-2-years',
  AOSOverdue: 'aosoverdue',
  AOSCompleted: 'aoscompleted',
  validAnswer: ['yes', 'no', 'nonoadmission'],
  NotDefined: 'notdefined',
  DNAwaiting: 'awaitingdecreenisi',
  undefendedReason: '0',
  no: 'No',
  yes: 'Yes'
};
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

  get isCaseIdToBeDisplayed() {
    return caseIdDispalyStateMap.includes(this.caseState);
  }

  get respAdmitOrConsentToFact() {
    return this.case.respAdmitOrConsentToFact;
  }

  get reasonForDivorce() {
    return this.case.reasonForDivorce;
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }

  get respWillDefendDivorce() {
    return this.case.respWillDefendDivorce;
  }

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : constants.NotDefined;
  }

  get showDnNoResponse() {
    return this.caseState === constants.AOSOverdue;
  }

  get showReviewAosResponse() {
    return (this.respWillDefendDivorce && constants.validAnswer.includes(this.respWillDefendDivorce.toLowerCase()));
  }

  get aosCompletedOptions() {
    if (this.reasonForDivorce === constants.adultery && this.respAdmitOrConsentToFact === constants.no) {
      return 'respNotAdmittedAdultery';
    } else if (this.reasonForDivorce === constants.sep2Yr && this.respAdmitOrConsentToFact === constants.yes) {
      return 'sep2YrWithConsent';
    }
    return '';
  }

  next() {
    return branch(
      redirectTo(this.journey.steps.DnNoResponse)
        .if(this.showDnNoResponse),
      redirectTo(this.journey.steps.ReviewAosResponse)
        .if(this.showReviewAosResponse),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }

  get dnReason() {
    return this.case.permittedDecreeNisiReason ? this.case.permittedDecreeNisiReason : constants.undefendedReason;
  }

  get stateTemplate() {
    let template = '';
    switch (this.caseState) {
    case constants.DNAwaiting:
      template = permitDNReasonMap.get(this.dnReason);
      break;
    case constants.AOSCompleted:
      template = aosCompletedOptionsMap.get(this.aosCompletedOptions);
      break;
    default:
      caseStateMap.forEach(dataMap => {
        if (dataMap.state.includes(this.caseState)) {
          template = dataMap.template;
        }
      });
    }
    return template;
  }
}

module.exports = PetitionProgressBar;
