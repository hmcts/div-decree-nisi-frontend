const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { branch, redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments, feeTypes } = require('middleware/feesAndPaymentsMiddleware');
const { createUris } = require('@hmcts/div-document-express-handler');
const checkCaseState = require('middleware/checkCaseState');
const { toLower } = require('lodash');
const { parseBool } = require('@hmcts/one-per-page/util');
const caseOrchestrationService = require('services/caseOrchestrationService');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');
const {
  constants,
  isAwaitingDecreeNisi,
  isProcessServerService,
  isAwaitingPronouncementWithHearingDate,
  getProcessServerReason,
  getServedByAlternativeMethodReason,
  isServedByBailiffSuccessfulNotRepresentedAndAosNotReceived,
  isServedByAlternativeMethod,
  getServedByBailiffSuccessfulReason
} = require('helpers/petitionHelper');
const i18next = require('i18next');
const commonContent = require('common/content');

const {
  caseStateMap,
  permitDNReasonMap,
  caseIdDisplayStateMap,
  awaitingPronouncementWithHearingDateTemplate,
  dnAwaitingTemplate
} = require('./petitionerStateTemplates');

class PetitionProgressBar extends Interstitial {
  static get path() {
    return config.paths.petitionProgressBar;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get caseId() {
    return this.req.session.case.caseId;
  }

  get isCaseIdToBeDisplayed() {
    return caseIdDisplayStateMap.includes(this.caseState);
  }

  get respNotAdmitsToFact() {
    return this.case.respAdmitOrConsentToFact && this.case.respAdmitOrConsentToFact.toLowerCase() === constants.no;
  }

  get isCaseAmended() {
    return Boolean(this.case.previousCaseId);
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      checkCaseState,
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
    return this.req.session.case.state ? toLower(this.req.session.case.state) : constants.notDefined;
  }

  get showCourtFeedback() {
    const isDnOutcomeCase = parseBool(this.case.dnOutcomeCase);
    const featureIsEnabled = parseBool(config.features.awaitingClarification);
    const isCorrectState = this.caseState === constants.awaitingClarification;

    return isDnOutcomeCase && featureIsEnabled && isCorrectState;
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

  get dnIsRefused() {
    const isDnOutcomeCase = parseBool(this.case.dnOutcomeCase);
    const featureIsEnabled = parseBool(config.features.dnIsRefused);
    const isCorrectState = this.caseState === constants.dnIsRefused;

    return isDnOutcomeCase && featureIsEnabled && isCorrectState;
  }

  get showReviewAosResponse() {
    const respWillDefendDivorce = this.respWillDefendDivorce && constants.validAnswer
      .includes(this.respWillDefendDivorce.toLowerCase());
    const isTwoYrSep = this.reasonForDivorce === constants.sep2Yr;

    return respWillDefendDivorce || this.aosIsCompleted || isTwoYrSep;
  }

  get certificateOfEntitlementFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'certificateOfEntitlement';
    });
  }

  get refusalOrderFile() {
    return this.downloadableFiles.find(file => {
      const isRefusalOrder = [
        'clarificationDnRefusalOrder',
        'rejectionDnRefusalOrder'
      ].includes(file.type);
      return isRefusalOrder;
    });
  }

  next() {
    if (this.dnIsRefused) {
      return action(caseOrchestrationService.amendRejectedApplication)
        .then(redirectToFrontendHelper.redirectToFrontendAmend);
    }

    return branch(
      redirectTo(this.journey.steps.CourtFeedback)
        .if(this.showCourtFeedback),
      redirectTo(this.journey.steps.DnNoResponse)
        .if(this.showDnNoResponse),
      redirectTo(this.journey.steps.ReviewAosResponse)
        .if(this.showReviewAosResponse),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }

  get dnReason() {
    const serviceApplicationReason = this.serviceApplicationReason;
    if (serviceApplicationReason) {
      return serviceApplicationReason;
    }

    if (isProcessServerService(this.case)) {
      return getProcessServerReason();
    }

    if (isServedByAlternativeMethod(this.case)) {
      return getServedByAlternativeMethodReason();
    }

    if (isServedByBailiffSuccessfulNotRepresentedAndAosNotReceived(this.case)) {
      return getServedByBailiffSuccessfulReason();
    }

    return this.case.permittedDecreeNisiReason ? this.case.permittedDecreeNisiReason : constants.undefendedReason;
  }

  get serviceApplicationReason() {
    let serviceApplicationTemplate = null;

    if (this.case.serviceApplicationGranted === 'Yes') {
      const serviceApplicationType = this.case.serviceApplicationType;

      if (serviceApplicationType === 'deemed') {
        serviceApplicationTemplate = dnAwaitingTemplate.deemed;
      } else if (serviceApplicationType === 'dispensed') {
        serviceApplicationTemplate = dnAwaitingTemplate.dispensed;
      }
    }

    return serviceApplicationTemplate;
  }

  get reasonFailureToServe() {
    return this.case.reasonFailureToServe;
  }

  get stateTemplate() {
    if (isAwaitingDecreeNisi(this.caseState)) {
      return permitDNReasonMap.get(this.dnReason);
    }

    if (isAwaitingPronouncementWithHearingDate(this.caseState, this.case)) {
      return awaitingPronouncementWithHearingDateTemplate;
    }

    let template = '';
    caseStateMap(this.case).forEach(dataMap => {
      if (dataMap.state.includes(this.caseState)) {
        template = dataMap.template;
      }
    });
    return template;
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: config.document.filesWhiteList
    };

    return createUris(this.case.d8, docConfig);
  }

  get costsOrderFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'costsOrder';
    });
  }

  get decreeNisiFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'decreeNisi';
    });
  }

  isEqual(dataElement, constant) {
    return dataElement && dataElement.toLowerCase() === constant;
  }
}

module.exports = PetitionProgressBar;
