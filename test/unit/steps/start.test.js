const modulePath = 'steps/start/Start.step';

const Start = require(modulePath);
const PetitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const Entry = require('steps/entry/Entry.step');
const { redirect, sinon } = require('@hmcts/one-per-page-test-suite');
const SystemMessage = require('steps/system-message/SystemMessage.step');
const config = require('config');

describe(modulePath, () => {
  const sandbox = sinon.createSandbox();

  context('navigation', () => {
    it('to entry page', () => {
      return redirect.navigatesToNext(Start, Entry);
    });

    describe('showSystemMessage feature off', () => {
      before(() => {
        sandbox.replace(config.features, 'showSystemMessage', false);
      });

      after(() => {
        sandbox.restore();
      });

      it('to PetitionProgressBar page', () => {
        const session = {
          case: {}
        };
        return redirect.navigatesToNext(Start, PetitionProgressBar, session);
      });
    });

    describe('showSystemMessage feature on', () => {
      before(() => {
        sandbox.replace(config.features, 'showSystemMessage', true);
      });

      after(() => {
        sandbox.restore();
      });

      it('to SystemMessage page', () => {
        const session = {
          case: {}
        };
        return redirect.navigatesToNext(Start, SystemMessage, session);
      });
    });
  });
});
