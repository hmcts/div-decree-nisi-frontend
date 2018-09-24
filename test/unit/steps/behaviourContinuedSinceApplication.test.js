const modulePath = 'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step';

const BehaviourContinuedSinceApplication = require(modulePath);
const BehaviourContinuedSinceApplicationContent = require('steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.content');  // eslint-disable-line

const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const LivedApartSinceLastIncidentDate = require('steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.step');

const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

const moment = require('moment');

const {  date } = require('@hmcts/one-per-page/forms');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(BehaviourContinuedSinceApplication, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(BehaviourContinuedSinceApplication);
  });


  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(BehaviourContinuedSinceApplication, {}, {}, { onlyErrors });
  });

  it('shows error if answered no and no date entered', () => {
    const onlyErrors = ['requireLastIncidentDate'];
    const fields = { 'changes-behaviourContinuedSinceApplication': 'no',
      'changes-lastIncidentDate': '' };
    return question.testErrors(BehaviourContinuedSinceApplication, {}, fields, { onlyErrors });
  });

  it('shows error if answered no and invalid date entered', () => {
    const onlyErrors = ['requireLastIncidentDate'];
    const fields = { 'changes-behaviourContinuedSinceApplication': 'no',
      'changes-lastIncidentDate': '20/08/1990' };
    return question.testErrors(BehaviourContinuedSinceApplication, {}, fields, { onlyErrors });
  });

  it('redirects to ClaimCosts if answered yes', () => {
    const fields = {
      'changes-behaviourContinuedSinceApplication': 'yes'
    };
    return question.redirectWithField(BehaviourContinuedSinceApplication, fields, ClaimCosts);
  });

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.title,
      BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.yes
    ];

    const stepData = {
      changes: {
        behaviourContinuedSinceApplication: 'yes'
      }
    };

    return question.answers(BehaviourContinuedSinceApplication, stepData, expectedContent, {});
  });

  it('returns correct answers if answered no', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.title,
      BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.no
    ];

    const stepData = {
      changes: {
        behaviourContinuedSinceApplication: 'no'
      }
    };

    return question.answers(BehaviourContinuedSinceApplication, stepData, expectedContent, {});
  });
});
