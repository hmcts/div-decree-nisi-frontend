const modulePath = 'steps/review-aos-response/ReviewAosResponse.step';

const ReviewAosResponse = require(modulePath);
const ReviewAosResponseContent = require('steps/review-aos-response/ReviewAosResponse.content');
const commonContent = require('common/content');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const idam = require('services/idam');
const { middleware, sinon, content,
  stepAsInstance, question, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ReviewAosResponse, [ idam.protect() ]);
  });

  describe('CCD state: AosSubmittedAwaitingAnswer', () => {
    it('renders the correct template', () => {
      const session = {
        case: {
          state: 'AosSubmittedAwaitingAnswer',
          data: {}
        }
      };
      const instance = stepAsInstance(ReviewAosResponse, session);
      expect(instance.responseTemplate).to.eql(instance.consts.viewTemplate);
    });

    it('Continue button should content not be rendered', () => {
      const session = {
        case: {
          state: 'AosSubmittedAwaitingAnswer',
          data: {}
        }
      };
      const specificContentToNotExist = [commonContent.en.continue];
      return content(ReviewAosResponse, session, { specificContentToNotExist });
    });
  });

  describe('CCD state: DNAwaiting', () => {
    it('renders the correct template', () => {
      const session = {
        case: {
          state: 'DNAwaiting',
          data: {}
        }
      };
      const instance = stepAsInstance(ReviewAosResponse, session);
      expect(instance.responseTemplate).to.eql(instance.consts.reviewTemplate);
    });

    it('Continue button should be rendered', () => {
      const session = {
        case: {
          state: 'DNAwaiting',
          data: {}
        }
      };
      const specificContent = [ 'continue' ];
      return content(ReviewAosResponse, session, { specificContent });
    });

    it('returns correct answers', () => {
      const expectedContent = [
        ReviewAosResponseContent.en.fields.reviewAosResponse.title,
        ReviewAosResponseContent.en.fields.reviewAosResponse.yes
      ];
      const session = {
        case: {
          data: {
            reviewAosResponse: 'yes'
          }
        }
      };
      return question.answers(ReviewAosResponse, {}, expectedContent, session);
    });

    it('redirects to next page', () => {
      const fields = { reviewAosResponse: 'yes' };
      return question.redirectWithField(ReviewAosResponse, fields, ApplyForDecreeNisi);
    });
  });

  describe('AOS Response: Content and respective values', () => {
    it('renders petitioner, respondent values and common content', () => {
      const session = {
        case: {
          data: {
            petitionerFirstName: 'petitioner',
            petitionerLastName: 'name',
            respondentFirstName: 'respondent',
            respondentLastName: 'name'
          }
        }
      };
      const specificContent = [
        'title',
        'youNeedToRead',
        'acknowledgementOfSrvice',
        'respondent',
        'applicant',
        'statementOfTruth.title',
        'statementOfTruth.details'
      ];
      const specificValues = [
        session.case.data.petitionerFirstName,
        session.case.data.petitionerLastName,
        session.case.data.respondentFirstName,
        session.case.data.respondentLastName
      ];
      return content(ReviewAosResponse, session, { specificContent, specificValues });
    });

    describe('How Respondnet wants to proceed section', () => {
      it('renders common conent in this section', () => {
        const session = { case: { data: {} } };
        const specificContent = [
          'respProceed.title',
          'whatThisMeans',
          'respProceed.givenOptions',
          'respProceed.proceedWithDivorce',
          'respProceed.proceedNotAccept',
          'respProceed.disagree'
        ];
        return content(ReviewAosResponse, session, { specificContent });
      });

      describe('Adultery : ', () => {
        it(`respDefendsDivorce: No,
            respAdmitOrConsentToFact: Yes`, () => {
          const session = {
            case: {
              data: {
                respDefendsDivorce: 'No',
                respAdmitOrConsentToFact: 'Yes',
                reasonForDivorce: 'adultery'
              }
            }
          };
          const specificContent = [
            'respProceed.willLetDivorceProceed',
            'respProceed.adultery.admitsAdultery'
          ];
          return content(ReviewAosResponse, session, { specificContent });
        });

        it(`respDefendsDivorce: Yes,
            respAdmitOrConsentToFact: No`, () => {
          const session = {
            case: {
              data: {
                respDefendsDivorce: 'Yes',
                respAdmitOrConsentToFact: 'No',
                reasonForDivorce: 'adultery'
              }
            }
          };
          const specificContent = [
            'respProceed.willDefendDivorce',
            'respProceed.adultery.doesNotAdmitAdultery'
          ];
          return content(ReviewAosResponse, session, { specificContent });
        });
      });

      describe('Separation 2 yr : ', () => {
        it(`respDefendsDivorce: No,
            respAdmitOrConsentToFact: Yes,
            respConsiderFinancialSituation: Yes`, () => {
          const session = {
            case: {
              data: {
                respDefendsDivorce: 'No',
                respAdmitOrConsentToFact: 'Yes',
                reasonForDivorce: 'separation-2-years',
                respConsiderFinancialSituation: 'Yes'
              }
            }
          };
          const specificContent = [
            'respProceed.willLetDivorceProceed',
            'respProceed.sep2Yr.respConsent',
            'respProceed.sep.intendingToDelayDivorce'
          ];
          return content(ReviewAosResponse, session, { specificContent });
        });

        it(`respDefendsDivorce: Yes,
            respAdmitOrConsentToFact: No,
            respConsiderFinancialSituation: No`, () => {
          const session = {
            case: {
              data: {
                respDefendsDivorce: 'Yes',
                respAdmitOrConsentToFact: 'No',
                reasonForDivorce: 'separation-2-years',
                respConsiderFinancialSituation: 'No'
              }
            }
          };
          const specificContent = [
            'respProceed.willDefendDivorce',
            'respProceed.sep2Yr.respDoesNotContent',
            'respProceed.sep.notIntendingToDelayDivorce'
          ];
          return content(ReviewAosResponse, session, { specificContent });
        });
      });

      describe('Separation 5 yr content and values : ', () => {
        it(`respDefendsDivorce: No,
              respAdmitOrConsentToFact: Yes,
              respConsiderFinancialSituation: Yes`, () => {
          const session = {
            case: {
              data: {
                respDefendsDivorce: 'No',
                respAdmitOrConsentToFact: 'Yes',
                reasonForDivorce: 'separation-5-years',
                respConsiderFinancialSituation: 'Yes'
              }
            }
          };
          const specificContent = [
            'respProceed.willLetDivorceProceed',
            'respProceed.sep.intendingToDelayDivorce'
          ];
          return content(ReviewAosResponse, session, { specificContent });
        });

        it(`respDefendsDivorce: Yes,
              respAdmitOrConsentToFact: No,
              respConsiderFinancialSituation: No
              respHardshipDefenseResponse: Yes`, () => {
          const session = {
            case: {
              data: {
                respDefendsDivorce: 'Yes',
                respAdmitOrConsentToFact: 'No',
                reasonForDivorce: 'separation-5-years',
                respConsiderFinancialSituation: 'No',
                respHardshipDefenseResponse: 'Yes',
                respHardshipDescription: 'Testing the reason content'
              }
            }
          };
          const specificContent = [
            'respProceed.willDefendDivorce',
            'respProceed.sep5Yr.defendingFinancialHardship',
            'respProceed.sep.notIntendingToDelayDivorce'
          ];
          const specificValues = [ session.case.data.respHardshipDescription ];
          return content(ReviewAosResponse, session, { specificContent, specificValues });
        });

        it(`respDefendsDivorce: Yes,
              respAdmitOrConsentToFact: No,
              respConsiderFinancialSituation: No
              respHardshipDefenseResponse: No `, () => {
          const session = {
            case: {
              data: {
                respDefendsDivorce: 'Yes',
                respAdmitOrConsentToFact: 'No',
                reasonForDivorce: 'separation-5-years',
                respConsiderFinancialSituation: 'No',
                respHardshipDefenseResponse: 'No'
              }
            }
          };
          const specificContent = [
            'respProceed.willDefendDivorce',
            'respProceed.sep5Yr.notDefendingFinancialHardship',
            'respProceed.sep.notIntendingToDelayDivorce'
          ];
          return content(ReviewAosResponse, session, { specificContent });
        });
      });

      describe('Desertion : ', () => {
        it(`respDefendsDivorce: No,
            respAdmitOrConsentToFact: No`, () => {
          const session = {
            case: {
              data: {
                respDefendsDivorce: 'No',
                respAdmitOrConsentToFact: 'No',
                reasonForDivorce: 'desertion'
              }
            }
          };
          const specificContent = ['respProceed.letDivorceProceedButNotAdmit'];
          return content(ReviewAosResponse, session, { specificContent });
        });
      });

      describe('UnReasonable behaviour : ', () => {
        it(`respDefendsDivorce: No,
            respAdmitOrConsentToFact: No`, () => {
          const session = {
            case: {
              data: {
                respDefendsDivorce: 'No',
                respAdmitOrConsentToFact: 'No',
                reasonForDivorce: 'unreasonable-behaviour'
              }
            }
          };
          const specificContent = ['respProceed.letDivorceProceedButNotAdmit'];
          return content(ReviewAosResponse, session, { specificContent });
        });
      });
    });

    describe('Jurisdiction of the court section', () => {
      it('renders common conent in this section', () => {
        const session = { case: { data: {} } };
        const specificContent = [
          'jurisdiction.title',
          'whatThisMeans',
          'jurisdiction.respondentWasAsked',
          'jurisdiction.courtProceedings'
        ];
        return content(ReviewAosResponse, session, { specificContent });
      });

      it('respJurisdictionAgree: Yes', () => {
        const session = {
          case: {
            data: {
              respJurisdictionAgree: 'Yes'
            }
          }
        };
        const specificContent = ['jurisdiction.respondentAgrees'];
        return content(ReviewAosResponse, session, { specificContent });
      });

      it('respJurisdictionAgree: No', () => {
        const session = {
          case: {
            data: {
              respJurisdictionAgree: 'No',
              respJurisdictionDisagreeReason: 'Disagreed due to some reason',
              respJurisdictionRespCountryOfResidence: 'India'
            }
          }
        };
        const specificContent = [
          'jurisdiction.respDoesNotAgree',
          'jurisdiction.detailsGiven',
          'jurisdiction.countryTheyResp'
        ];
        const specificValues = [
          session.case.data.respJurisdictionDisagreeReason,
          session.case.data.respJurisdictionRespCountryOfResidence
        ];
        return content(ReviewAosResponse, session, { specificContent, specificValues });
      });


      it('respLegalProceedingsExist: Yes', () => {
        const session = {
          case: {
            data: {
              respLegalProceedingsExist: 'Yes',
              respLegalProceedingsDescription: 'Description for legal proceedings'
            }
          }
        };
        const specificValues = [ session.case.data.respLegalProceedingsDescription ];
        const specificContent = ['jurisdiction.otherProceedings'];
        return content(ReviewAosResponse, session, { specificContent, specificValues });
      });

      it('respLegalProceedingsExist: No', () => {
        const session = {
          case: {
            data: {
              respLegalProceedingsExist: 'No'
            }
          }
        };
        const specificContent = ['jurisdiction.noOtherProceedings'];
        return content(ReviewAosResponse, session, { specificContent });
      });
    });

    describe('Costs order section', () => {
      it('renders common conent in this section', () => {
        const session = { case: { data: {} } };
        const specificContent = [
          'costsOrder.title',
          'whatThisMeans',
          'costsOrder.respondentWasAskedPayCosts',
          'costsOrder.followingOptions',
          'costsOrder.payCosts',
          'costsOrder.notPayCosts',
          'costsOrder.chanceToChangeAmount'
        ];
        return content(ReviewAosResponse, session, { specificContent });
      });

      it('respAgreeToCosts: Yes', () => {
        const session = {
          case: {
            data: {
              respAgreeToCosts: 'Yes'
            }
          }
        };
        const specificContent = ['costsOrder.agreedToPayCosts'];
        return content(ReviewAosResponse, session, { specificContent });
      });


      it('respAgreeToCosts: No', () => {
        const session = {
          case: {
            data: {
              respAgreeToCosts: 'No',
              respCostsReason: 'Respondent given reason for costs'
            }
          }
        };
        const specificContent = ['costsOrder.notAgreedToPayCosts'];
        const specificValues = [ session.case.data.respCostsReason ];
        return content(ReviewAosResponse, session, { specificContent, specificValues });
      });
    });
  });
});
