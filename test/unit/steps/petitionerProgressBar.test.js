/* eslint-disable max-lines */
const modulePath = 'steps/petition-progress-bar/PetitionProgressBar.step';

const config = require('config');
const PetitionProgressBar = require(modulePath);
const PetProgressBarContent = require('steps/petition-progress-bar/PetitionProgressBar.content');
const DnNoResponse = require('steps/dn-no-response/DnNoResponse.step');
const ReviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const idam = require('services/idam');
const { custom, middleware, interstitial, sinon, content,
  stepAsInstance, expect } = require('@hmcts/one-per-page-test-suite');
const checkCaseState = require('middleware/checkCaseState');
const httpStatus = require('http-status-codes');
const glob = require('glob');
const { getExpectedCourtsList, testDivorceUnitDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');
const moment = require('moment');

const feesAndPaymentsService = require('services/feesAndPaymentsService');

const templates = {
  submitted: './sections/submitted/PetitionProgressBar.submitted.template.html',
  issued: './sections/issued/PetitionProgressBar.issued.template.html',
  defended: './sections/defendedWithAnswer/PetitionProgressBar.defendedWithAnswer.template.html',
  undefended: './sections/undefended/PetitionProgressBar.undefended.template.html',
  accepted: './sections/accepted/PetitionProgressBar.accepted.template.html',
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
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    sandbox.restore();
    feesAndPaymentsService.getFee.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(PetitionProgressBar, [idam.protect()], checkCaseState);
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

    it('renders content for when respondent does not admit fact - amended case', () => {
      const noAdmitSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            permittedDecreeNisiReason: '0',
            respAdmitOrConsentToFact: 'No',
            previousCaseId: '12345'
          }
        }
      };
      const specificContent = ['undefendedAmendedCaseButNotAdmit'];
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

    it('renders content for when respondent does admit fact - amended case', () => {
      const yesAdmitSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            permittedDecreeNisiReason: '0',
            respAdmitOrConsentToFact: 'Yes',
            previousCaseId: '12345'
          }
        }
      };

      const specificContent = ['undefendedAmendedAppStatusMsgDetails1'];
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

    it('renders content for when respondent does admit fact', () => {
      const yesAdmitSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            permittedDecreeNisiReason: '1'
          }
        }
      };

      const specificContent = ['deemedServiceAppStatusMsgDetails1'];
      return content(PetitionProgressBar, yesAdmitSession, { specificContent });
    });

    it('renders content for when respondent does admit fact - amended case', () => {
      const yesAdmitSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            permittedDecreeNisiReason: '1',
            previousCaseId: '12345'
          }
        }
      };

      const specificContent = ['deemedServiceAmendedAppStatusMsgDetails1'];
      return content(PetitionProgressBar, yesAdmitSession, { specificContent });
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

    it('renders content for when respondent does admit fact', () => {
      const yesAdmitSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            permittedDecreeNisiReason: '2'
          }
        }
      };

      const specificContent = ['dWSAppStatusMsgDetails1'];
      return content(PetitionProgressBar, yesAdmitSession, { specificContent });
    });

    it('renders content for when respondent does admit fact - amended case', () => {
      const yesAdmitSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            permittedDecreeNisiReason: '2',
            previousCaseId: '12345'
          }
        }
      };

      const specificContent = ['dWSAmendedAppStatusMsgDetails1'];
      return content(PetitionProgressBar, yesAdmitSession, { specificContent });
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

    it('renders content for when case was not amended', () => {
      const specificContent = ['dAAHasRespondend'];
      return content(PetitionProgressBar, session, { specificContent });
    });

    it('renders content for amended case', () => {
      const amendedCaseSession = {
        case: {
          state: 'AosSubmittedAwaitingAnswer',
          data: {
            previousCaseId: '12345'
          }
        }
      };

      const specificContent = ['dAAHasRespondendForAmendedCase'];
      return content(PetitionProgressBar, amendedCaseSession, { specificContent });
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

    beforeEach(() => {
      sandbox.replace(config.features, 'release520', true);
    });

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
  });

  // eslint-disable-next-line max-len
  describe('CCD state: AosCompleted, D8ReasonForDivorce : separation-2-years, RespAdmitOrConsentToFact : no', () => {
    const session = {
      case: {
        state: 'AosCompleted',
        data: {
          reasonForDivorce: 'separation-2-years',
          respAdmitOrConsentToFact: 'No'
        }
      }
    };

    it('renders the correct content', () => {
      sandbox.replace(config.features, 'release520', true);
      const specificContent = Object.keys(pageContent.aosCompleted);
      const specificContentToNotExist = contentToNotExist('aosCompleted');

      return content(PetitionProgressBar,
        session,
        { specificContent, specificContentToNotExist });
    });

    it('renders the correct template', () => {
      sandbox.replace(config.features, 'release520', true);
      const instance = stepAsInstance(PetitionProgressBar, session);
      return expect(instance.stateTemplate).to.eql(templates.aosCompleted);
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

    it('renders content for when case was not amended', () => {
      const specificContent = ['defendedServiceAppStatusMsgDetails1'];
      return content(PetitionProgressBar, session, { specificContent });
    });

    it('renders content for amended case', () => {
      const amendedCaseSession = {
        case: {
          state: 'DefendedDivorce',
          data: {
            previousCaseId: '12345'
          }
        }
      };

      const specificContent = ['defendedServiceAmendedAppStatusMsgDetails1'];
      return content(PetitionProgressBar, amendedCaseSession, { specificContent });
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

    beforeEach(() => {
      sandbox.replace(config.features, 'release520', false);
    });

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


  // d8: [
  //   {
  //     id: '401ab79e-34cb-4570-9f2f-4cf9357m4st3r',
  //     createdBy: 0,
  //     createdOn: null,
  //     lastModifiedBy: 0,
  //     modifiedOn: null,
  //     fileName: 'd8petition1554740111371638.pdf',
  //     fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f',
  //     mimeType: null,
  //     status: null
  //   },
  //   {
  //     id: '401ab79e-34cb-4570-9f2f-4cf9357tes1t',
  //     createdBy: 0,
  //     createdOn: null,
  //     lastModifiedBy: 0,
  //     modifiedOn: null,
  //     fileName: 'entitlementToDecree1554740113754321.pdf',
  //     fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f',
  //     mimeType: null,
  //     status: null
  //   }
  // ],

  describe('CCD state: AwaitingPronouncement', () => {

    const session = {
      case: {
        state: 'AwaitingPronouncement',
        data: {
          hearingDate: [moment().add(-7, 'days'), moment().add(7, 'days')]
        }
      }
    };

    const hearingDateList = session.case.data.hearingDate;

    beforeEach(() => {
      sandbox.replace(config.features, 'release520', false);
    });

    it('renders the correct content', () => {
      let specificContent = null;
      if (!hearingDateList || hearingDateList.size === 0) {
        specificContent = Object.keys(pageContent.awaitingSubmittedDN);
      } else {
        specificContent = Object.keys(pageContent.accepted);
      }
      return content(PetitionProgressBar, session, { specificContent });
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(PetitionProgressBar, session);
      if (!hearingDateList || hearingDateList.size === 0) {
        expect(instance.stateTemplate).to.eql(templates.awaitingSubmittedDN);
      } else {
        expect(instance.stateTemplate).to.eql(templates.accepted);
      }
    });

    it('returns the correct files', () => {
      session.case.d8 = [
        {
          id: '401ab79e-34cb-4570-9f2f-4cf9357m4st3r',
          createdBy: 0,
          createdOn: null,
          lastModifiedBy: 0,
          modifiedOn: null,
          fileName: 'd8petition1554740111371638.pdf',
          fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f',
          mimeType: null,
          status: null
        },
        {
          id: '401ab79e-34cb-4570-9f2f-4cf9357tes1t',
          createdBy: 0,
          createdOn: null,
          lastModifiedBy: 0,
          modifiedOn: null,
          fileName: 'entitlementToDecree1554740113754321.pdf',
          fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f',
          mimeType: null,
          status: null
        }
      ];
      const instance = stepAsInstance(PetitionProgressBar, session);

      const fileTypes = instance.downloadableFiles.map(file => {
        return file.type;
      });

      expect(fileTypes).to.eql([
        'd8petition',
        'entitlementToDecree'
      ]);
    });
  });

  describe('CCD state: AwaitingClarification', () => {
    const session = {
      case: {
        state: 'AwaitingClarification',
        data: {}
      }
    };

    beforeEach(() => {
      sandbox.replace(config.features, 'release520', false);
    });

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
          state: 'awaitingdecreenisi',
          data: {
            respWillDefendDivorce: null
          }
        }
      };
      return interstitial.navigatesToNext(PetitionProgressBar, ApplyForDecreeNisi, session);
    });

    it('redirects reviewAosResponse when CCD has respWillDefendDivorce as Yes', () => {
      const session = {
        case: {
          state: 'awaitingdecreenisi',
          data: {
            respWillDefendDivorce: 'Yes'
          }
        }
      };
      return interstitial.navigatesToNext(PetitionProgressBar, ReviewAosResponse, session);
    });

    it('to reviewAosResponse when reason is two years and respWillDefendDivorce is Yes', () => {
      const session = {
        case: {
          state: 'awaitingdecreenisi',
          data: {
            reasonForDivorce: 'separation-2-years',
            respWillDefendDivorce: 'Yes'
          }
        }
      };
      return interstitial.navigatesToNext(PetitionProgressBar, ReviewAosResponse, session);
    });

    it('to reviewAosResponse when reason is two years and respWillDefendDivorce is No', () => {
      const session = {
        case: {
          state: 'awaitingdecreenisi',
          data: {
            reasonForDivorce: 'separation-2-years',
            respWillDefendDivorce: 'No'
          }
        }
      };
      return interstitial.navigatesToNext(PetitionProgressBar, ReviewAosResponse, session);
    });
  });
});
