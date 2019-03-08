// eslint-disable-next-line max-len
const modulePath = 'steps/review-aos-response-from-co-respondent/ReviewAosResponseFromCoRespondent.step.js';

const ReviewAosResponseFromCoRespondent = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content, question } = require('@hmcts/one-per-page-test-suite');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');


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
        'theCoRespondentResponseToAdulteryNo',
        'theCoRespondentDefendsTheDivorceNo',
        'theCoRespondentAgreeToPayCostsNo',
        'corespondentDidNotRespond'
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
        'theCoRespondentResponseToAdulteryYes',
        'theCoRespondentDefendsTheDivorceYes',
        'theCoRespondentAgreeToPayCostsYes',
        'corespondentDidNotRespond'
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
        'youNeedToRead'
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
        'theCoRespondentResponseToAdulteryYes',
        'theCoRespondentDefendsTheDivorceYes',
        'theCoRespondentAgreeToPayCostsNo',
        'corespondentDidNotRespond'
      ];
      const specificValuesToNotExist = ['It is the right thing to do...'];
      return content(ReviewAosResponseFromCoRespondent, session, {
        ignoreContent,
        specificValuesToNotExist
      });
    });
  });

  it('navigates to ApplyForDecreeNisi page', () => {
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
      session,
      ApplyForDecreeNisi
    );
  });
});