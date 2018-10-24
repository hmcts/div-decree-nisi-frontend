const { union, difference } = require('lodash');

const modulePath = 'steps/petition-progress-bar/PetitionProgressBar.step';

const PetitionProgressBar = require(modulePath);
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const getSteps = require('steps');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content,
  stepAsInstance, expect } = require('@hmcts/one-per-page-test-suite');

const templates = {
  submitted: './sections/submitted/PetitionProgressBar.submitted.template.html',
  issued: './sections/issued/PetitionProgressBar.issued.template.html',
  defended: './sections/defendedWithAnswer/PetitionProgressBar.defendedWithAnswer.template.html',
  undefended: './sections/undefended/PetitionProgressBar.undefended.template.html',
  deemedService: './sections/deemedService/PetitionProgressBar.deemedService.template.html',
  dWS: './sections/dispensedWithService/PetitionProgressBar.dispensedWithService.template.html',
  dWA: './sections/defendedWithoutAnswer/PetitionProgressBar.defendedWithoutAnswer.template.html',
  awaiting: './sections/awaiting/PetitionProgressBar.awaiting.template.html'
};

const issuedContent = [
  'issuedAppStatusMsg',
  'issuedAppStatusMsgDetails',
  'issuedWhatHappensNext',
  'issuedWhatHappensNextDetail1',
  'issuedWhatHappensNextDetails2list1',
  'issuedWhatHappensNextDetails2list2',
  'issuedWhatHappensNextDetails2list3',
  'issuedWhatHappensNextDetails3'
];

const submittedContent = [
  'submittedAppStatusMsg',
  'submittedAppStatusMsgDetails1',
  'submittedAppStatusMsgDetails2',
  'submittedWhatHappensNext',
  'submittedWhatHappensNextDetails1',
  'submittedWhatHappensNextDetails2',
  'submittedWhatHappensNextDetails3'
];

const undefendedContent = [
  'undefendedAppStatusMsg',
  'undefendedAppStatusMsgDetails1',
  'undefendedAppStatusMsgDetails2',
  'undefendedReadMore',
  'undefendedOrderForDivorce',
  'undefendedCourtAgrees',
  'undefendedCannotBeMade6Weeks',
  'undefendedUntilTheDecreeAbsolute'
];

const deemedServiceContent = [
  'deemedServiceAppStatusMsg',
  'deemedServiceAppStatusMsgDetails1',
  'deemedServiceAppStatusMsgDetails2'
];

const defendedWithoutAnswerContent = [
  'dWAAppStatusMsg',
  'dWAAppStatusMsgDetails1',
  'dWAAppStatusMsgDetails2'
];

const dispensedWithService = [
  'dWSAppStatusMsg',
  'dWSAppStatusMsgDetails1',
  'dWSAppStatusMsgDetails2'
];

const defendedDivorceContent = [
  'defendedServiceAppStatusMsg',
  'defendedServiceAppStatusMsgDetails1',
  'defendedServiceAppStatusMsgDetails2',
  'defendedServiceWhatHappensNext',
  'defendedServiceWhatHappensNextDetails1',
  'defendedServiceWhatHappensNextDetails2'
];

const awaitingContent = [
  'awaitingAppStatusMsg',
  'awaitingCourtWillCheck',
  'awaitingDecreeNisiGranted',
  'awaitingAverageDivorceTimes',
  'awaiting4to6Months',
  'awaitingWhatHappens',
  'awaitingHowLongItTakes',
  'awaitingCourtSends',
  'awaiting1WeekAfterSubmit',
  'awaitingYourSpouseRepsonds',
  'awaitingAfterTheyGetIt',
  'awaitingNisiGranted',
  'awaiting3to4WeeksAfterApply',
  'awaitingWaitToApplyForDecreeAbsolute',
  'awaiting6Weeks1Day',
  'awaitingDivorceIsGranted',
  'awaiting2WorkingDays',
  'awaitingTimesCanVary'
];


const pageContent = union(
  submittedContent,
  issuedContent,
  undefendedContent,
  deemedServiceContent,
  defendedWithoutAnswerContent,
  dispensedWithService,
  defendedDivorceContent,
  awaitingContent
);

