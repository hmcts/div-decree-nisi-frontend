const modulePath = 'steps/petition-progress-bar/PetitionProgressBar.step';

const PetitionProgressBar = require(modulePath);
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const getSteps = require('steps');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const { getUserData } = require('middleware/ccd');

const ignoreContent = [
  'submitted',
  'issued'
];

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(PetitionProgressBar, [ idam.protect(), getUserData ]);
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(PetitionProgressBar, ReviewAosResponse, getSteps());
  });

  it('renders the content', () => {
    return content(PetitionProgressBar, {}, { ignoreContent });
  });

  it('renders the content when ccd status is Submitted', () => {
    const session = {
      originalPetition: {
        connections: {},
        status: 'Submitted'
      }
    };
    const specificContent = ['submitted'];
    /*
     * Specific content to include "submitted" key existence based on session variable
     * Ignore content to ignore recursive keys checking in submitted content.
     */
    return content(PetitionProgressBar, session, { specificContent, ignoreContent });
  });

  it('renders the content ccd status is AOSstarted', () => {
    const session = {
      originalPetition: {
        connections: {},
        status: 'AOSstarted'
      }
    };
    const specificContent = ['issued'];
    return content(PetitionProgressBar, session, { specificContent, ignoreContent });
  });
});
