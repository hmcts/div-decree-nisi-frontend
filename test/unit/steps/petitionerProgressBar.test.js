const modulePath = 'steps/petition-progress-bar/PetitionProgressBar.step';

const PetitionProgressBar = require(modulePath);
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
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
  'submittedAppStatusMsgDetails',
  'submittedWhatHappensNext',
  'submittedWhatHappensNextDetails1',
  'submittedWhatHappensNextDetails2',
  'submittedWhatHappensNextDetails3'
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

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(PetitionProgressBar, ReviewAosResponse, getSteps());
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
     * Excluded content keeps on going as and when new templates gets added.
     */
    const specificValuesToNotExist = issuedContent;
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
     * Excluded content keeps on going as and when new templates gets added.
     */
    const specificValuesToNotExist = specificContent;
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

  it('renders the correct template when ccd status is awaitingConsiderationDN', () => {
    const session = {
      case: {
        state: 'awaitingConsiderationDN',
        data: {
          connections: {}
        }
      }
    };
    const expectedContent = 'awaiting';
    const instance = stepAsInstance(PetitionProgressBar, session);
    expect(instance.ccdStatus).to.eql(expectedContent);
  });
});
