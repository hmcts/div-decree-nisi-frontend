/* eslint max-lines: 0 */
const modulePath = 'steps/mini-petition/MiniPetition.step';

const MiniPetition = require(modulePath);
const MiniPetitionContent = require('steps/mini-petition/MiniPetition.content');
const LivedApartSinceSeparation = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.step'
);
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(MiniPetition, [ idam.protect() ]);
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
        'changes-hasBeenChanges': 'yes'
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
        'changes-hasBeenChanges': 'no'
      };
      const onlyErrors = ['requireStatmentOfTruth'];
      return question.testErrors(MiniPetition, session, fields, { onlyErrors });
    });
  });

  describe('redirects', () => {
    it('redirects to LivedApartSinceSeparation if answered changes yes', () => {
      const fields = {
        'changes-hasBeenChanges': 'yes',
        'changes-changesDetails': 'details...',
        'changes-statementOfTruthChanges': 'yes'
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation);
    });

    it('redirects to LivedApartSinceSeparation if answered changes no', () => {
      const fields = {
        'changes-hasBeenChanges': 'no',
        'changes-statementOfTruthNoChanges': 'yes'
      };
      return question.redirectWithField(MiniPetition, fields, LivedApartSinceSeparation);
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
        { specificValues: [ placeOfMarriage ] }
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
        { specificValues: [ '02 February 2001' ] }
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
        { specificValues: [ session.case.legalProceedingsDetails ] }
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
            reasonForDivorceBehaviourDetails: [ 'My wife is lazy' ]
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificValues: [ session.case.reasonForDivorceBehaviourDetails ] }
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
        { specificValues: [ session.case.reasonForDivorceDesertionDetails ] }
      );
    });
  });

  describe('content', () => {
    it('all', () => {
      const session = {
        case: { data: { connections: {} } }
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

    context('intro text - claim costs & finantial order', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'Yes',
              divorceClaimFrom: ['respondent', 'correspondent']
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
              divorceClaimFrom: ['correspondent']
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
              divorceClaimFrom: []
            }
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
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'No',
              divorceClaimFrom: ['respondent', 'correspondent']
            }
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
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'No',
              divorceClaimFrom: ['correspondent']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsdByCorespondent' ] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              financialOrderFor: 'No',
              divorceClaimFrom: []
            }
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
        case: {
          data: {
            connections: {},
            claimsCosts: 'No',
            financialOrderFor: 'Yes',
            divorceClaimFrom: []
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: [ 'costsPetitionerDivorceCostsdByFinantialOrder' ] });
    });

    it('not claiming costs or applying for financial Order', () => {
      const session = {
        case: {
          data: {
            connections: {},
            claimsCosts: 'No',
            financialOrderFor: 'No',
            divorceClaimFrom: []
          }
        }
      };
      return content(
        MiniPetition,
        session,
        { specificContent: [ 'costsPetitionerDivorceNoCosts' ] });
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
        { specificContent: [ 'coRespondent' ] });
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
        { specificContent: [ 'coRespondent' ] });
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
          { specificContent: [ 'jurisdictionConnectionBothResident' ] });
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
          { specificContent: [ 'jurisdictionConnectionOneResides' ] });
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
          { specificContent: [ 'jurisdictionConnectionRespondent' ] });
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
          { specificContent: [ 'jurisdictionConnectionPetitioner' ] });
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
          { specificContent: [ 'jurisdictionConnectionPetitionerSixMonths' ] });
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
          { specificContent: [ 'jurisdictionConnectionBothDomiciled' ] });
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
          { specificContent: [ 'jurisdictionConnectionOther' ] });
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
          { specificContent: [ 'onGoingCasesNo' ] });
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
          { specificContent: [ 'onGoingCasesYes' ] });
      });
    });

    context('reasons for divorce', () => {
      context('adultery', () => {
        it('base content', () => {
          const session = {
            case: {
              data: {
                connections: {},
                reasonForDivorce: 'adultery'
              }
            }
          };
          return content(
            MiniPetition,
            session,
            { specificContent: [ 'reasonForDivorceAdultery' ] });
        });
        it('co-respondent is named', () => {
          const session = {
            case: {
              data: {
                connections: {},
                reasonForDivorce: 'adultery',
                reasonForDivorceAdulteryIsNamed: 'Yes'
              }
            }
          };
          return content(
            MiniPetition,
            session,
            { specificContent: [ 'reasonForDivorceAdultery' ] });
        });
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
            { specificContent: [ 'reasonForDivorceAdulteryWhere' ] });
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
            { specificContent: [ 'reasonForDivorceAdulteryWhen' ] });
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
          'reasonForDivorceUnreasonableBehaviourDescription'
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
          'reasonForDivorceSeperationTwoYears'
        ];
        return content(MiniPetition, session, { specificContent });
      });

      it('separation 5 years', () => {
        const session = {
          case: {
            data: {
              connections: {},
              reasonForDivorce: 'separation-5-years'
            }
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
          case: {
            data: {
              connections: {},
              reasonForDivorce: 'desertion'
            }
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
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              divorceClaimFrom: ['respondent', 'correspondent']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'claimingCostsFromRespondentCoRespondent' ] });
      });
      it('from co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              divorceClaimFrom: ['correspondent']
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'claimingCostsFromCoRespondent' ] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'Yes',
              divorceClaimFrom: []
            }
          }
        };
        return content(
          MiniPetition,
          session,
          { specificContent: [ 'claimingCostsFromRespondent' ] });
      });

      it('not claiming', () => {
        const session = {
          case: {
            data: {
              connections: {},
              claimsCosts: 'No',
              divorceClaimFrom: []
            }
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
          { specificContent: [ 'financialOrdersPropertyMoneyPensionsChildren' ] }
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
          { specificContent: [ 'financialOrdersChildren' ] });
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
          { specificContent: [ 'financialOrdersPropertyMoneyPensions' ] });
      });

      it('not claiming', () => {
        const session = {
          case: {
            data: {
              connections: {},
              financialOrder: 'No',
              divorceClaimFrom: []
            }
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
        { specificContent: [ 'applicantsCorrespondenceAddress' ] });
    });


    it('CoRespondent Address', () => {
      const session = {
        case: {
          data: {
            connections: {},
            reasonForDivorceAdultery3rdAddress: ['line1', 'line2', 'postcode']
          }
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
