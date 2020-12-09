const modulePath = 'steps/apply-for-decree-nisi/ApplyForDecreeNisi.step';

const ApplyForDecreeNisi = require(modulePath);
const ApplyForDecreeNisiContent = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.content');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const ExitPage = require('steps/exit/Exit.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  let session = {};
  beforeEach(() => {
    session = { case: { data: {} } };
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ApplyForDecreeNisi, [ idam.protect() ]);
  });

  it('renders the content', () => {
    const ignoreContent = [
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'clarificationCourtFeedback',
      'signIn',
      'languageToggle',
      'thereWasAProblem',
      'change',
      'husband',
      'wife',
      'continueBecauseOfDeemed',
      'continueBecauseOfDispensed',
      'processServerDetail',
      'alternativeMethodDetail'
    ];
    return content(ApplyForDecreeNisi, session, { ignoreContent });
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(ApplyForDecreeNisi, session);
  });

  it('redirects to Exit page if answer is no', () => {
    const fields = { applyForDecreeNisi: 'no' };
    return question.redirectWithField(ApplyForDecreeNisi, fields, ExitPage, session);
  });

  it('redirects to MiniPetition if answer is yes', () => {
    const fields = { applyForDecreeNisi: 'yes' };
    return question.redirectWithField(ApplyForDecreeNisi, fields, MiniPetition, session);
  });

  it('loads fields from the session', () => {
    const stepData = { applyForDecreeNisi: 'yes' };
    return question.rendersValues(ApplyForDecreeNisi, stepData, session);
  });

  it('returns correct answers', () => {
    const expectedContent = [
      ApplyForDecreeNisiContent.en.fields.applyForDecreeNisi.title,
      ApplyForDecreeNisiContent.en.fields.applyForDecreeNisi.yes
    ];
    const stepData = { applyForDecreeNisi: 'yes' };
    return question.answers(ApplyForDecreeNisi, stepData, expectedContent, session);
  });

  describe('Deemed and Dispensed template view:', () => {
    it('shows correct message when deemed approved', () => {
      session.case.data.serviceApplicationGranted = 'Yes';
      session.case.data.serviceApplicationType = 'deemed';
      const specificContent = ['continueBecauseOfDeemed'];
      const specificContentToNotExist = ['continueBecauseOfDispensed'];
      return content(ApplyForDecreeNisi, session, { specificContent, specificContentToNotExist });
    });

    it('shows correct message when dispensed approved', () => {
      session.case.data.serviceApplicationGranted = 'Yes';
      session.case.data.serviceApplicationType = 'dispensed';
      const specificContent = ['continueBecauseOfDispensed'];
      const specificContentToNotExist = ['continueBecauseOfDeemed'];
      return content(ApplyForDecreeNisi, session, { specificContent, specificContentToNotExist });
    });

    it('hides message when not deemed or dispensed approved', () => {
      const specificContentToNotExist = [
        'continueBecauseOfDeemed',
        'continueBecauseOfDispensed'
      ];
      return content(ApplyForDecreeNisi, session, { specificContentToNotExist });
    });
  });

  describe('Process Server template view:', () => {
    let processServerSession = {};

    beforeEach(() => {
      processServerSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            servedByProcessServer: 'Yes',
            receivedAosFromResp: 'No',
            permittedDecreeNisiReason: '3',
            divorceWho: 'husband'
          }
        }
      };
    });

    it('should render correct content when served by process server', () => {
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'clarificationCourtFeedback',
        'signIn',
        'languageToggle',
        'thereWasAProblem',
        'change',
        'husband',
        'wife',
        'continueBecauseOfDeemed',
        'continueBecauseOfDispensed',
        'alternativeMethodDetail'
      ];
      return content(ApplyForDecreeNisi, processServerSession, { ignoreContent });
    });
  });

  describe('Alternative Service template view:', () => {
    let alternativeServiceSession = {};

    beforeEach(() => {
      alternativeServiceSession = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            servedByAlternativeMethod: 'Yes',
            receivedAosFromResp: 'No',
            permittedDecreeNisiReason: '2',
            divorceWho: 'wife'
          }
        }
      };
    });

    it('should render correct content when served by process server', () => {
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'clarificationCourtFeedback',
        'signIn',
        'languageToggle',
        'thereWasAProblem',
        'change',
        'husband',
        'wife',
        'continueBecauseOfDeemed',
        'continueBecauseOfDispensed',
        'processServerDetail'
      ];
      return content(ApplyForDecreeNisi, alternativeServiceSession, { ignoreContent });
    });
  });
});
