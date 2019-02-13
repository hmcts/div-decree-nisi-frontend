const modulePath = 'steps/petition-progress-bar/PetitionProgressBar.step';

const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');
const PetitionProgressBar = require(modulePath);
const PetProgressBarContent = require('steps/petition-progress-bar/PetitionProgressBar.content');
const DnNoResponse = require('steps/dn-no-response/DnNoResponse.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const idam = require('services/idam');
const { custom, middleware, interstitial, sinon, content,
  stepAsInstance, expect } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const glob = require('glob');
const { getExpectedCourtsList, testDivorceUnitDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');

const templates = {
  submitted: './sections/submitted/PetitionProgressBar.submitted.template.html',
  issued: './sections/issued/PetitionProgressBar.issued.template.html',
  defended: './sections/defendedWithAnswer/PetitionProgressBar.defendedWithAnswer.template.html',
  undefended: './sections/undefended/PetitionProgressBar.undefended.template.html',
  deemedService: './sections/deemedService/PetitionProgressBar.deemedService.template.html',
  dispensedWithService:
    './sections/dispensedWithService/PetitionProgressBar.dispensedWithService.template.html',
  defendedWithoutAnswer:
    './sections/defendedWithoutAnswer/PetitionProgressBar.defendedWithoutAnswer.template.html',
  awaitingSubmittedDN:
    './sections/awaitingSubmittedDN/PetitionProgressBar.awaitingSubmittedDN.template.html',
  defendedWithAnswer:
    './sections/defendedWithAnswer/PetitionProgressBar.defendedWithAnswer.template.html',
  respondentNotReplied:
    './sections/respondentNotReplied/PetitionProgressBar.respondentNotReplied.template.html',
  defendedAwaitingAnswer:
    './sections/defendedAwaitingAnswer/PetitionProgressBar.defendedAwaitingAnswer.template.html',
  aosCompleted:
    './sections/aosCompleted/PetitionProgressBar.aosCompleted.template.html'
};

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
// some pages have the same content/sub content so this will also remove content keys
// that have the same content as that we are testing
const contentToNotExist = withoutKeysFrom => {
  return Object.keys(pageContent).reduce((allContent, contentKey) => {
    if (withoutKeysFrom === contentKey) {
      return allContent;
    }
    const contentToIgnore = Object.keys(pageContent[contentKey]).filter(key => {
      let ignoreContent = true;
      Object.values(pageContent[withoutKeysFrom]).forEach(value => {
        if (value.includes(pageContent[contentKey][key])) {
          ignoreContent = false;
        }
      });
      return ignoreContent;
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
    return middleware.hasMiddleware(PetitionProgressBar, [idam.protect()]);
  });

  describe('CCD state: Submitted', () => {
    const referenceNumber = '1234‐5678‐9012‐4567';
    const session = {
      case: {
        caseId: referenceNumber.replace(/‐/g, ''),
        state: 'Submitted',
        data: {}
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.submitted);
      const specificContentToNotExist = contentToNotExist('submitted');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.submitted);
    });

    it('displays case id', () => {
      return content(PetitionProgressBar, session, { specificValues: [ referenceNumber ] });
    });
  });

  describe('CCD state: AOSstarted', () => {
    const session = {
      case: {
        state: 'AOSstarted',
        data: {
          caseReference: 'LV17D80101'
        }
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.issued);
      const specificContentToNotExist = contentToNotExist('issued');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.issued);
    });

    it('displays case reference', () => {
      return content(
        PetitionProgressBar,
        session,
        {
          specificValues: [ session.case.data.caseReference ]
        });
    });
  });

  describe('CCD state: DNawaiting, DNReason : 0 ', () => {
    const session = {
      case: {
        state: 'AwaitingDecreeNisi',
        data: {
          permittedDecreeNisiReason: '0'
        }
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.undefended);
      const specificContentToNotExist = contentToNotExist('undefended');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.undefended);
    });

    it('renders content for when respondent does not admit fact', () => {
      const noAdmitSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            permittedDecreeNisiReason: '0',
            respAdmitOrConsentToFact: 'No'
          }
        }
      };
      const specificContent = ['undefendedButNotAdmit'];

      return content(PetitionProgressBar, noAdmitSession, { specificContent });
    });

    it('renders content for when respondent does admit fact', () => {
      const yesAdmitSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            permittedDecreeNisiReason: '0',
            respAdmitOrConsentToFact: 'Yes'
          }
        }
      };
      const specificContent = ['undefendedAppStatusMsgDetails1'];

      return content(PetitionProgressBar, yesAdmitSession, { specificContent });
    });
  });

  describe('CCD state: DNawaiting, DNReason : 1 ', () => {
    const session = {
      case: {
        state: 'AwaitingDecreeNisi',
        data: {
          permittedDecreeNisiReason: '1'
        }
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.deemedService);
      const specificContentToNotExist = contentToNotExist('deemedService');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.deemedService);
    });
  });

  describe('CCD state: DNawaiting, DNReason : 2 ', () => {
    const session = {
      case: {
        state: 'AwaitingDecreeNisi',
        data: {
          permittedDecreeNisiReason: '2'
        }
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.dispensedWithService);
      const specificContentToNotExist = contentToNotExist('dispensedWithService');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.dispensedWithService);
    });
  });

  describe('CCD state: DNawaiting, DNReason : 3 ', () => {
    const session = {
      case: {
        state: 'AwaitingDecreeNisi',
        data: {
          permittedDecreeNisiReason: '3'
        }
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.defendedWithoutAnswer);
      const specificContentToNotExist = contentToNotExist('defendedWithoutAnswer');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.defendedWithoutAnswer);
    });
  });


  describe('CCD state: DNawaiting, DNReason : 4 ', () => {
    const session = {
      case: {
        state: 'AwaitingDecreeNisi',
        data: {
          permittedDecreeNisiReason: '4'
        }
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.defendedWithoutAnswer);
      const specificContentToNotExist = contentToNotExist('defendedWithoutAnswer');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.defendedWithoutAnswer);
    });
  });

  describe('CCD state: AosSubmittedAwaitingAnswer', () => {
    const session = {
      case: {
        state: 'AosSubmittedAwaitingAnswer',
        data: {}
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.defendedAwaitingAnswer);
      const specificContentToNotExist = contentToNotExist('defendedAwaitingAnswer');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('returns correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.defendedAwaitingAnswer);
    });
  });

  // eslint-disable-next-line max-len
  describe('CCD state: AosCompleted, D8ReasonForDivorce : adultery, RespAdmitOrConsentToFact : no', () => {
    const session = {
      case: {
        state: 'AosCompleted',
        data: {
          reasonForDivorce: 'adultery',
          respAdmitOrConsentToFact: 'No'
        }
      }
    };

    if (parseBool(config.features.release520)) {
      it('renders the correct content', () => {
        const specificContent = Object.keys(pageContent.aosCompleted);
        const specificContentToNotExist = contentToNotExist('aosCompleted');

        return content(PetitionProgressBar,
          session,
          { specificContent, specificContentToNotExist });
      });

      it('renders the correct template', () => {
        const instance = stepAsInstance(PetitionProgressBar, session);
        expect(instance.stateTemplate).to.eql(templates.aosCompleted);
      });
    }
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
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.respondentNotReplied);
    });
  });

  describe('CCD state: DefendedDivorce', () => {
    const session = {
      case: {
        state: 'DefendedDivorce',
        data: {}
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.defendedWithAnswer);
      const specificContentToNotExist = contentToNotExist('defendedWithAnswer');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.defendedWithAnswer);
    });
  });

  describe('CCD state: AwaitingLegalAdvisorReferral', () => {
    const session = {
      case: {
        state: 'AwaitingLegalAdvisorReferral',
        data: {}
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.awaitingSubmittedDN);
      const specificContentToNotExist = contentToNotExist('awaitingSubmittedDN');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingSubmittedDN);
    });
  });

  describe('CCD state: AwaitingConsideration', () => {
    const session = {
      case: {
        state: 'AwaitingConsideration',
        data: {}
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.awaitingSubmittedDN);
      const specificContentToNotExist = contentToNotExist('awaitingSubmittedDN');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingSubmittedDN);
    });
  });

  describe('CCD state: AwaitingPronouncement', () => {
    const session = {
      case: {
        state: 'AwaitingPronouncement',
        data: {}
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.awaitingSubmittedDN);
      const specificContentToNotExist = contentToNotExist('awaitingSubmittedDN');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingSubmittedDN);
    });
  });

  describe('CCD state: AwaitingClarification', () => {
    const session = {
      case: {
        state: 'AwaitingClarification',
        data: {}
      }
    };

    it('renders the correct content', () => {
      const specificContent = Object.keys(pageContent.awaitingSubmittedDN);
      const specificContentToNotExist = contentToNotExist('awaitingSubmittedDN');

      return content(PetitionProgressBar, session, { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingSubmittedDN);
    });
  });

  describe('court address details', () => {
    it('should display divorce center details when divorce unit handles case', () => {
      const session = {
        case: {
          state: 'AwaitingLegalAdvisorReferral',
          data: {
            courts: 'westMidlands',
            court: getExpectedCourtsList()
          }
        }
      };

      return custom(PetitionProgressBar)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.column-one-third').html();

          testDivorceUnitDetailsRender(rightHandSideMenu);
          expect(rightHandSideMenu).to.include(PetProgressBarContent.en.openTimes)
            .and.to.include(PetProgressBarContent.en.divorceEmail)
            .and.to.include(PetProgressBarContent.en.phoneNumber);
        });
    });

    it('should display service center details when service centre handles case', () => {
      const session = {
        case: {
          state: 'AwaitingLegalAdvisorReferral',
          data: {
            courts: 'serviceCentre',
            court: getExpectedCourtsList()
          }
        }
      };

      return custom(PetitionProgressBar)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.column-one-third').html();

          testCTSCDetailsRender(rightHandSideMenu);
          expect(rightHandSideMenu).to.include(PetProgressBarContent.en.openTimes)
            .and.to.include(PetProgressBarContent.en.divorceEmail)
            .and.to.include(PetProgressBarContent.en.phoneNumber);
        });
    });
  });

  describe('navigation', () => {
    it('redirects dnNoResponse when CCD state: AOSOverdue', () => {
      const session = {
        case: {
          state: 'AOSOverdue',
          data: {}
        }
      };
      return interstitial.navigatesToNext(PetitionProgressBar, DnNoResponse, session);
    });

    it('rediects to ApplyForDecreeNisi when CCD has respWillDefendDivorce as null', () => {
      const session = {
        case: {
          data: {
            respWillDefendDivorce: null
          }
        }
      };
      return interstitial.navigatesToNext(PetitionProgressBar, ApplyForDecreeNisi, session);
    });
  });
});
