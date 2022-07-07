const modulePath = 'steps/desertion-asked-to-resume-dn/DesertionAskedToResumeDN.step';

const DesertionAskedToResumeDNContent = require('steps/desertion-asked-to-resume-dn/DesertionAskedToResumeDN.content');  // eslint-disable-line
const DesertionAskedToResumeDN = require(modulePath);
const LivedApartSinceDesertion = require(
  'steps/lived-apart-since-desertion/LivedApartSinceDesertion.step'
);
const idam = require('services/idam');
const { middleware, question, sinon,
  content, expect } = require('@hmcts/one-per-page-test-suite');

const session = { case: { data: {} } };

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(DesertionAskedToResumeDN, [ idam.protect() ]);
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
      'phoneToCallIfProblems'
    ];
    return content(DesertionAskedToResumeDN, session, { ignoreContent });
  });


  describe('Shows error', () => {
    it('if does not answer question', () => {
      const onlyErrors = ['required'];
      return question.testErrors(DesertionAskedToResumeDN, session, {}, { onlyErrors });
    });

    it('if desertionAskedToResumeDN:yes and no data for refusal question', () => {
      const onlyErrors = ['requiredRefusalDetails'];
      const fields = { 'changes.desertionAskedToResumeDN': 'yes',
        'changes.desertionAskedToResumeDNRefused': '' };
      return question.testErrors(DesertionAskedToResumeDN, session, fields, { onlyErrors });
    });

    it("if desertionAskedToResumeDN: yes, desertionAskedToResumeDNRefused: yes and no data for desertionAskedToResumeDNDetails", () => { // eslint-disable-line
      const onlyErrors = ['requiredDesertionAskedToResumeDNDetails'];
      const fields = { 'changes.desertionAskedToResumeDN': 'yes',
        'changes.desertionAskedToResumeDNRefused': 'yes',
        'changes.desertionAskedToResumeDNDetails': '' };
      return question.testErrors(DesertionAskedToResumeDN, session, fields, { onlyErrors });
    });
  });

  describe('Redirects to LivedApartSinceDesertion', () => {
    it('desertionAskedToResumeDN: no', () => {
      const fields = { 'changes.desertionAskedToResumeDN': 'no' };
      return question.redirectWithField(
        DesertionAskedToResumeDN,
        fields,
        LivedApartSinceDesertion,
        {}
      );
    });

    it('desertionAskedToResumeDN: yes, desertionAskedToResumeDNRefused: no', () => {
      const fields = {
        'changes.desertionAskedToResumeDN': 'yes',
        'changes.desertionAskedToResumeDNRefused': 'no'
      };
      return question.redirectWithField(
        DesertionAskedToResumeDN,
        fields,
        LivedApartSinceDesertion,
        {}
      );
    });

    it("desertionAskedToResumeDN: yes, desertionAskedToResumeDNRefused: yes, desertionAskedToResumeDNDetails: 'Details'", () => { // eslint-disable-line
      const fields = {
        'changes.desertionAskedToResumeDN': 'yes',
        'changes.desertionAskedToResumeDNRefused': 'yes',
        'changes.desertionAskedToResumeDNDetails': 'Details'
      };
      return question.redirectWithField(
        DesertionAskedToResumeDN,
        fields,
        LivedApartSinceDesertion,
        {}
      );
    });
  });


  describe('Returns correct answers()', () => {
    it('desertionAskedToResumeDN: no', () => {
      const expectedContent = [
        // eslint-disable-next-line max-len
        DesertionAskedToResumeDNContent.en.fields.desertionAskedToResumeDN.no
      ];

      const stepData = {
        changes: {
          desertionAskedToResumeDN: 'no'
        }
      };

      return question.answers(DesertionAskedToResumeDN, stepData, expectedContent, session);
    });

    it('desertionAskedToResumeDN: yes, desertionAskedToResumeDNRefused: no', () => {
      const expectedContent = [
        // eslint-disable-next-line max-len
        DesertionAskedToResumeDNContent.en.fields.desertionAskedToResumeDN.yes,
        DesertionAskedToResumeDNContent.en.fields.desertionAskedToResumeDNRefused.no
      ];

      const stepData = {
        changes: {
          desertionAskedToResumeDN: 'yes',
          desertionAskedToResumeDNRefused: 'no'
        }
      };

      return question.answers(DesertionAskedToResumeDN, stepData, expectedContent, session);
    });

    it("desertionAskedToResumeDN: yes, desertionAskedToResumeDNRefused: yes, desertionAskedToResumeDNDetails: 'Details given'", () => { // eslint-disable-line
      const details = 'Details given';
      const expectedContent = [
        // eslint-disable-next-line max-len
        DesertionAskedToResumeDNContent.en.fields.desertionAskedToResumeDN.yes,
        DesertionAskedToResumeDNContent.en.fields.desertionAskedToResumeDNRefused.yes,
        details
      ];

      const stepData = {
        changes: {
          desertionAskedToResumeDN: 'yes',
          desertionAskedToResumeDNRefused: 'yes',
          desertionAskedToResumeDNDetails: details
        }
      };

      return question.answers(DesertionAskedToResumeDN, stepData, expectedContent, session);
    });
  });

  describe('watches', () => {
    it('removes refusal and its Details if DesertionAskedToResumeDN changes to no', () => {
      const instance = new DesertionAskedToResumeDN({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches['DesertionAskedToResumeDN.changes.desertionAskedToResumeDN'];
      watch('yes', 'no', remove);

      expect(remove).calledWith('DesertionAskedToResumeDN.changes.desertionAskedToResumeDNRefused');
      expect(remove).calledWith('DesertionAskedToResumeDN.changes.desertionAskedToResumeDNDetails');
    });

    it('removes refusalDetails if desertionAskedToResumeDNRefused changes to no', () => {
      const instance = new DesertionAskedToResumeDN({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches[
        'DesertionAskedToResumeDN.changes.desertionAskedToResumeDNRefused'
      ];
      watch('yes', 'no', remove);

      expect(remove).calledWith('DesertionAskedToResumeDN.changes.desertionAskedToResumeDNDetails');
    });
  });

  describe('Returns correct values()', () => {
    it('desertionAskedToResumeDN: no ', () => {
      const selectedValue = 'no';
      const fields = {
        changes: {
          desertionAskedToResumeDN: selectedValue
        }
      };
      const req = {
        journey: {},
        session: { DesertionAskedToResumeDN: fields }
      };

      const res = {};
      const step = new DesertionAskedToResumeDN(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.desertionAskedToResumeDN', selectedValue);
    });

    it('desertionAskedToResumeDN: yes, desertionAskedToResumeDNRefused: no ', () => {
      const yesValue = 'yes';
      const noValue = 'no';
      const fields = {
        changes: {
          desertionAskedToResumeDN: yesValue,
          desertionAskedToResumeDNRefused: noValue
        }
      };
      const req = {
        journey: {},
        session: { DesertionAskedToResumeDN: fields }
      };

      const res = {};
      const step = new DesertionAskedToResumeDN(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.desertionAskedToResumeDN', yesValue);
      expect(_values).to.have.property('changes.desertionAskedToResumeDNRefused', noValue);
    });

    it('desertionAskedToResumeDN: yes, desertionAskedToResumeDNRefused: yes, desertionAskedToResumeDNDetails: "Details given"', () => { // eslint-disable-line
      const yesValue = 'yes';
      const details = 'Details given';
      const fields = {
        changes: {
          desertionAskedToResumeDN: yesValue,
          desertionAskedToResumeDNRefused: yesValue,
          desertionAskedToResumeDNDetails: details
        }
      };
      const req = {
        journey: {},
        session: { DesertionAskedToResumeDN: fields }
      };

      const res = {};
      const step = new DesertionAskedToResumeDN(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.desertionAskedToResumeDN', yesValue);
      expect(_values).to.have.property('changes.desertionAskedToResumeDNRefused', yesValue);
      expect(_values).to.have.property(
        'changes.desertionAskedToResumeDNDetails', details
      );
    });
  });
});
