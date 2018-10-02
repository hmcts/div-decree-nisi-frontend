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
  'steps/lived-apart-since-separation/LivedApartSinceDesertion.step'
);
const LivedApartSinceSeparation = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.step'
);
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const ccd = require('middleware/ccd');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(ccd, 'getUserData').callsFake(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
    ccd.getUserData.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(MiniPetition, [ idam.protect() ]);
  });

  describe('errors', () => {
    it('shows error if hasBeenChanges not answered', () => {
      const session = {
        originalPetition: {
          connections: {}
        }
      };
      const onlyErrors = ['requireChanges'];
      return question.testErrors(MiniPetition, session, {}, { onlyErrors });
    });

    it('shows error if hasBeenChanges is yes and not answered details or SOT', () => {
      const session = {
        originalPetition: {
          connections: {}
        }
      };
      const fields = {
        'changes-hasBeenChanges': 'yes'
      };
      const onlyErrors = ['requireStatmentOfTruth', 'requireChangeDetails'];
      return question.testErrors(MiniPetition, session, fields, { onlyErrors });
    });

    it('shows error if hasBeenChanges is no and not answered SOT', () => {
      const session = {
        originalPetition: {
          connections: {}
        }
      };
      const fields = {
        'changes-hasBeenChanges': 'no'
      };
      const onlyErrors = ['requireStatmentOfTruth'];
      return question.testErrors(MiniPetition, session, fields, { onlyErrors });
    });
  });

  describe('redirects', () => {
    it('redirects to Intolerable if answered changes yes and reasonForDivorce is adultery', () => {
      const fields = {
        'changes-hasBeenChanges': 'yes',
        'changes-changesDetails': 'details...',
        'changes-statementOfTruthChanges': 'yes'
      };
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery'
        }
      };
      return question.redirectWithField(MiniPetition, fields, Intolerable, session);
    });

    it('redirects to Intolerable if answered changes no and reasonForDivorce is adultery', () => {
      const fields = {
        'changes-hasBeenChanges': 'no',
        'changes-statementOfTruthNoChanges': 'yes'
      };
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery'
        }
      };
      return question.redirectWithField(MiniPetition, fields, Intolerable, session);
    });

    it('redirects to BehaviourContinuedSinceApplication with unreasonable-behaviour and answer yes',
      // eslint-disable-next-line max-len
      () => {
        const fields = {
          'changes-hasBeenChanges': 'yes',
          'changes-changesDetails': 'details...',
          'changes-statementOfTruthChanges': 'yes'
        };
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'unreasonable-behaviour'
          }
        };
        return question.redirectWithField(MiniPetition, fields, BehaviourContinueStep, session);
      });

    it('redirects to BehaviourContinuedSinceApplication with unreasonable-behaviour and answer no',
      // eslint-disable-next-line max-len
      () => {
        const fields = {
          'changes-hasBeenChanges': 'no',
          'changes-statementOfTruthNoChanges': 'yes'
        };
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'unreasonable-behaviour'
          }
        };
        return question.redirectWithField(MiniPetition, fields, BehaviourContinueStep, session);
      });

    it('redirects to LivedApartSinceDesertion with desertion and answer yes', () => {
      const fields = {
        'changes-hasBeenChanges': 'yes',
        'changes-changesDetails': 'details...',
        'changes-statementOfTruthChanges': 'yes'
      };
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'desertion'
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceDesertion, session);
    });

    it('redirects to LivedApartSinceDesertion with desertion and answer no', () => {
      const fields = {
        'changes-hasBeenChanges': 'no',
        'changes-statementOfTruthNoChanges': 'yes'
      };
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'desertion'
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceDesertion, session);
    });

    it('redirects to LivedApartSinceSeparation with separation-2-years and answer yes', () => {
      const fields = {
        'changes-hasBeenChanges': 'yes',
        'changes-changesDetails': 'details...',
        'changes-statementOfTruthChanges': 'yes'
      };
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'separation-2-years'
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation, session);
    });

    it('redirects to LivedApartSinceSeparation with separation-2-years and answer no', () => {
      const fields = {
        'changes-hasBeenChanges': 'no',
        'changes-statementOfTruthNoChanges': 'yes'
      };
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'separation-2-years'
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation, session);
    });

    it('redirects to LivedApartSinceSeparation with separation-5-years and answer yes', () => {
      const fields = {
        'changes-hasBeenChanges': 'yes',
        'changes-changesDetails': 'details...',
        'changes-statementOfTruthChanges': 'yes'
      };
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'separation-5-years'
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation, session);
    });

    it('redirects to LivedApartSinceSeparation with separation-5-years and answer no', () => {
      const fields = {
        'changes-hasBeenChanges': 'no',
        'changes-statementOfTruthNoChanges': 'yes'
      };
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'separation-5-years'
        }
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation, session);
    });
  });

  describe('values', () => {
    it('displays petitioner and respondent names', () => {
      const session = {
        petitionerName: 'petitioner name',
        respondentName: 'respondent name',
        originalPetition: { connections: {} }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [
            session.petitionerName,
            session.respondentName
          ]
        }
      );
    });

    it('displays coorespondent names', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryIsNamed: 'Yes',
          reasonForDivorceAdultery3rdPartyFirstName: 'corespondent firstname',
          reasonForDivorceAdultery3rdPartyLastName: 'corespondent lastname'
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [
            session.originalPetition.reasonForDivorceAdultery3rdPartyFirstName,
            session.originalPetition.reasonForDivorceAdultery3rdPartyLastName
          ]
        }
      );
    });

    it('displays place Of Marriage', () => {
      const placeOfMarriage = 'Parish of Normanton by Derby, in the County of Derby';
      const session = {
        placeOfMarriage,
        originalPetition: {
          connections: {}
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [ placeOfMarriage ] }
      );
    });

    it('displays marriage date formatted', () => {
      const session = {
        originalPetition: {
          connections: {},
          marriageDate: '2001-02-02T00:00:00.000Z'
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [ '02 February 2001' ] }
      );
    });

    it('displays legal proceedings details', () => {
      const session = {
        originalPetition: {
          connections: {},
          legalProceedings: 'Yes',
          legalProceedingsDetails: 'The legal proceeding details'
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [ session.originalPetition.legalProceedingsDetails ] }
      );
    });

    it('displays reason for divorce adultery details', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryKnowWhere: 'Yes',
          reasonForDivorceAdulteryKnowWhen: 'Yes',
          reasonForDivorceAdulteryDetails: 'Here are some adultery details',
          reasonForDivorceAdulteryWhereDetails: 'Where the adultery happened',
          reasonForDivorceAdulteryWhenDetails: 'When the adultery happened'
        }
      };
      return content(
        MiniPetition,
        session,
        {
          specificValues: [
            session.originalPetition.reasonForDivorceAdulteryDetails,
            session.originalPetition.reasonForDivorceAdulteryWhereDetails,
            session.originalPetition.reasonForDivorceAdulteryWhenDetails
          ]
        }
      );
    });

    it('displays reason for divorce unreasonable behaviour details', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'unreasonable-behaviour',
          reasonForDivorceBehaviourDetails: [ 'My wife is lazy' ]
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [ session.originalPetition.reasonForDivorceBehaviourDetails ] }
      );
    });

    it('displays reason for divorce desertion details', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'desertion',
          reasonForDivorceDesertionDetails: 'I was deserted'
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [ session.originalPetition.reasonForDivorceDesertionDetails ] }
      );
    });
  });

  describe('content', () => {
    it('all', () => {
      const session = {
        originalPetition: {
          connections: {}
        }
      };
      const ignoreContent = [
        'coRespondentsCorrespondenceAddress',
        'coRespondent',
        'reasonForDivorceAdulteryCorrespondentNamed',
        'reasonForDivorceAdulteryCorrespondentNotNamed',
        'reasonForDivorceAdulteryWhere',
        'reasonForDivorceAdulteryWhen',
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
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrderFor: 'Yes',
            divorceClaimFrom: ['respondent', 'correspondent']
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
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrderFor: 'Yes',
            divorceClaimFrom: ['correspondent']
          }
        };
        return content(MiniPetition, session, {
          specificContent: ['costsPetitionerPayedByCorrispondent']
        });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrderFor: 'Yes',
            divorceClaimFrom: []
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'costsPetitionerPayedByRespondent' ] });
      });
    });

    context('claim costs only', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrderFor: 'No',
            divorceClaimFrom: ['respondent', 'correspondent']
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsdByRespondentAndCorespondent'] }
        );
      });
      it('from co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrderFor: 'No',
            divorceClaimFrom: ['correspondent']
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsdByCorespondent' ] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrderFor: 'No',
            divorceClaimFrom: []
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsdByRespondent' ] });
      });
    });

    it('financialOrderFor only from neither respondent or co-respondent', () => {
      const session = {
        originalPetition: {
          connections: {},
          claimsCosts: 'No',
          financialOrderFor: 'Yes',
          divorceClaimFrom: []
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: [ 'costsPetitionerDivorceCostsdByFinantialOrder' ] });
    });

    it('not claiming costs or applying for financial Order', () => {
      const session = {
        originalPetition: {
          connections: {},
          claimsCosts: 'No',
          financialOrderFor: 'No',
          divorceClaimFrom: []
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: [ 'costsPetitionerDivorceNoCosts' ] });
    });

    it('shows details for co-respondent', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryIsNamed: 'Yes',
          reasonForDivorceAdultery3rdPartyFirstName: 'first name',
          reasonForDivorceAdultery3rdPartyLastName: 'last name'
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: [ 'coRespondent' ] });
    });

    it('shows name for co-respondent', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryIsNamed: 'Yes',
          reasonForDivorceAdultery3rdPartyFirstName: 'first name',
          reasonForDivorceAdultery3rdPartyLastName: 'last name'
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: [ 'coRespondent' ] });
    });

    context('jurisdiction', () => {
      it('for both resident', () => {
        const session = {
          originalPetition: {
            connections: { A: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'jurisdictionConnectionBothResident' ] });
      });
      it('for one resides', () => {
        const session = {
          originalPetition: {
            connections: { B: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'jurisdictionConnectionOneResides' ] });
      });
      it('respondent', () => {
        const session = {
          originalPetition: {
            connections: { C: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'jurisdictionConnectionRespondent' ] });
      });
      it('petitioner', () => {
        const session = {
          originalPetition: {
            connections: { D: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'jurisdictionConnectionPetitioner' ] });
      });
      it('petitioner six months', () => {
        const session = {
          originalPetition: {
            connections: { E: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'jurisdictionConnectionPetitionerSixMonths' ] });
      });
      it('both domiciled', () => {
        const session = {
          originalPetition: {
            connections: { F: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'jurisdictionConnectionBothDomiciled' ] });
      });
      it('both domiciled', () => {
        const session = {
          originalPetition: {
            connections: { G: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'jurisdictionConnectionOther' ] });
      });
    });

    context('legal proceedings', () => {
      it('no', () => {
        const session = {
          originalPetition: {
            connections: {},
            legalProceedings: 'No'
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'onGoingCasesNo' ] });
      });
      it('Yes', () => {
        const session = {
          originalPetition: {
            connections: {},
            legalProceedings: 'Yes'
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'onGoingCasesYes' ] });
      });
    });

    context('reasons for divorce', () => {
      context('adultery', () => {
        it('base content', () => {
          const session = {
            originalPetition: {
              connections: {},
              reasonForDivorce: 'adultery'
            }
          };
          return content(
            MiniPetition,
            session,
            { specificContent: [ 'reasonForDivorceAdultery' ] });
        });
        it('co-respondent is named', () => {
          const session = {
            originalPetition: {
              connections: {},
              reasonForDivorce: 'adultery',
              reasonForDivorceAdulteryIsNamed: 'Yes'
            }
          };
          return content(
            MiniPetition,
            session,
            { specificContent: [ 'reasonForDivorceAdultery' ] });
        });
        it('knows where', () => {
          const session = {
            originalPetition: {
              connections: {},
              reasonForDivorce: 'adultery',
              reasonForDivorceAdulteryKnowWhere: 'Yes'
            }
          };
          return content(
            MiniPetition,
            session,
            { specificContent: [ 'reasonForDivorceAdulteryWhere' ] });
        });
        it('knows when', () => {
          const session = {
            originalPetition: {
              connections: {},
              reasonForDivorce: 'adultery',
              reasonForDivorceAdulteryKnowWhen: 'Yes'
            }
          };
          return content(
            MiniPetition,
            session,
            { specificContent: [ 'reasonForDivorceAdulteryWhen' ] });
        });
      });

      it('unreasonable behaviour', () => {
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'unreasonable-behaviour'
          }
        };
        const specificContent = [
          'reasonForDivorceUnreasonableBehaviourBrokenDown',
          'reasonForDivorceUnreasonableBehaviourStatment',
          'reasonForDivorceUnreasonableBehaviourDescription',
          'reasonForDivorceBehaviourDetails'
        ];
        return content(MiniPetition, session, { specificContent });
      });

      it('separation 2 years', () => {
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'separation-2-years'
          }
        };
        const specificContent = [
          'reasonForDivorceSeperationTwoYearsBrokendDown',
          'reasonForDivorceSeperationTwoYears'
        ];
        return content(MiniPetition, session, { specificContent });
      });

      it('separation 5 years', () => {
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'separation-5-years'
          }
        };
        const specificContent = [
          'reasonForDivorceSeperationFiveYearsBrokendDown',
          'reasonForDivorceSeperationFiveYears'
        ];
        return content(MiniPetition, session, { specificContent });
      });

      it('desertion', () => {
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'desertion'
          }
        };
        const specificContent = [
          'reasonForDivorceDesertionBrokendDown',
          'reasonForDivorceDesertion',
          'reasonForDivorceDesertionStatment'
        ];
        return content(MiniPetition, session, { specificContent });
      });
    });

    context('cost orders', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            divorceClaimFrom: ['respondent', 'correspondent']
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'claimingCostsFromRespondentCoRespondent' ] });
      });
      it('from co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            divorceClaimFrom: ['correspondent']
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'claimingCostsFromCoRespondent' ] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            divorceClaimFrom: []
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'claimingCostsFromRespondent' ] });
      });

      it('not claiming', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'No',
            divorceClaimFrom: []
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'notClaimingForDivorce' ] });
      });
    });

    context('finantial orders', () => {
      it('for children and petitioner', () => {
        const session = {
          originalPetition: {
            connections: {},
            financialOrder: 'Yes',
            financialOrderFor: ['children', 'petitioner']
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'financialOrdersPropertyMoneyPensionsChildren' ] }
        );
      });
      it('for children', () => {
        const session = {
          originalPetition: {
            connections: {},
            financialOrder: 'Yes',
            financialOrderFor: ['children']
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'financialOrdersChildren' ] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            financialOrder: 'Yes',
            financialOrderFor: []
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'financialOrdersPropertyMoneyPensions' ] });
      });

      it('not claiming', () => {
        const session = {
          originalPetition: {
            connections: {},
            financialOrder: 'No',
            divorceClaimFrom: []
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'financialOrdersNone' ] });
      });
    });

    it('Petitioner Address if not confidential', () => {
      const session = {
        originalPetition: {
          connections: {},
          petitionerContactDetailsConfidential: 'share'
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: [ 'applicantsCorrespondenceAddress' ] });
    });


    it('CoRespondent Address', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorceAdultery3rdAddress: ['line1', 'line2', 'postcode']
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: [ 'coRespondentsCorrespondenceAddress' ] });
    });
  });

  describe('answers', () => {
    it('shows correct answers if user changes detals', () => {
      const expectedContent = [
        MiniPetitionContent.en.fields.changes.hasBeenChanges.title,
        MiniPetitionContent.en.fields.changes.hasBeenChanges.yes,
        MiniPetitionContent.en.fields.changes.changesDetails.title,
        'details...',
        MiniPetitionContent.en.fields.changes.statementOfTruthChanges.title,
        MiniPetitionContent.en.fields.changes.statementOfTruthChanges.yes
      ];
      const stepData = {
        changes: {
          hasBeenChanges: 'yes',
          changesDetails: 'details...',
          statementOfTruthChanges: 'yes'
        }
      };
      const session = {
        originalPetition: {
          connections: {}
        }
      };
      return question.answers(MiniPetition, stepData, expectedContent, session);
    });
    it('shows correct answers if user has no changes', () => {
      const expectedContent = [
        MiniPetitionContent.en.fields.changes.hasBeenChanges.title,
        MiniPetitionContent.en.fields.changes.hasBeenChanges.no,
        MiniPetitionContent.en.fields.changes.statementOfTruthNoChanges.title,
        MiniPetitionContent.en.fields.changes.statementOfTruthNoChanges.yes
      ];
      const stepData = {
        changes: {
          hasBeenChanges: 'no',
          statementOfTruthNoChanges: 'yes'
        }
      };
      const session = {
        originalPetition: {
          connections: {}
        }
      };
      return question.answers(MiniPetition, stepData, expectedContent, session);
    });
  });
});
