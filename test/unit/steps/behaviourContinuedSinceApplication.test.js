const modulePath = 'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step'; // eslint-disable-line

const BehaviourContinuedSinceApplication = require(modulePath);

const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const BehaviourContinuedSinceApplicationContent = require('steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.content');  // eslint-disable-line
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const LivedApartSinceLastIncidentDate = require('steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.step'); // eslint-disable-line
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');


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
    const session = { case: { data: {} } };
    return content(BehaviourContinuedSinceApplication, session);
  });


  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    const session = {
      case: {
        data: {
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    return question.testErrors(BehaviourContinuedSinceApplication, session, {}, { onlyErrors });
  });

  it('shows error if answered no and no date entered', () => {
    const onlyErrors = ['requireLastIncidentDate'];
    const fields = { 'changes.behaviourContinuedSinceApplication': 'no',
      'changes.lastIncidentDate-day': '' };
    const session = {
      case: {
        data: {
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    return question.testErrors(BehaviourContinuedSinceApplication, session, fields, { onlyErrors });
  });

  it('shows error if answered no and a date before last application date is entered', () => {
    const onlyErrors = ['requireLastIncidentDate'];
    const fields = { 'changes.behaviourContinuedSinceApplication': 'no',
      'changes.lastIncidentDate-day': '20',
      'changes.lastIncidentDate-month': '03',
      'changes.lastIncidentDate-year': '1900' };
    const session = {
      case: {
        data: {
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    return question.testErrors(BehaviourContinuedSinceApplication, session, fields, { onlyErrors });
  });

  it('shows error if answered no and a date in future is entered', () => {
    const onlyErrors = ['requireLastIncidentDate'];
    const fields = { 'changes.behaviourContinuedSinceApplication': 'no',
      'changes.lastIncidentDate-day': '20',
      'changes.lastIncidentDate-month': '03',
      'changes.lastIncidentDate-year': '2200' };
    const session = {
      case: {
        data: {
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    return question.testErrors(BehaviourContinuedSinceApplication, session, fields, { onlyErrors });
  });

  it('redirects to LivedApartSinceLastIncidentDate if selected no and valid date', () => {
    const fields = { 'changes.behaviourContinuedSinceApplication': 'no',
      'changes.lastIncidentDate.day': '20',
      'changes.lastIncidentDate.month': '09',
      'changes.lastIncidentDate.year': '2018' };
    const session = {
      case: {
        data: {
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    return question.redirectWithField(
      BehaviourContinuedSinceApplication,
      fields,
      LivedApartSinceLastIncidentDate,
      session
    );
  });

  it('redirects to ShareCourtDocuments if answered yes and claimsCosts is No', () => {
    const fields = {
      'changes.behaviourContinuedSinceApplication': 'yes'
    };
    const session = {
      case: {
        data: {
          createdDate: '2018-08-02T00:00:00.000Z',
          claimsCosts: 'No'
        }
      }
    };
    return question.redirectWithField(
      BehaviourContinuedSinceApplication,
      fields,
      ShareCourtDocuments,
      session
    );
  });

  it('redirects to ClaimCosts if answered yes and claimsCosts is Yes', () => {
    const fields = {
      'changes.behaviourContinuedSinceApplication': 'yes'
    };
    const session = {
      case: {
        data: {
          createdDate: '2018-08-02T00:00:00.000Z',
          claimsCosts: 'Yes'
        }
      }
    };
    return question.redirectWithField(
      BehaviourContinuedSinceApplication,
      fields,
      ClaimCosts,
      session
    );
  });

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.yes
    ];

    const stepData = {
      changes: {
        behaviourContinuedSinceApplication: 'yes'
      }
    };

    const session = {
      case: {
        data: {
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };

    return question.answers(BehaviourContinuedSinceApplication, stepData, expectedContent, session);
  });

  it('returns correct answers if answered no', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      BehaviourContinuedSinceApplicationContent.en.fields.changes.behaviourContinuedSinceApplication.no
    ];

    const stepData = {
      changes: {
        behaviourContinuedSinceApplication: 'no'
      }
    };

    const session = {
      case: {
        data: {
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };

    return question.answers(BehaviourContinuedSinceApplication, stepData, expectedContent, session);
  });


  describe('Returns correct values()', () => {
    it('behaviourContinuedSinceApplication : yes ', () => {
      const selectedValue = 'yes';
      const fields = {
        changes: {
          behaviourContinuedSinceApplication: selectedValue,
          lastIncidentDate: '20/08/1990'
        }
      };
      const req = {
        journey: {},
        session: { case: { data: {} }, BehaviourContinuedSinceApplication: fields }
      };

      const res = {};
      const step = new BehaviourContinuedSinceApplication(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.behaviourContinuedSinceApplication', selectedValue);
      expect(_values).to.not.have.property('changes.lastIncidentDate');
    });

    it('behaviourContinuedSinceApplication : no ', () => {
      const selectedValue = 'no';
      const fields = {
        changes: {
          behaviourContinuedSinceApplication: selectedValue,
          lastIncidentDate: '20/08/1990'
        }
      };
      const req = {
        journey: {},
        session: { case: { data: {} }, BehaviourContinuedSinceApplication: fields }
      };

      const res = {};
      const step = new BehaviourContinuedSinceApplication(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.behaviourContinuedSinceApplication', selectedValue);
      expect(_values).to.have.property('changes.lastIncidentDate');
    });
  });
});
