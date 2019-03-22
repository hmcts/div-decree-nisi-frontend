const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments, feeTypes } = require('middleware/feesAndPaymentsMiddleware');
const { createUris } = require('@hmcts/div-document-express-handler');

const {
  caseStateMap,
  permitDNReasonMap,
  caseIdDisplayStateMap,
  caseStateMap520
} = require('./petitionerStateTemplates');

const constants = {
  adultery: 'adultery',
  sep2Yr: 'separation-2-years',
  AOSCompleted: 'aoscompleted',
  AOSOverdue: 'aosoverdue',
  validAnswer: ['yes', 'no', 'nonoadmission'],
  NotDefined: 'notdefined',
  DNAwaiting: 'awaitingdecreenisi',
  undefendedReason: '0',
  no: 'no',
  yes: 'yes'
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
    return caseIdDisplayStateMap.includes(this.caseState);
  }

  get respAdmitsToFact() {
    return this.case.respAdmitOrConsentToFact && this.case.respAdmitOrConsentToFact.toLowerCase() === constants.yes;
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments(feeTypes.amendFee)
    ];
  }

  get amendFee() {
    return this.res.locals.applicationFee ? this.res.locals.applicationFee[feeTypes.amendFee] : '';
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

  get reasonForDivorce() {
    return this.case.reasonForDivorce;
  }

  get aosIsCompleted() {
    return this.caseState === constants.AOSCompleted;
  }

  get showReviewAosResponse() {
    const respWillDefendDivorce = this.respWillDefendDivorce && constants.validAnswer
      .includes(this.respWillDefendDivorce.toLowerCase());
    const isTwoYrSep = this.reasonForDivorce === constants.sep2Yr;

    return respWillDefendDivorce || this.aosIsCompleted || isTwoYrSep;
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
    if (constants.DNAwaiting.includes(this.caseState)) {
      template = permitDNReasonMap.get(this.dnReason);
    } else if (parseBool(config.features.release520)) {
      caseStateMap520.forEach(dataMap => {
        if (dataMap.state.includes(this.caseState)) {
          template = dataMap.template;
        }
      });
    } else {
      caseStateMap.forEach(dataMap => {
        if (dataMap.state.includes(this.caseState)) {
          template = dataMap.template;
        }
      });
    }
    return template;
  }

  get downloadableFiles() {
    const args = {
      // string to define uri where document donwload handler is attached, default: '/document-download/:documentId' *optional*
      uri: '/emclientapi/version/1/downloadFile?fileUrl=http://localhost:4006'
    };
    // The first argument is an array of files expected the following format:
    // this.req.session.files = [
    //   {
    //     "id": "401ab79e-34cb-4570-9f2f-4cf9357dc1ec",
    //     "value": {
    //       "DocumentFileName" : "aosinvitation1552043698652633"
    //     }
    //   },
    //   {
    //     "id": "401ab79e-34cb-4570-9f2f-4cf9357dc1ec",
    //     "value": {
    //       "DocumentFileName" : "aosinvitation1552043698652633"
    //     }
    //   }
    // ]
    return createUris(this.req.session.files, args);
  }
}


module.exports = PetitionProgressBar;
