// eslint-disable-next-line max-len
const modulePath = 'steps/review-aos-response-from-co-respondent/ReviewAosResponseFromCoRespondent.step.js';

const ReviewAosResponseFromCoRespondent = require(modulePath);
const ReviewCRContent = require(
  'steps/review-aos-response-from-co-respondent/ReviewAosResponseFromCoRespondent.content'
);
const idam = require('services/idam');
const { middleware, sinon, content, question } = require('@hmcts/one-per-page-test-suite');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const RespNotAdmitAdultery = require(
  'steps/resp-not-admit-adultery/RespNotAdmitAdultery.step'
);

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ReviewAosResponseFromCoRespondent, [idam.protect()]);
  });

  describe('renders content', () => {
    it('with yes answers', () => {
      const session = {
        case: {
          data: {
            coRespondentAnswers: {
              admitAdultery: 'Yes',
              defendsDivorce: 'Yes',
              costs: {
                agreeToCosts: 'Yes'
              }
            }
          }
        }
      };
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'theCoRespondentResponseToAdulteryNo',
        'theCoRespondentDefendsTheDivorceNo',
        'theCoRespondentAgreeToPayCostsNo',
        'corespondentDidNotRespond',
        'clarificationCourtFeedback'
      ];

      return content(ReviewAosResponseFromCoRespondent, session, { ignoreContent });
    });

    it('with no answers', () => {
      const session = {
        case: {
          data: {
            coRespondentAnswers: {
              admitAdultery: 'No',
              defendsDivorce: 'No',
              costs: {
                agreeToCosts: 'No',
                reason: 'It is the right thing to do...'
              }
            }
          }
        }
      };
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'theCoRespondentResponseToAdulteryYes',
        'theCoRespondentDefendsTheDivorceYes',
        'theCoRespondentAgreeToPayCostsYes',
        'corespondentDidNotRespond',
        'clarificationCourtFeedback'
      ];
      return content(ReviewAosResponseFromCoRespondent, session, { ignoreContent });
    });

    it('When co-respondent has not answered', () => {
      const session = {
        case: {
          data: {
          }
        }
      };
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'theCoRespondentResponseToAdulteryNo',
        'theCoRespondentResponseToAdulteryYes',
        'theCoRespondentDefendsTheDivorceNo',
        'theCoRespondentDefendsTheDivorceYes',
        'theCoRespondentAgreeToPayCostsYes',
        'theCoRespondentAgreeToPayCostsNo',
        'corespondentDidNotRespond',
        'theCoRespondentResponseToAdultery',
        'theCoRespondentDefendsTheDivorce',
        'theCoRespondentAgreeToPayCosts',
        'youNeedToRead',
        'clarificationCourtFeedback'
      ];
      return content(ReviewAosResponseFromCoRespondent, session, { ignoreContent });
    });

    it('test session values which appear in content', () => {
      const session = {
        case: {
          data: {
            petitionerFirstName: 'petfirstname',
            petitionerLastName: 'petlastname',
            respondentFirstName: 'respfirstname',
            respondentLastName: 'resplastname',
            reasonForDivorceAdultery3rdPartyFirstName: 'adulteryfirstname',
            reasonForDivorceAdultery3rdPartyLastName: 'adulterylastname',
            coRespondentAnswers: {
              admitAdultery: 'No',
              defendsDivorce: 'No',
              costs: {
                agreeToCosts: 'No',
                reason: 'It is the right thing to do...'
              }
            }
          }
        }
      };
      const specificValues = [
        'petfirstname',
        'petlastname',
        'respfirstname',
        'resplastname',
        'adulteryfirstname',
        'adulterylastname',
        'It is the right thing to do...'
      ];
      return content(ReviewAosResponseFromCoRespondent, session, { specificValues });
    });

    it('agree to cost reason value does not exist if co-respondent agrees to costs', () => {
      const session = {
        case: {
          data: {
            coRespondentAnswers: {
              admitAdultery: 'No',
              defendsDivorce: 'No',
              costs: {
                agreeToCosts: 'Yes',
                reason: 'It is the right thing to do...'
              }
            }
          }
        }
      };
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'theCoRespondentResponseToAdulteryYes',
        'theCoRespondentDefendsTheDivorceYes',
        'theCoRespondentAgreeToPayCostsNo',
        'corespondentDidNotRespond',
        'clarificationCourtFeedback'
      ];
      const specificValuesToNotExist = ['It is the right thing to do...'];
      return content(ReviewAosResponseFromCoRespondent, session, {
        ignoreContent,
        specificValuesToNotExist
      });
    });
  });

  it('returns correct answers - if co-respondent defends divorce', () => {
    const expectedContent = [ ReviewCRContent.en.fields.reviewAosCRResponse.yes ];
    const session = {
      case: {
        data: {
          coRespondentAnswers: {
            defendsDivorce: 'Yes'
          }
        }
      }
    };
    return question.answers(ReviewAosResponseFromCoRespondent, {}, expectedContent, session);
  });

  it('returns correct answers - if co-respondent not defending divorce', () => {
    const expectedContent = [ ReviewCRContent.en.fields.reviewAosCRResponse.no ];
    const session = {
      case: {
        data: {
          coRespondentAnswers: {
            defendsDivorce: 'No'
          }
        }
      }
    };
    return question.answers(ReviewAosResponseFromCoRespondent, {}, expectedContent, session);
  });

  it('navigates to ApplyForDecreeNisi page', () => {
    const fields = { reviewAosCRResponse: 'yes' };
    const session = {
      case: {
        data: {
          coRespondentAnswers: {
            contactInfo: {
              emailAddress: 'testadulterycr@mailinator.com',
              consentToReceivingEmails: 'Yes',
              contactMethodIsDigital: 'Yes',
              phoneNumber: '+4433344443443'
            },
            aos: {
              received: 'Yes',
              letterHolderId: '809112',
              dateReceived: '2019-03-06'
            },
            confirmReadPetition: 'Yes',
            statementOfTruth: 'Yes',
            admitAdultery: 'Yes',
            defendsDivorce: 'No',
            costs: {
              agreeToCosts: 'Yes'
            }
          }
        }
      }
    };

    return question.redirectWithField(
      ReviewAosResponseFromCoRespondent,
      fields,
      ApplyForDecreeNisi,
      session
    );
  });

  describe('Redirects', () => {
    it('To RespNotAdmitAdultery page - No CoRespondent Answers, state: AosCompleted', () => {
      const fields = { reviewAosCRResponse: 'yes' };
      const session = {
        case: {
          state: 'AosCompleted',
          data: {
            reasonForDivorce: 'adultery',
            respAdmitOrConsentToFact: 'No',
            coRespondentAnswers: {
              admitAdultery: 'Yes',
              defendsDivorce: 'Yes',
              costs: {
                agreeToCosts: 'Yes'
              }
            }
          }
        }
      };
      return question.redirectWithField(
        ReviewAosResponseFromCoRespondent,
        fields,
        RespNotAdmitAdultery,
        session
      );
    });

    it('To ApplyForDecreeNisi page - CoRespondent Answers not received, state: AwaitingDN', () => {
      const fields = { reviewAosCRResponse: 'yes' };
      const session = {
        case: {
          state: 'AwaitingDN',
          data: {
            reasonForDivorce: 'adultery',
            respAdmitOrConsentToFact: 'No',
            coRespondentAnswers: {
              admitAdultery: 'Yes',
              defendsDivorce: 'Yes',
              costs: {
                agreeToCosts: 'Yes'
              }
            }
          }
        }
      };
      return question.redirectWithField(
        ReviewAosResponseFromCoRespondent,
        fields,
        ApplyForDecreeNisi,
        session
      );
    });

    it('navigates to ApplyForDecreeNisi page', () => {
      const fields = { reviewAosCRResponse: 'yes' };
      const session = {
        case: {
          data: {
            coRespondentAnswers: {
              admitAdultery: 'Yes',
              defendsDivorce: 'Yes',
              costs: {
                agreeToCosts: 'Yes'
              }
            }
          }
        }
      };
      return question.redirectWithField(
        ReviewAosResponseFromCoRespondent,
        fields,
        ApplyForDecreeNisi,
        session
      );
    });
  });
});