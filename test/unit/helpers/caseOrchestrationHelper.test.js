const moduleName = 'helpers/caseOrchestrationHelper';

const rewire = require('rewire');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const { Question } = require('@hmcts/one-per-page/steps');
const { form, date, convert, text } = require('@hmcts/one-per-page/forms');
const moment = require('moment');

const caseOrchestrationHelper = rewire(moduleName);

class Step extends Question {
  get form() {
    return form({
      date: convert(
        d => moment(`${d.year}-${d.month}-${d.day}`, 'YYYY-MM-DD').endOf('day'),
        date
      ),
      text,
      unAnsweredField: text
    });
  }
}

class OtherStep extends Question {
  get form() {
    return form({
      shouldNotApear: text
    });
  }
}

const req = {
  journey: {
    steps: { [Step.name]: Step, [OtherStep.name]: OtherStep }
  },
  session: {
    Step: {
      date: { year: '2010', month: '10', day: '10' },
      text: 'foo'
    }
  }
};
const res = {};

let body = {};

describe(moduleName, () => {
  before(() => {
    const stepInstance = new Step(req, res);
    stepInstance.retrieve();

    req.journey.instance = sinon.stub().returns(stepInstance);

    const map = {
      'Step.date': 'date',
      'Step.text': 'text',
      'Step.unAnsweredField': 'unAnsweredField',
      'OtherStep.shouldNotApear': 'shouldNotApear'
    };
    caseOrchestrationHelper.__set__('sessionToCosMapping', map);

    body = caseOrchestrationHelper.formatSessionForSubmit(req);
  });

  it('should only include answered fields', () => {
    expect(body).to.not.have.property('unAnsweredField');
  });

  it('should not include unanswered steps', () => {
    expect(body).to.not.have.property('shouldNotApear');
  });

  it('returns correct value for date', () => {
    expect(JSON.stringify(body)).to.include('2010-10-10');
  });

  it('returns correct value for text', () => {
    expect(body).to.include({ text: 'foo' });
  });
});
