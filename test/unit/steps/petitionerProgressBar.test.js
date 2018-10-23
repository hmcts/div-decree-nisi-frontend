const { union } = require('lodash');

const modulePath = 'steps/petition-progress-bar/PetitionProgressBar.step';

const PetitionProgressBar = require(modulePath);
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const getSteps = require('steps');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content,
  stepAsInstance, expect } = require('@hmcts/one-per-page-test-suite');


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
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificValuesToNotExist = union([
      issuedContent,
      undefendedContent,
      deemedServiceContent,
      defendedWithoutAnswerContent,
      dispensedWithService
    ]);
    return content(PetitionProgressBar, session, { specificContent, specificValuesToNotExist });
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
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificValuesToNotExist = union([
      submittedContent,
      undefendedContent,
      deemedServiceContent,
      defendedWithoutAnswerContent,
      dispensedWithService
    ]);
    return content(PetitionProgressBar, session, { specificContent, specificValuesToNotExist });
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
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificValuesToNotExist = union([
      submittedContent,
      issuedContent,
      deemedServiceContent,
      defendedWithoutAnswerContent,
      dispensedWithService
    ]);
    return content(PetitionProgressBar, session, { specificContent, specificValuesToNotExist });
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
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificValuesToNotExist = union([
      submittedContent,
      undefendedContent,
      issuedContent,
      defendedWithoutAnswerContent,
      dispensedWithService
    ]);
    return content(PetitionProgressBar, session, { specificContent, specificValuesToNotExist });
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
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificValuesToNotExist = union([
      submittedContent,
      undefendedContent,
      deemedServiceContent,
      defendedWithoutAnswerContent,
      issuedContent
    ]);
    return content(PetitionProgressBar, session, { specificContent, specificValuesToNotExist });
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
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificValuesToNotExist = union([
      submittedContent,
      undefendedContent,
      deemedServiceContent,
      issuedContent,
      dispensedWithService
    ]);
    return content(PetitionProgressBar, session, { specificContent, specificValuesToNotExist });
  });

  it('renders the content when ccd status is DNawaiting & permittedDecreeNisiReason is 4', () => {
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
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificValuesToNotExist = union([
      submittedContent,
      undefendedContent,
      deemedServiceContent,
      issuedContent,
      dispensedWithService
    ]);
    return content(PetitionProgressBar, session, { specificContent, specificValuesToNotExist });
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
    const expectedContent = 'submitted';
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.ccdStatus).to.eql(expectedContent);
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
    const expectedContent = 'issued';
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.ccdStatus).to.eql(expectedContent);
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
    const expectedContent = 'undefended';
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.ccdStatus).to.eql(expectedContent);
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
    const expectedContent = 'deemedService';
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.ccdStatus).to.eql(expectedContent);
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
    const expectedContent = 'dispensedWithService';
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.ccdStatus).to.eql(expectedContent);
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
    const expectedContent = 'defendedWithoutAnswer';
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.ccdStatus).to.eql(expectedContent);
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
    const expectedContent = 'defendedWithoutAnswer';
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.ccdStatus).to.eql(expectedContent);
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
