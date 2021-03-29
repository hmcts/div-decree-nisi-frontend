const { get, toLower, isEqual, isEmpty, trim, size } = require('lodash');
const { notDefined, awaitingClarification, dnIsRefused } = require('common/constants');
const { dnAwaitingTemplate } = require('steps/petition-progress-bar/petitionerStateTemplates');

const constants = {
  adultery: 'adultery',
  sep2Yr: 'separation-2-years',
  AOSCompleted: 'aoscompleted',
  AOSOverdue: 'aosoverdue',
  validAnswer: ['yes', 'no', 'nonoadmission'],
  notDefined,
  DNAwaiting: 'awaitingdecreenisi',
  awaitingPronouncement: 'awaitingpronouncement',
  awaitingClarification,
  dnIsRefused,
  undefendedReason: '0',
  no: 'no',
  yes: 'yes',
  deemed: 'deemed',
  dispensed: 'dispensed'
};

const YES_VALUE = 'Yes';

const getValue = (caseData, property) => {
  return get(caseData, property);
};

const isAwaitingDecreeNisi = caseState => {
  return isEqual(constants.DNAwaiting, toLower(caseState));
};

const isAwaitingPronouncementWithHearingDate = (caseState, caseData) => {
  const awaitingPronouncement = isEqual(toLower(caseState), constants.awaitingPronouncement);
  const hearingDates = getValue(caseData, 'hearingDate') || [];

  return awaitingPronouncement && size(hearingDates) > 0;
};

const isPetitionerRepresented = caseData => {
  const petitionerSolicitorEmail = getValue(caseData, 'petitionerSolicitorEmail');
  return !isEmpty(trim(petitionerSolicitorEmail));
};

const isServedByProcessServer = caseData => {
  const servedByProcessServer = getValue(caseData, 'servedByProcessServer');
  return isEqual(toLower(servedByProcessServer), constants.yes);
};

const hasReceivedAosFromRespondent = caseData => {
  const receivedAosFromResp = getValue(caseData, 'receivedAosFromResp');
  return isEqual(toLower(receivedAosFromResp), constants.yes);
};

const isProcessServerService = caseData => {
  if (isPetitionerRepresented(caseData)) {
    return false;
  }
  return isServedByProcessServer(caseData) && !hasReceivedAosFromRespondent(caseData);
};

const hasBeenServedByAlternativeMethod = caseData => {
  const servedByAlternativeMethod = getValue(caseData, 'servedByAlternativeMethod');
  return isEqual(toLower(servedByAlternativeMethod), constants.yes);
};

const isServedByAlternativeMethod = caseData => {
  if (isPetitionerRepresented(caseData)) {
    return false;
  }
  return hasBeenServedByAlternativeMethod(caseData) && !hasReceivedAosFromRespondent(caseData);
};

const hasBeenServedByBailiff = caseData => {
  const successfulServedByBailiff = getValue(caseData, 'successfulServedByBailiff');
  return isEqual(toLower(successfulServedByBailiff), constants.yes);
};

const isServedByBailiffSuccessful = caseData => {
  return hasBeenServedByBailiff(caseData);
};

const isDeemedServiceApplicationGranted = caseData => {
  return isEqual(toLower(caseData.serviceApplicationGranted), constants.yes) && isEqual(toLower(caseData.serviceApplicationType), constants.deemed);
};

const isDispensedServiceApplicationGranted = caseData => {
  return isEqual(toLower(caseData.serviceApplicationGranted), constants.yes) && isEqual(toLower(caseData.serviceApplicationType), constants.dispensed);
};

const getProcessServerReason = () => {
  return dnAwaitingTemplate.servedByProcessServer;
};

const getServedByAlternativeMethodReason = () => {
  return dnAwaitingTemplate.servedByAlternativeMethod;
};

const getServedByBailiffSuccessfulContinueReason = () => {
  return dnAwaitingTemplate.bailiffServiceSuccessfulContinue;
};

module.exports = {
  constants,
  isAwaitingDecreeNisi,
  isAwaitingPronouncementWithHearingDate,
  isProcessServerService,
  isServedByProcessServer,
  hasReceivedAosFromRespondent,
  isPetitionerRepresented,
  isDeemedServiceApplicationGranted,
  isDispensedServiceApplicationGranted,
  getProcessServerReason,
  getServedByAlternativeMethodReason,
  getServedByBailiffSuccessfulContinueReason,
  isServedByBailiffSuccessful,
  isServedByAlternativeMethod,
  YES_VALUE
};
