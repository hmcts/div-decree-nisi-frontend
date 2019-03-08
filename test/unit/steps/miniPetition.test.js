/* eslint max-lines: 0 */
const modulePath = 'steps/mini-petition/MiniPetition.step';

const MiniPetition = require(modulePath);
const MiniPetitionContent = require('steps/mini-petition/MiniPetition.content');
const Intolerable = require(
  'steps/intolerable/Intolerable.step'
);
const BehaviourContinueStep = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step'
);
const LivedApartSinceDesertion = require(
  'steps/lived-apart-since-desertion/LivedApartSinceDesertion.step'
);
const LivedApartSinceSeparation = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.step'
);
const idam = require('services/idam');

const feesAndPaymentsService = require('services/feesAndPaymentsService');
const { feeTypes } = require('middleware/feesAndPaymentsMiddleware');
const config = require('config');
const { middleware, question, sinon,
  content, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
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
    feesAndPaymentsService.getFee.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(MiniPetition, [idam.protect()]);
  });


  it('getFeeFromFeesAndPayments middleware call', () => { // eslint-disable-line max-len
    const session = {
      case: {
        data: {
          connections: {}
        }
      }
    };
    return content(
      MiniPetition,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledWith(feesAndPaymentsService.getFee, feeTypes.issueFee);
      sinon.assert.calledWith(feesAndPaymentsService.getFee, feeTypes.amendFee);
      sinon.assert.calledWith(feesAndPaymentsService.getFee, feeTypes.appFinancialOrderFee);
    });
  });

  describe('errors', () => {
    it('shows error if hasBeenChanges not answered', () => {
      const session = {
        case: {
          data: {
            connections: {}
          }
        }
      };
      const onlyErrors = ['requireChanges'];
      return question.testErrors(MiniPetition, session, {}, { onlyErrors });
    });

    it('shows error if hasBeenChanges is yes and not answered details or SOT', () => {
      const session = {
        case: {
          data: {
            connections: {}
          }
        }
      };
      const fields = {
        'changes.hasBeenChanges': 'yes'
      };
      const onlyErrors = ['requireStatmentOfTruth', 'requireChangeDetails'];
      return question.testErrors(MiniPetition, session, fields, { onlyErrors });
    });

    it('shows error if hasBeenChanges is no and not answered SOT', () => {
      const session = {
        case: {
          data: {
            connections: {}
          }
        }
      };
      const fields = {
        'changes.hasBeenChanges': 'no'
      };
      const onlyErrors = ['requireStatmentOfTruth'];
      return question.testErrors(MiniPetition, session, fields, { onlyErrors });
    });
  });

  describe('redirects', () => {
    it('redirects to Intolerable if answered changes yes and reasonForDivorce is adultery', () => {
      const fields = {
        'changes.hasBeenChanges': 'yes',
        'changes.changesDetails': 'details...',
        'changes.statementOfTruthChanges': 'yes'
      };
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'adultery'
          }
        }
      };
      return question.redirectWithField(MiniPetition, fields, Intolerable, session);
    });

    it('redirects to Intolerable if answered changes no and reasonForDivorce is adultery', () => {
      const fields = {
        'changes.hasBeenChanges': 'no',
        'changes.statementOfTruthNoChanges': 'yes'
      };
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'adultery'
          }
        }
      };
      return question.redirectWithField(MiniPetition, fields, Intolerable, session);
    });

    it('redirects to BehaviourContinuedSinceApplication with unreasonable-behaviour and answer yes',
      // eslint-disable-next-line max-len
      () => {
        const fields = {
          'changes.hasBeenChanges': 'yes',
          'changes.changesDetails': 'details...',
          'changes.statementOfTruthChanges': 'yes'
        };
        const session = {
          case: {
            data: {
              connections: {},
              reasonForDivorce: 'unreasonable-behaviour'
            }
          }
        };
        return question.redirectWithField(MiniPetition, fields, BehaviourContinueStep, session);
      });

    it('redirects to BehaviourContinuedSinceApplication with unreasonable-behaviour and answer no',
      // eslint-disable-next-line max-len
      () => {
        const fields = {
          'changes.hasBeenChanges': 'no',
          'changes.statementOfTruthNoChanges': 'yes'
        };
        const session = {
          case: {
            data: {
              connections: {},
              reasonForDivorce: 'unreasonable-behaviour'
            }
          }
        };
        return question.redirectWithField(MiniPetition, fields, BehaviourContinueStep, session);
      });

    it('redirects to LivedApartSinceDesertion with desertion and answer yes', () => {
      const fields = {
        'changes.hasBeenChanges': 'yes',
        'changes.changesDetails': 'details...',
        'changes.statementOfTruthChanges': 'yes'
      };
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'desertion'
          }
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceDesertion, session);
    });

    it('redirects to LivedApartSinceDesertion with desertion and answer no', () => {
      const fields = {
        'changes.hasBeenChanges': 'no',
        'changes.statementOfTruthNoChanges': 'yes'
      };
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'desertion'
          }
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceDesertion, session);
    });

    it('redirects to LivedApartSinceSeparation with separation-2-years and answer yes', () => {
      const fields = {
        'changes.hasBeenChanges': 'yes',
        'changes.changesDetails': 'details...',
        'changes.statementOfTruthChanges': 'yes'
      };
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'separation-2-years'
          }
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation, session);
    });

    it('redirects to LivedApartSinceSeparation with separation-2-years and answer no', () => {
      const fields = {
        'changes.hasBeenChanges': 'no',
        'changes.statementOfTruthNoChanges': 'yes'
      };
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'separation-2-years'
          }
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation, session);
    });

    it('redirects to LivedApartSinceSeparation with separation-5-years and answer yes', () => {
      const fields = {
        'changes.hasBeenChanges': 'yes',
        'changes.changesDetails': 'details...',
        'changes.statementOfTruthChanges': 'yes'
      };
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'separation-5-years'
          }
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation, session);
    });

    it('redirects to LivedApartSinceSeparation with separation-5-years and answer no', () => {
      const fields = {
        'changes.hasBeenChanges': 'no',
        'changes.statementOfTruthNoChanges': 'yes'
      };
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'separation-5-years'
          }
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation, session);
    });
  });

  describe('values', () => {
    it('displays issue date', () => {
      const session = {
        case: {
          data: {
            issueDate: '2006-02-02T00:00:00.000+0000',
            connections: {}
          }
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: ['02 February 2006']
        }
      );
    });
    it('displays case number', () => {
      const session = {
        case: {
          data: {
            connections: {},
            caseReference: 'TESTD80101'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [session.case.data.caseReference]
        }
      );
    });
    it('displays petitioner and respondent names', () => {
      const session = {
        case: {
          data: {
            connections: {},
            petitionerFirstName: 'petitioner',
            petitionerLastName: 'name',
            respondentFirstName: 'respondent',
            respondentLastName: 'name'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [
            session.case.data.petitionerFirstName,
            session.case.data.petitionerLastName,
            session.case.data.respondentFirstName,
            session.case.data.respondentLastName
          ]
        }
      );
    });

    it('displays coorespondent names', () => {
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'adultery',
            reasonForDivorceAdulteryIsNamed: 'Yes',
            reasonForDivorceAdultery3rdPartyFirstName: 'corespondent firstname',
            reasonForDivorceAdultery3rdPartyLastName: 'corespondent lastname'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [
            session.case.reasonForDivorceAdultery3rdPartyFirstName,
            session.case.reasonForDivorceAdultery3rdPartyLastName
          ]
        }
      );
    });

    it('displays place Of Marriage', () => {
      const placeOfMarriage = 'Parish of Normanton by Derby, in the County of Derby';
      const session = {
        case: {
          data: {
            placeOfMarriage,
            connections: {}
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [placeOfMarriage] }
      );
    });

    it('displays marriage date formatted', () => {
      const session = {
        case: {
          data: {
            connections: {},
            marriageDate: '2001-02-02T00:00:00.000Z'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: ['02 February 2001'] }
      );
    });

    it('displays legal proceedings details', () => {
      const session = {
        case: {
          data: {
            connections: {},
            legalProceedings: 'Yes',
            legalProceedingsDetails: 'The legal proceeding details'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [session.case.legalProceedingsDetails] }
      );
    });

    it('displays reason for divorce adultery details', () => {
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'adultery',
            reasonForDivorceAdulteryKnowWhere: 'Yes',
            reasonForDivorceAdulteryKnowWhen: 'Yes',
            reasonForDivorceAdulteryDetails: 'Here are some adultery details',
            reasonForDivorceAdulteryWhereDetails: 'Where the adultery happened',
            reasonForDivorceAdulteryWhenDetails: 'When the adultery happened'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [
            session.case.reasonForDivorceAdulteryDetails,
            session.case.reasonForDivorceAdulteryWhereDetails,
            session.case.reasonForDivorceAdulteryWhenDetails
          ]
        }
      );
    });

    it('displays reason for divorce unreasonable behaviour details', () => {
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'unreasonable-behaviour',
            reasonForDivorceBehaviourDetails: ['My wife is lazy']
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [session.case.reasonForDivorceBehaviourDetails] }
      );
    });

    it('displays reason for divorce desertion details', () => {
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'desertion',
            reasonForDivorceDesertionDetails: 'I was deserted'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [session.case.reasonForDivorceDesertionDetails] }
      );
    });
  });

  describe('content', () => {
    it('all', () => {
      const session = {
        case: {
          data: {
            connections: {}
          }
        }
      };
      const ignoreContent = [
        'coRespondentsCorrespondenceAddress',
        'coRespondent',
        'reasonForDivorceAdulteryCorrespondentNamed',
        'reasonForDivorceAdulteryCorrespondentNotNamed',
        'reasonForDivorceAdulteryWhere',
        'reasonForDivorceAdulteryWhen',
        'reasonForDivorceAdulteryDescription',
        'reasonForDivorceInfo',
        'reasonForDivorceStatement',
        'reasonForDivorceSeperationTwoYearsDecidedDate',
        'reasonForDivorceSeperationTwoYearsLivingApartDate',
        'mostRecentDateIsSeperation',
        'reasonForDivorceSeperationFiveYearsInfo',
        'reasonForDivorceBehaviourBrokendDown',
        'reasonForDivorceDesertionInfo',
        'reasonForDivorceDesertionAgreed',
        'reasonForDivorceDesertionDescription',
        'reasonForDivorceUnreasonableBehaviourBrokenDown',
        'reasonForDivorceUnreasonableBehaviourStatment',
        'reasonForDivorceUnreasonableBehaviourDescription',
        'reasonForDivorceSeperationTwoYears',
        'reasonForDivorceSeperationTwoYearsBrokendDown',
        'reasonForDivorceSeperationFiveYears',
        'reasonForDivorceSeperationFiveYearsBrokendDown',
        'reasonForDivorceDesertion',
        'reasonForDivorceDesertionBrokendDown',
        'reasonForDivorceDesertionStatment',
        'claimingCostsFromRespondentCoRespondent',
        'claimingCostsFromCoRespondent',
        'claimingCostsFromRespondent',
        'financialOrdersPropertyMoneyPensionsChildren',
        'financialOrdersChildren',
        'financialOrdersPropertyMoneyPensions',
        'applicantsCorrespondenceAddress',
        'costsPetitionerPayedByRespondentAndCorrispondent',
        'costsPetitionerPayedByCorrespondent',
        'costsPetitionerPayedByRespondent',
        'costsPetitionerDivorceCostsdByRespondentAndCorespondent',
        'costsPetitionerDivorceCostsdByCorespondent',
        'costsPetitionerDivorceCostsdByRespondent',
        'costsPetitionerDivorceCostsdByFinantialOrder',
        'jurisdictionConnectionBothResident',
        'jurisdictionConnectionBothDomiciled',
        'jurisdictionConnectionOneResides',
        'jurisdictionConnectionPetitioner',
        'jurisdictionConnectionRespondent',
        'jurisdictionConnectionPetitionerSixMonths',
        'jurisdictionConnectionOther',
        'onGoingCasesNo'
      ];
      return content(MiniPetition, session, { ignoreContent });
    });

    context('intro text - claim costs & financial order', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'Yes',
              claimsCostsFrom: ['respondent', 'correspondent']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['costsPetitionerPayedByRespondentAndCorrispondent'] }
        );
      });
      it('from co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'Yes',
              claimsCostsFrom: ['correspondent']
            }
          }
        };
        return content(MiniPetition, session, {
          specificContent: ['costsPetitionerPayedByCorrespondent']
        });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'Yes',
              claimsCostsFrom: []
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['costsPetitionerPayedByRespondent'] });
      });
    });

    context('claim costs only', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'No',
              claimsCostsFrom: ['respondent', 'correspondent']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['costsPetitionerDivorceCostsdByRespondentAndCorespondent'] }
        );
      });
      it('from co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'No',
              claimsCostsFrom: ['correspondent']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['costsPetitionerDivorceCostsdByCorespondent'] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'No',
              claimsCostsFrom: []
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['costsPetitionerDivorceCostsdByRespondent'] });
      });
    });

    it('financialOrderFor only from neither respondent or co-respondent', () => {
      const session = {
        case: {
          data: {
            connections: {},
            claimsCosts: 'No',
            financialOrderFor: 'Yes',
            claimsCostsFrom: []
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: ['costsPetitionerDivorceCostsdByFinantialOrder'] });
    });

    it('not claiming costs or applying for financial Order', () => {
      const session = {
        case: {
          data: {
            connections: {},
            claimsCosts: 'No',
            financialOrderFor: 'No',
            claimsCostsFrom: []
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: ['costsPetitionerDivorceNoCosts'] });
    });

    it('shows details for co-respondent', () => {
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'adultery',
            reasonForDivorceAdulteryIsNamed: 'Yes',
            reasonForDivorceAdultery3rdPartyFirstName: 'first name',
            reasonForDivorceAdultery3rdPartyLastName: 'last name'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: ['coRespondent'] });
    });

    it('shows name for co-respondent', () => {
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorce: 'adultery',
            reasonForDivorceAdulteryIsNamed: 'Yes',
            reasonForDivorceAdultery3rdPartyFirstName: 'first name',
            reasonForDivorceAdultery3rdPartyLastName: 'last name'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: ['coRespondent'] });
    });

    context('jurisdiction', () => {
      it('for both resident', () => {
        const session = {
          case: {
            data: {
              connections: { A: '' },
              reasonForDivorce: 'adultery'
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['jurisdictionConnectionBothResident'] });
      });
      it('for one resides', () => {
        const session = {
          case: {
            data: {
              connections: { B: '' },
              reasonForDivorce: 'adultery'
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['jurisdictionConnectionOneResides'] });
      });
      it('respondent', () => {
        const session = {
          case: {
            data: {
              connections: { C: '' },
              reasonForDivorce: 'adultery'
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['jurisdictionConnectionRespondent'] });
      });
      it('petitioner', () => {
        const session = {
          case: {
            data: {
              connections: { D: '' },
              reasonForDivorce: 'adultery'
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['jurisdictionConnectionPetitioner'] });
      });
      it('petitioner six months', () => {
        const session = {
          case: {
            data: {
              connections: { E: '' },
              reasonForDivorce: 'adultery'
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['jurisdictionConnectionPetitionerSixMonths'] });
      });
      it('both domiciled', () => {
        const session = {
          case: {
            data: {
              connections: { F: '' },
              reasonForDivorce: 'adultery'
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['jurisdictionConnectionBothDomiciled'] });
      });
      it('both domiciled', () => {
        const session = {
          case: {
            data: {
              connections: { G: '' },
              reasonForDivorce: 'adultery'
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['jurisdictionConnectionOther'] });
      });
    });

    context('legal proceedings', () => {
      it('no', () => {
        const session = {
          case: {
            data: {
              connections: {},
              legalProceedings: 'No'
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['onGoingCasesNo'] });
      });
      it('Yes', () => {
        const session = {
          case: {
            data: {
              connections: {},
              legalProceedings: 'Yes'
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['onGoingCasesYes'] });
      });
    });

    context('reasons for divorce', () => {
      context('adultery', () => {
        it('knows where', () => {
          const session = {
            case: {
              data: {
                connections: {},
                reasonForDivorce: 'adultery',
                reasonForDivorceAdulteryKnowWhere: 'Yes'
              }
            }
          };
          return content(
            MiniPetition,
            session,
            { specificContent: [
              'reasonForDivorceAdulteryWhere',
              'reasonForDivorceStatement',
              'reasonForDivorceAdulteryDescription'
            ] });
        });
        it('knows when', () => {
          const session = {
            case: {
              data: {
                connections: {},
                reasonForDivorce: 'adultery',
                reasonForDivorceAdulteryKnowWhen: 'Yes'
              }
            }
          };
          return content(
            MiniPetition,
            session,
            { specificContent: [
              'reasonForDivorceAdulteryWhen',
              'reasonForDivorceStatement',
              'reasonForDivorceAdulteryDescription'
            ] });
        });
      });

      it('unreasonable behaviour', () => {
        const session = {
          case: {
            data: {
              connections: {},
              reasonForDivorce: 'unreasonable-behaviour'
            }
          }
        };
        const specificContent = [
          'reasonForDivorceUnreasonableBehaviourBrokenDown',
          'reasonForDivorceUnreasonableBehaviourStatment',
          'reasonForDivorceUnreasonableBehaviourDescription',
          'reasonForDivorceBehaviourBrokendDown'
        ];
        return content(MiniPetition, session, { specificContent });
      });

      it('separation 2 years', () => {
        const session = {
          case: {
            data: {
              connections: {},
              reasonForDivorce: 'separation-2-years'
            }
          }
        };
        const specificContent = [
          'reasonForDivorceSeperationTwoYearsBrokendDown',
          'reasonForDivorceSeperationTwoYears',
          'reasonForDivorceSeperationTwoYearsDecidedDate',
          'reasonForDivorceSeperationTwoYearsLivingApartDate',
          'mostRecentDateIsSeperation'
        ];
        return content(MiniPetition, session, { specificContent });
      });

      it('separation 5 years', () => {
        const session = {
          case: {
            data: {
              connections: {},
              reasonForDivorce: 'separation-5-years',
              reasonForDivorceSeperationDate: '02 November 2014'
            }
          }
        };
        const specificContent = [
          'reasonForDivorceSeperationFiveYearsBrokendDown',
          'reasonForDivorceSeperationFiveYearsInfo'
        ];
        const specificValues = [session.case.data.reasonForDivorceSeperationDate];
        return content(MiniPetition, session, { specificContent, specificValues });
      });

      it('separation 5 years', () => {
        const session = {
          case: {
            data: {
              connections: {},
              reasonForDivorce: 'separation-5-years',
              reasonForDivorceDecisionDate: '03 November 2014',
              reasonForDivorceLivingApartDate: '06 November 2014'
            }
          }
        };
        const specificContent = [
          'reasonForDivorceSeperationFiveYearsBrokendDown',
          'reasonForDivorceSeperationFiveYears.decidedDate',
          'reasonForDivorceSeperationFiveYears.livingApartDate',
          'reasonForDivorceSeperationFiveYears.mostRecentDateConsidered'
        ];
        const specificValues = [
          session.case.data.reasonForDivorceDecisionDate,
          session.case.data.reasonForDivorceLivingApartDate
        ];
        return content(MiniPetition, session, { specificContent, specificValues });
      });

      it('desertion', () => {
        const session = {
          case: {
            data: {
              connections: {},
              reasonForDivorce: 'desertion',
              reasonForDivorceDesertionAgreed: 'Yes'
            }
          }
        };
        const specificContent = [
          'reasonForDivorceDesertionBrokendDown',
          'reasonForDivorceDesertion',
          'reasonForDivorceDesertionAgreed',
          'reasonForDivorceDesertionStatment',
          'reasonForDivorceDesertionInfo',
          'reasonForDivorceDesertionDescription'
        ];
        return content(MiniPetition, session, { specificContent });
      });
    });

    context('cost orders', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              claimsCostsFrom: ['respondent', 'correspondent']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['claimingCostsFromRespondentCoRespondent'] });
      });
      it('from co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              claimsCostsFrom: ['correspondent']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['claimingCostsFromCoRespondent'] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              claimsCostsFrom: []
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['claimingCostsFromRespondent'] });
      });

      it('not claiming', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'No',
              claimsCostsFrom: []
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['notClaimingForDivorce'] });
      });
    });

    context('finantial orders', () => {
      it('for children and petitioner', () => {
        const session = {
          case: {
            data: {
              connections: {},
              financialOrder: 'Yes',
              financialOrderFor: ['children', 'petitioner']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['financialOrdersPropertyMoneyPensionsChildren'] }
        );
      });
      it('for children', () => {
        const session = {
          case: {
            data: {
              connections: {},
              financialOrder: 'Yes',
              financialOrderFor: ['children']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['financialOrdersChildren'] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              financialOrder: 'Yes',
              financialOrderFor: []
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['financialOrdersPropertyMoneyPensions'] });
      });

      it('not claiming', () => {
        const session = {
          case: {
            data: {
              connections: {},
              financialOrder: 'No',
              claimsCostsFrom: []
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: ['financialOrdersNone'] });
      });
    });

    it('Petitioner Address if not confidential', () => {
      const session = {
        case: {
          data: {
            connections: {},
            petitionerContactDetailsConfidential: 'share'
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: ['applicantsCorrespondenceAddress'] });
    });


    it('CoRespondent Address', () => {
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorceAdultery3rdAddress: {
              address: 'line2, line2, line3'
            }
          }
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [session.case.data.reasonForDivorceAdultery3rdAddress.address]
        });
    });

    it('shows petitioners solicitors address if allowed and available', () => {
      const petitionersSolicitorName = 'Pet Solicitor';
      const petitionersSolicitorFirm = 'Pet Solicitors Firm';
      const petitionersSolicitorAddress = 'Pet Solicitors Address';
      const session = {
        case: {
          data: {
            connections: {},
            petitionerContactDetailsConfidential: 'share',
            petitionersSolicitorName,
            petitionersSolicitorFirm,
            petitionersSolicitorAddress
          }
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [
            petitionersSolicitorName,
            petitionersSolicitorFirm,
            petitionersSolicitorAddress
          ]
        });
    });

    it('shows respondent solicitors address if available', () => {
      const respondentSolicitorName = 'Res Solicitor';
      const respondentSolicitorCompany = 'Res Solicitors Firm';
      const respondentSolicitorAddress = {
        address: 'Res Solicitors Address'
      };
      const session = {
        case: {
          data: {
            connections: {},
            respondentSolicitorName,
            respondentSolicitorCompany,
            respondentSolicitorAddress
          }
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [
            respondentSolicitorName,
            respondentSolicitorCompany,
            respondentSolicitorAddress.address
          ]
        });
    });

    it('shows respondent address if available', () => {
      const respondentCorrespondenceAddress = {
        address: 'Respondents Address'
      };
      const session = {
        case: {
          data: {
            connections: {},
            respondentCorrespondenceAddress
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [respondentCorrespondenceAddress.address] });
    });
  });


  describe('Returns correct values()', () => {
    it('hasBeenChanges : yes ', () => {
      const changesDetailsVal = 'details...';
      const fields = {
        changes: {
          hasBeenChanges: 'yes',
          changesDetails: changesDetailsVal,
          statementOfTruthNoChanges: 'yes',
          statementOfTruthChanges: 'yes'
        }
      };
      const req = {
        journey: {},
        session: { MiniPetition: fields }
      };

      const res = {};
      const step = new MiniPetition(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.statementOfTruthChanges', 'yes');
      expect(_values).to.have.property('changes.changesDetails', changesDetailsVal);
      expect(_values).to.not.have.property('changes.statementOfTruthNoChanges');
    });

    it('hasBeenChanges : no ', () => {
      const changesDetailsVal = 'Details given';
      const fields = {
        changes: {
          hasBeenChanges: 'no',
          changesDetails: changesDetailsVal,
          statementOfTruthNoChanges: 'yes',
          statementOfTruthChanges: 'yes'
        }
      };
      const req = {
        journey: {},
        session: { MiniPetition: fields }
      };

      const res = {};
      const step = new MiniPetition(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.have.property('changes.statementOfTruthNoChanges', 'yes');
      expect(_values).to.not.have.property('changes.changesDetails');
      expect(_values).to.not.have.property('changes.statementOfTruthChanges');
    });
  });

  describe('answers', () => {
    const sandbox = sinon.createSandbox();

    before(() => {
      sandbox.replace(config.features, 'release520', false);
    });

    after(() => {
      sandbox.restore();
    });

    it('shows correct answers if user changes details', () => {
      const expectedContent = [
        MiniPetitionContent.en.fields.changes.hasBeenChanges.title,
        MiniPetitionContent.en.fields.changes.hasBeenChanges.yes,
        MiniPetitionContent.en.fields.changes.changesDetails.title,
        'details...'
      ];
      const stepData = {
        changes: {
          hasBeenChanges: 'yes',
          changesDetails: 'details...',
          statementOfTruthChanges: 'yes'
        }
      };
      const session = {
        case: {
          data: {
            connections: {}
          }
        }
      };
      return question.answers(MiniPetition, stepData, expectedContent, session);
    });
    it('shows correct answers if user has no changes', () => {
      const expectedContent = [
        MiniPetitionContent.en.fields.changes.hasBeenChanges.title,
        MiniPetitionContent.en.fields.changes.hasBeenChanges.no
      ];
      const stepData = {
        changes: {
          hasBeenChanges: 'no',
          statementOfTruthNoChanges: 'yes'
        }
      };
      const session = {
        case: {
          data: {
            connections: {}
          }
        }
      };
      return question.answers(MiniPetition, stepData, expectedContent, session);
    });
  });
});
