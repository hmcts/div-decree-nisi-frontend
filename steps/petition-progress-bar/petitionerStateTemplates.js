const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');
const { isEmpty } = require('lodash');

const removeStateMappingFor = (template, givenState) => {
  return template.state
    .filter(state => {
      return state !== givenState;
    });
};

const addStateMappingsForDnOutcomeCase = map => {
  const awaitingClarificationEnabled = parseBool(config.features.awaitingClarification);
  const dnIsRefusedEnabled = parseBool(config.features.dnIsRefused);

  if (awaitingClarificationEnabled) {
    // remove awaitingclarification state from awaitingSubmittedDN template
    const awaitingSubmittedDNTemplate = map[2];
    awaitingSubmittedDNTemplate.state = removeStateMappingFor(awaitingSubmittedDNTemplate, 'awaitingclarification');

    // add new template for awaitingclarification state
    const newAwaitingClarificationTemplate = {
      template: './sections/awaitingClarification/PetitionProgressBar.awaitingClarification.template.html',
      state: ['awaitingclarification']
    };
    map.push(newAwaitingClarificationTemplate);
  }

  if (dnIsRefusedEnabled) {
    const newDnIsRefusedTemplate = {
      template: './sections/dnIsRefused/PetitionProgressBar.dnIsRefused.template.html',
      state: ['dnisrefused']
    };
    map.push(newDnIsRefusedTemplate);
  }
};

const addStateMappingsForServedByBailiffNotSuccessful = map => {
  const aosAwaitingTemplate = map[1];
  aosAwaitingTemplate.state = removeStateMappingFor(aosAwaitingTemplate, 'aosawaiting');

  const aosOverdueTemplate = map[5];
  aosOverdueTemplate.state = removeStateMappingFor(aosOverdueTemplate, 'aosoverdue');

  const newAosTemplate = {
    template: './sections/bailiffServiceNotSuccessful/PetitionProgressBar.bailiffServiceNotSuccessful.template.html',
    state: ['aosawaiting', 'aosoverdue']
  };
  map.push(newAosTemplate);
};

const addStateMappingsForServedByBailiffSuccessful = map => {
  const aosAwaitingTemplate = map[1];
  aosAwaitingTemplate.state = removeStateMappingFor(aosAwaitingTemplate, 'aosawaiting');

  const aosOverdueTemplate = map[5];
  aosOverdueTemplate.state = removeStateMappingFor(aosOverdueTemplate, 'aosoverdue');

  const newAosTemplate = {
    template: './sections/bailiffServiceSuccessful/PetitionProgressBar.bailiffServiceSuccessful.template.html',
    state: ['aosawaiting', 'aosoverdue']
  };
  map.push(newAosTemplate);
};

const caseStateMap = caseData => {
  const map = [
    {
      template: './sections/submitted/PetitionProgressBar.submitted.template.html',
      state: ['submitted', 'awaitinghwfdecision', 'awaitingdocuments', 'pendingrejection', 'petitioncompleted']
    },
    {
      template: './sections/issued/PetitionProgressBar.issued.template.html',
      state: ['aosstarted', 'aosawaiting', 'issued']
    },
    {
      template: './sections/awaitingSubmittedDN/PetitionProgressBar.awaitingSubmittedDN.template.html',
      state: ['awaitinglegaladvisorreferral', 'awaitingconsideration', 'awaitingpronouncement', 'awaitingclarification', 'dnisrefused']
    },
    {
      template: './sections/defendedWithAnswer/PetitionProgressBar.defendedWithAnswer.template.html',
      state: ['defendeddivorce']
    },
    {
      template: './sections/defendedAwaitingAnswer/PetitionProgressBar.defendedAwaitingAnswer.template.html',
      state: ['aossubmittedawaitinganswer']
    },
    {
      template: './sections/respondentNotReplied/PetitionProgressBar.respondentNotReplied.template.html',
      state: ['aosoverdue']
    },
    {
      template: './sections/aosCompleted/PetitionProgressBar.aosCompleted.template.html',
      state: ['aoscompleted']
    },
    {
      template: './sections/decreeNisiGranted/PetitionProgressBar.decreeNisiGranted.template.html',
      state: ['awaitingdecreeabsolute', 'dnpronounced']
    }
  ];

  const isDnOutcomeCase = parseBool(caseData.dnOutcomeCase);
  const isServedByBailiffRequested = !isEmpty(caseData.successfulServedByBailiff);
  const isServedByBailiffSuccessful = parseBool(caseData.successfulServedByBailiff);

  if (isDnOutcomeCase) {
    addStateMappingsForDnOutcomeCase(map);
  }

  if (isServedByBailiffRequested) {
    if (isServedByBailiffSuccessful) {
      addStateMappingsForServedByBailiffSuccessful(map);
    } else {
      addStateMappingsForServedByBailiffNotSuccessful(map);
    }
  }

  return map;
};

const caseIdDisplayStateMap = ['submitted', 'awaitinghwfdecision', 'awaitingdocuments', 'pendingrejection', 'petitioncompleted'];

const awaitingPronouncementWithHearingDateTemplate = './sections/awaitingPronouncement/PetitionProgressBar.awaitingPronouncement.template.html';

const permitDNReasonMap = new Map([
  ['0', './sections/undefended/PetitionProgressBar.undefended.template.html'],
  ['1', './sections/deemedService/PetitionProgressBar.deemedService.template.html'],
  ['2', './sections/dispensedWithService/PetitionProgressBar.dispensedWithService.template.html'],
  ['3', './sections/defendedWithoutAnswer/PetitionProgressBar.defendedWithoutAnswer.template.html'],
  ['4', './sections/defendedWithoutAnswer/PetitionProgressBar.defendedWithoutAnswer.template.html'],
  ['5', './sections/deemedApproved/PetitionProgressBar.deemedApproved.template.html'],
  ['6', './sections/dispensedApproved/PetitionProgressBar.dispensedApproved.template.html'],
  ['7', './sections/processServerService/PetitionProgressBar.processServerService.template.html'],
  ['8', './sections/servedByAlternativeMethod/PetitionProgressBar.servedByAlternativeMethod.template.html'],
  ['9', './sections/bailiffServiceSuccessfulContinue/PetitionProgressBar.bailiffServiceSuccessfulContinue.template.html']
]);

const dnAwaitingTemplate = {
  deemed: '5',
  dispensed: '6',
  servedByProcessServer: '7',
  servedByAlternativeMethod: '8',
  bailiffServiceSuccessfulContinue: '9'
};

module.exports = {
  caseStateMap,
  permitDNReasonMap,
  caseIdDisplayStateMap,
  awaitingPronouncementWithHearingDateTemplate,
  dnAwaitingTemplate
};