const allPetitionProgressBarContentWithout = withoutEntry => {
  return difference(pageContent, withoutEntry);
};

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(PetitionProgressBar, [ idam.protect() ]);
  });

  it('renders the content when ccd status is Submitted', () => {
    const session = {
      case: {
        state: 'Submitted',
        data: {
          connections: {}
        }
      }
    };
    const specificContent = submittedContent;
    let specificContentToNotExist = allPetitionProgressBarContentWithout(
      submittedContent
    );

    // remove keys with same content
    specificContentToNotExist = specificContentToNotExist.filter(key => {
      return ![
        'issuedWhatHappensNext',
        'awaitingAppStatusMsg',
        'awaitingWhatHappens',
        'awaitingYourSpouseRepsonds'
      ].includes(key);
    });

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the content when ccd status is AOSstarted', () => {
    const session = {
      case: {
        state: 'AOSstarted',
        data: {
          connections: {}
        }
      }
    };
    const specificContent = issuedContent;
    let specificContentToNotExist = allPetitionProgressBarContentWithout(
      issuedContent
    );

    // remove keys with same content
    specificContentToNotExist = specificContentToNotExist.filter(key => {
      return ![
        'submittedWhatHappensNext',
        'awaitingAppStatusMsg',
        'awaitingWhatHappens',
        'awaitingYourSpouseRepsonds'
      ].includes(key);
    });

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the content when ccd status is DefendedDivorce', () => {
    const session = {
      case: {
        state: 'DefendedDivorce',
        data: {
          connections: {}
        }
      }
    };
    const specificContent = defendedDivorceContent;
    let specificContentToNotExist = allPetitionProgressBarContentWithout(
      defendedDivorceContent
    );

    // remove keys with same content
    specificContentToNotExist = specificContentToNotExist.filter(key => {
      return ![
        'awaitingWhatHappens',
        'awaitingYourSpouseRepsonds'
      ].includes(key);
    });

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the content when ccd status is AwaitingLegalAdvisorReferral', () => {
    const session = {
      case: {
        state: 'AwaitingLegalAdvisorReferral',
        data: {
          connections: {}
        }
      }
    };
    const specificContent = awaitingContent;
    let specificContentToNotExist = allPetitionProgressBarContentWithout(
      awaitingContent
    );

    // remove keys with same content
    specificContentToNotExist = specificContentToNotExist.filter(key => {
      return ![
        'submittedWhatHappensNext',
        'issuedWhatHappensNext'
      ].includes(key);
    });

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the content when ccd status is DNawaiting & DNReason is 0', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '0'
        }
      }
    };
    const specificContent = undefendedContent;
    let specificContentToNotExist = allPetitionProgressBarContentWithout(
      undefendedContent
    );

    // remove keys with same content
    specificContentToNotExist = specificContentToNotExist.filter(key => {
      return ![
        'deemedServiceAppStatusMsg',
        'dWAAppStatusMsg',
        'dWSAppStatusMsg',
        'awaitingYourSpouseRepsonds'
      ].includes(key);
    });

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the content when ccd status is DNawaiting & DNReason is 1', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '1'
        }
      }
    };
    const specificContent = deemedServiceContent;
    let specificContentToNotExist = allPetitionProgressBarContentWithout(
      deemedServiceContent
    );

    // remove keys with same content
    specificContentToNotExist = specificContentToNotExist.filter(key => {
      return ![
        'undefendedAppStatusMsg',
        'dWAAppStatusMsg',
        'dWSAppStatusMsg',
        'awaitingYourSpouseRepsonds'
      ].includes(key);
    });

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the content when ccd status is DNawaiting & DNReason is 2', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '2'
        }
      }
    };
    const specificContent = dispensedWithService;
    let specificContentToNotExist = allPetitionProgressBarContentWithout(
      dispensedWithService
    );

    // remove keys with same content
    specificContentToNotExist = specificContentToNotExist.filter(key => {
      return ![
        'undefendedAppStatusMsg',
        'deemedServiceAppStatusMsg',
        'dWAAppStatusMsg',
        'awaitingYourSpouseRepsonds'
      ].includes(key);
    });

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the content when ccd status is DNawaiting & DNReason is 3', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '3'
        }
      }
    };
    const specificContent = defendedWithoutAnswerContent;
    let specificContentToNotExist = allPetitionProgressBarContentWithout(
      defendedWithoutAnswerContent
    );

    // remove keys with same content
    specificContentToNotExist = specificContentToNotExist.filter(key => {
      return ![
        'undefendedAppStatusMsg',
        'deemedServiceAppStatusMsg',
        'dWSAppStatusMsg',
        'awaitingYourSpouseRepsonds'
      ].includes(key);
    });

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the content when ccd status is DNawaiting & DNReason is 4', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '4'
        }
      }
    };
    const specificContent = defendedWithoutAnswerContent;
    let specificContentToNotExist = allPetitionProgressBarContentWithout(
      defendedWithoutAnswerContent
    );

    // remove keys with same content
    specificContentToNotExist = specificContentToNotExist.filter(key => {
      return ![
        'undefendedAppStatusMsg',
        'deemedServiceAppStatusMsg',
        'dWSAppStatusMsg',
        'awaitingYourSpouseRepsonds'
      ].includes(key);
    });

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the correct template when ccd status is Submitted', () => {
    const session = {
      case: {
        state: 'Submitted',
        data: {
          connections: {}
        }
      }
    };
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.stateTemplate).to.eql(templates.submitted);
  });

  it('renders the correct template when ccd status is AOSStarted', () => {
    const session = {
      case: {
        state: 'AOSstarted',
        data: {
          connections: {}
        }
      }
    };
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.stateTemplate).to.eql(templates.issued);
  });

  it('renders defendedWithAnswer if ccdstatus is DefendedDivorce', () => {
    const session = {
      case: {
        state: 'DefendedDivorce',
        data: {
          connections: {},
          permittedDecreeNisiReason: '1'
        }
      }
    };
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.stateTemplate).to.eql(templates.defended);
  });

  it('renders defendedWithAnswer if ccdstatus is AwaitingLegalAdvisorReferral', () => {
    const session = {
      case: {
        state: 'AwaitingLegalAdvisorReferral',
        data: {
          connections: {},
          permittedDecreeNisiReason: '1'
        }
      }
    };
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.stateTemplate).to.eql(templates.awaiting);
  });

  it('renders undefended if ccdstatus is DNawaiting, DNReason is 0', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '0'
        }
      }
    };
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.stateTemplate).to.eql(templates.undefended);
  });

  it('renders deemedService if ccdstatus is DNawaiting, DNReason is 1', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '1'
        }
      }
    };
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.stateTemplate).to.eql(templates.deemedService);
  });

  it('renders dispensedWithService if ccdstatus is DNawaiting, DNReason is 2', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '2'
        }
      }
    };
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.stateTemplate).to.eql(templates.dWS);
  });

  it('renders defendedWithoutAnswer when ccdstatus is DNawaiting, DNReason is 3', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '3'
        }
      }
    };
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.stateTemplate).to.eql(templates.dWA);
  });

  it('renders defendedWithoutAnswer when ccd status is DNawaiting, DNReason is 4', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          connections: {},
          permittedDecreeNisiReason: '4'
        }
      }
    };
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.stateTemplate).to.eql(templates.dWA);
  });

  it('rediects to ApplyForDecreeNisi when CCD has respDefendsDivorce as null', () => {
    const session = {
      case: {
        data: {
          respDefendsDivorce: null
        }
      }
    };
    interstitial.navigatesToNext(PetitionProgressBar, ApplyForDecreeNisi, getSteps(), session);
  });

  it('redirects reviewAosResponse when CCD has respDefendsDivorce as Yes', () => {
    const session = {
      case: {
        data: {
          respDefendsDivorce: 'Yes'
        }
      }
    };
    interstitial.navigatesToNext(PetitionProgressBar, ReviewAosResponse, getSteps(), session);
  });
});
