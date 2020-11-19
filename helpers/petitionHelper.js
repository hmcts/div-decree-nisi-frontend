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
  yes: 'yes'
};

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

const isReceivedAOSFromRespondent = caseData => {
  const receivedAOSfromResp = getValue(caseData, 'receivedAOSfromResp');
  return isEqual(toLower(receivedAOSfromResp), constants.yes);
};

const isProcessServerService = caseData => {
  if (isPetitionerRepresented(caseData)) {
    return false;
  }
  return isServedByProcessServer(caseData) && !isReceivedAOSFromRespondent(caseData);
};

const getProcessServerReason = () => {
  return dnAwaitingTemplate.servedByProcessServer;
};

module.exports = {
  constants,
  isAwaitingDecreeNisi,
  isAwaitingPronouncementWithHearingDate,
  isProcessServerService,
  isServedByProcessServer,
  isReceivedAOSFromRespondent,
  isPetitionerRepresented,
  getProcessServerReason
};
