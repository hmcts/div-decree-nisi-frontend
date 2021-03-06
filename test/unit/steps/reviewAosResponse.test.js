const modulePath = 'steps/review-aos-response/ReviewAosResponse.step';

const ReviewAosResponse = require(modulePath);

const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
// eslint-disable-next-line max-len
const ReviewAosResponseFromCoRespondent = require('steps/review-aos-response-from-co-respondent/ReviewAosResponseFromCoRespondent.step');
const AmendApplication = require('steps/amend-application/AmendApplication.step');
const idam = require('services/idam');
const {
  middleware, sinon, content, question
} = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ReviewAosResponse, [idam.protect()]);
  });

  describe('AOS Response: Content and respective values', () => {
    it('renders petitioner, respondent values and common content', () => {
      const session = {
        case: {
          data: {
            petitionerFirstName: 'petitioner',
            petitionerLastName: 'name',
            respondentFirstName: 'respondent',
            respondentLastName: 'name',
            respWillDefendDivorce: 'Yes'
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

    describe('Respondent solicitor representation', () => {
      it('renders sub-heading if respondentSolicitorRepresented is yes', () => {
        const session = {
          case: {
            data: {
              respWillDefendDivorce: 'Yes',
              reasonForDivorce: 'desertion',
              respondentSolicitorRepresented: 'Yes'
            }
          }
        };
        const specificContent = ['respSolicitorRepresented'];
        return content(ReviewAosResponse, session, { specificContent });
      });
      it('Do not render sub-heading if respondentSolicitorRepresented is not available', () => {
        const session = {
          case: {
            data: {
              respWillDefendDivorce: 'Yes',
              reasonForDivorce: 'desertion'
            }
          }
        };
        const specificContentToNotExist = ['respSolicitorRepresented'];
        return content(ReviewAosResponse, session, { specificContentToNotExist });
      });
    });

    describe('How Respondent wants to proceed section', () => {
      it('renders common conent in this section', () => {
        const session = {
          case: {
            data: {
              respWillDefendDivorce: 'Yes',
              reasonForDivorce: 'desertion'
            }
          }
        };
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
        it(`respWillDefendDivorce: No,
            respAdmitOrConsentToFact: Yes`, () => {
          const session = {
            case: {
              data: {
                respWillDefendDivorce: 'No',
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

        it(`respWillDefendDivorce: Yes,
            respAdmitOrConsentToFact: No`, () => {
          const session = {
            case: {
              data: {
                respWillDefendDivorce: 'Yes',
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
        it(`respWillDefendDivorce: No,
            respAdmitOrConsentToFact: Yes,
            respConsiderFinancialSituation: Yes`, () => {
          const session = {
            case: {
              data: {
                respWillDefendDivorce: 'No',
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

        it(`respWillDefendDivorce: Yes,
            respAdmitOrConsentToFact: No,
            respConsiderFinancialSituation: No`, () => {
          const session = {
            case: {
              data: {
                respWillDefendDivorce: 'Yes',
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
        it(`respWillDefendDivorce: No,
              respAdmitOrConsentToFact: Yes,
              respConsiderFinancialSituation: Yes`, () => {
          const session = {
            case: {
              data: {
                respWillDefendDivorce: 'No',
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

        it(`respWillDefendDivorce: Yes,
              respAdmitOrConsentToFact: No,
              respConsiderFinancialSituation: No
              respHardshipDefenseResponse: Yes`, () => {
          const session = {
            case: {
              data: {
                respWillDefendDivorce: 'Yes',
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
          const specificValues = [session.case.data.respHardshipDescription];
          return content(ReviewAosResponse, session, { specificContent, specificValues });
        });

        it(`respWillDefendDivorce: Yes,
              respAdmitOrConsentToFact: No,
              respConsiderFinancialSituation: No
              respHardshipDefenseResponse: No `, () => {
          const session = {
            case: {
              data: {
                respWillDefendDivorce: 'Yes',
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
        it(`respWillDefendDivorce: No,
            respAdmitOrConsentToFact: No`, () => {
          const session = {
            case: {
              data: {
                respWillDefendDivorce: 'NoNoAdmission',
                reasonForDivorce: 'desertion'
              }
            }
          };
          const specificContent = ['respProceed.letDivorceProceedButNotAdmit'];
          return content(ReviewAosResponse, session, { specificContent });
        });
      });

      describe('UnReasonable behaviour : ', () => {
        it(`respWillDefendDivorce: No,
            respAdmitOrConsentToFact: No`, () => {
          const session = {
            case: {
              data: {
                respWillDefendDivorce: 'NoNoAdmission',
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
        const session = { case: { data: { respWillDefendDivorce: 'Yes' } } };
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
              respJurisdictionAgree: 'Yes',
              respWillDefendDivorce: 'Yes'
            }
          }
        };
        const specificContent = ['jurisdiction.respondentAgrees'];
        return content(ReviewAosResponse, session, { specificContent });
      });

      describe('respJurisdictionAgree: NO', () => {
        it('should display RespJurisdictionRespCountryOfResidence, for online respondent', () => {
          const session = {
            case: {
              data: {
                respJurisdictionAgree: 'No',
                respJurisdictionDisagreeReason: 'Outside of UK',
                respJurisdictionRespCountryOfResidence: 'America',
                respContactMethodIsDigital: true
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

        it('should hide RespJurisdictionRespCountryOfResidence, for offline respondent', () => {
          const session = {
            case: {
              data: {
                respJurisdictionAgree: 'No',
                respJurisdictionDisagreeReason: 'Outside of UK',
                respJurisdictionRespCountryOfResidence: 'America',
                respContactMethodIsDigital: false
              }
            }
          };

          const specificContent = [
            'jurisdiction.respDoesNotAgree',
            'jurisdiction.detailsGiven'
          ];
          const specificValues = [session.case.data.respJurisdictionDisagreeReason];
          return content(ReviewAosResponse, session, {
            specificContent, specificValues,
            specificValuesToNotExist: [session.case.data.respJurisdictionRespCountryOfResidence],
            specificContentToNotExist: ['jurisdiction.countryTheyResp']
          });
        });
      });

      it('respLegalProceedingsExist: Yes', () => {
        const session = {
          case: {
            data: {
              respLegalProceedingsExist: 'Yes',
              respLegalProceedingsDescription: 'Description for legal proceedings',
              respWillDefendDivorce: 'Yes'
            }
          }
        };
        const specificValues = [session.case.data.respLegalProceedingsDescription];
        const specificContent = [
          'jurisdiction.otherProceedings',
          'jurisdiction.otherCourtDetails'
        ];
        return content(ReviewAosResponse, session, { specificContent, specificValues });
      });

      it('respLegalProceedingsExist: No', () => {
        const session = {
          case: {
            data: {
              respLegalProceedingsExist: 'No',
              respWillDefendDivorce: 'Yes'
            }
          }
        };
        const specificContent = [
          'jurisdiction.noOtherProceedings',
          'jurisdiction.otherCourtDetails'
        ];
        return content(ReviewAosResponse, session, { specificContent });
      });
    });

    describe('Costs order section', () => {
      it('renders common conent in this section', () => {
        const session = { case: { data: { respWillDefendDivorce: 'Yes' } } };
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
              respAgreeToCosts: 'Yes',
              respWillDefendDivorce: 'Yes'
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
              respCostsReason: 'Respondent given reason for costs',
              respWillDefendDivorce: 'Yes'
            }
          }
        };
        const specificContent = ['costsOrder.notAgreedToPayCosts'];
        const specificValues = [session.case.data.respCostsReason];
        return content(ReviewAosResponse, session, { specificContent, specificValues });
      });
    });

    describe('Next step ', () => {
      it('redirects to CoRespondent response - respAdmitOrConsentToFact: Yes', () => {
        const fields = { reviewAosResponse: 'yes' };
        const session = {
          case: {
            data: {
              reasonForDivorce: 'adultery',
              reasonForDivorceAdulteryWishToName: 'Yes',
              respAdmitOrConsentToFact: 'Yes',
              coRespondentAnswers: {
                aos: {
                  received: 'Yes'
                }
              }
            }
          }
        };
        // eslint-disable-next-line max-len
        return question.redirectWithField(ReviewAosResponse, fields, ReviewAosResponseFromCoRespondent, session);
      });

      it('redirects to CoRespondent response - respAdmitOrConsentToFact: No', () => {
        const fields = { reviewAosResponse: 'yes' };
        const session = {
          case: {
            data: {
              reasonForDivorce: 'adultery',
              reasonForDivorceAdulteryWishToName: 'Yes',
              respAdmitOrConsentToFact: 'No',
              coRespondentAnswers: {
                aos: {
                  received: 'Yes'
                }
              }
            }
          }
        };
        // eslint-disable-next-line max-len
        return question.redirectWithField(ReviewAosResponse, fields, ReviewAosResponseFromCoRespondent, session);
      });

      it('redirects to AmendApplication page', () => {
        const fields = { reviewAosResponse: 'yes' };
        const session = {
          case: {
            state: 'AosCompleted',
            data: {
              reasonForDivorce: 'separation-2-years',
              respAdmitOrConsentToFact: 'No'
            }
          }
        };
        return question.redirectWithField(ReviewAosResponse, fields, AmendApplication, session);
      });

      it('redirects to ApplyForDecreeNisi page - state is not matching with AOS completed', () => {
        const fields = { reviewAosResponse: 'yes' };
        const session = {
          case: {
            state: 'AwaitingDecreeNisi',
            data: {
              reasonForDivorce: 'separation-2-years',
              respAdmitOrConsentToFact: 'No'
            }
          }
        };
        return question.redirectWithField(ReviewAosResponse, fields, ApplyForDecreeNisi, session);
      });
    });

    describe('RespAgreeToCosts is "DifferentAmount"', () => {
      describe('Respondent is Paper Based', () => {
        it('should display DifferentAmount, respCostsAmount and respCostsReason', () => {
          const session = {
            case: {
              data: {
                respAgreeToCosts: 'DifferentAmount',
                respCostsAmount: '100',
                respCostsReason: 'I want to pay 60%',
                respContactMethodIsDigital: false
              }
            }
          };

          const specificContent = [
            'costsOrder.title',
            'costsOrder.differentAmount',
            'costsOrder.respCostsAmount',
            'costsOrder.respCostsReason'
          ];

          const specificValues = [
            session.case.data.respCostsAmount,
            session.case.data.respCostsReason
          ];

          return content(ReviewAosResponse, session, { specificContent, specificValues });
        });
      });

      describe('Respondent is Online', () => {
        it('should hide DifferentAmount, respCostsAmount and respCostsReason', () => {
          const session = {
            case: {
              data: {
                respAgreeToCosts: 'DifferentAmount',
                respCostsAmount: '100',
                respCostsReason: 'I want to pay 60%',
                respContactMethodIsDigital: true
              }
            }
          };

          const specificContentToNotExist = [
            'costsOrder.differentAmount',
            'costsOrder.respCostsAmount',
            'costsOrder.respCostsReason'
          ];

          const specificValuesToNotExist = [
            session.case.data.respCostsAmount,
            session.case.data.respCostsReason
          ];

          return content(ReviewAosResponse, session, {
            specificContentToNotExist, specificValuesToNotExist
          }
          );
        });
      });
    });
  });
});
