const modulePath = 'steps/petition-progress-bar/PetitionProgressBar.step';

const PetitionProgressBar = require(modulePath);
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content,
  stepAsInstance, expect } = require('@hmcts/one-per-page-test-suite');
const glob = require('glob');

// get all content for all pages
const pageContent = {};
glob.sync('steps/petition-progress-bar/**/*.json').forEach(file => {
  const stepContent = require(file); // eslint-disable-line global-require

  const scope = file.match(/content\.(.*)\.json/);
  if (scope && scope.length) {
    pageContent[scope[1]] = stepContent.en;
  }
});

// function to return all content that should not be rendered.
// some pages have the same content so this will also remove content keys
// that have the same content as that we are testing
const contentToNotExist = withoutKeysFrom => {
  return Object.keys(pageContent).reduce((allContent, contentKey) => {
    if (withoutKeysFrom === contentKey) {
      return allContent;
    }
    const contentToIgnore = Object.keys(pageContent[contentKey]).filter(key => {
      return !Object.values(pageContent[withoutKeysFrom]).includes(pageContent[contentKey][key]);
    });
    return [...allContent, ...contentToIgnore];
  }, []);
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
    const specificContent = pageContent.submitted;
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificContentToNotExist = contentToNotExist('submitted');

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
    const specificContent = pageContent.issued;
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificContentToNotExist = contentToNotExist('issued');

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
    const specificContent = pageContent.undefended;
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificContentToNotExist = contentToNotExist('undefended');

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
    const specificContent = pageContent.deemedService;
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificContentToNotExist = contentToNotExist('deemedService');

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
    const specificContent = pageContent.dispensedWithService;
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificContentToNotExist = contentToNotExist('dispensedWithService');

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
    const specificContent = pageContent.defendedWithoutAnswer;
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificContentToNotExist = contentToNotExist('defendedWithoutAnswer');

    return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
  });

  it('renders the content when ccd status is DNawaiting & permittedDecreeNisiReason is 4', () => {
    const session = {
      case: {
        state: 'DNawaiting',
        data: {
          permittedDecreeNisiReason: '4'
        }
      }
    };
    const specificContent = pageContent.defendedWithoutAnswer;
    /**
     * Excluded content should be added as and when new templates gets added.
     */
    const specificContentToNotExist = contentToNotExist('defendedWithoutAnswer');

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

  it('renders pageContent.dispensedWithService if ccdstatus is DNawaiting, DNReason is 2', () => {
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

  describe('case state is AosSubmittedAwaitingAnswer', () => {
    const session = {
      case: {
        state: 'AosSubmittedAwaitingAnswer',
        data: {}
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.respondentNotReplied);
      const specificContentToNotExist = contentToNotExist('defendedAwaitingAnswer');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('returns correct folder name', () => {
      const expectedContent = 'defendedAwaitingAnswer';
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.ccdStatus).to.eql(expectedContent);
    });
  });

  describe('CCD state: AOSOverdue', () => {
    const session = {
      case: {
        state: 'AOSOverdue',
        data: {}
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.respondentNotReplied);
      const specificContentToNotExist = contentToNotExist('respondentNotReplied');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const expectedContent = 'respondentNotReplied';
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.ccdStatus).to.eql(expectedContent);
    });
  });

  describe('navigation', () => {
    it('rediects to ApplyForDecreeNisi when CCD has respDefendsDivorce as null', () => {
      const session = {
        case: {
          data: {
            respDefendsDivorce: null
          }
        }
      };
      interstitial.navigatesToNext(PetitionProgressBar, ApplyForDecreeNisi, session);
    });

    it('redirects reviewAosResponse when CCD has respDefendsDivorce as Yes', () => {
      const session = {
        case: {
          data: {
            respDefendsDivorce: 'Yes'
          }
        }
      };
      interstitial.navigatesToNext(PetitionProgressBar, ReviewAosResponse, session);
    });
  });
});
