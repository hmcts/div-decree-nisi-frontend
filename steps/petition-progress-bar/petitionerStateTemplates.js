const caseStateMap = [
  {
    template: './sections/submitted/PetitionProgressBar.submitted.template.html',
    state: ['submitted', 'awaitinghwfdecision', 'awaitingdocuments', 'pendingrejection', 'petitioncompleted']
  },
  {
    template: './sections/accepted/PetitionProgressBar.accepted.template.html',
    state: ['accepted']
  },
  {
    template: './sections/issued/PetitionProgressBar.issued.template.html',
    state: ['aosstarted', 'aosawaiting', 'issued']
  },
  {
    template: './sections/awaitingSubmittedDN/PetitionProgressBar.awaitingSubmittedDN.template.html',
    state: ['awaitinglegaladvisorreferral', 'awaitingconsideration', 'awaitingpronouncement', 'awaitingclarification']
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
  }
];

const caseStateMap520 = [
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
    state: ['awaitinglegaladvisorreferral']
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
  }
];

const caseIdDisplayStateMap = ['submitted', 'awaitinghwfdecision', 'awaitingdocuments', 'pendingrejection', 'petitioncompleted'];

const permitDNReasonMap = new Map([
  ['0', './sections/undefended/PetitionProgressBar.undefended.template.html'],
  ['1', './sections/deemedService/PetitionProgressBar.deemedService.template.html'],
  ['2', './sections/dispensedWithService/PetitionProgressBar.dispensedWithService.template.html'],
  ['3', './sections/defendedWithoutAnswer/PetitionProgressBar.defendedWithoutAnswer.template.html'],
  ['4', './sections/defendedWithoutAnswer/PetitionProgressBar.defendedWithoutAnswer.template.html']
]);

module.exports = {
  caseStateMap,
  permitDNReasonMap,
  caseIdDisplayStateMap,
  caseStateMap520
};
