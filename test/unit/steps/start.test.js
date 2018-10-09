const modulePath = 'steps/start/Start.step';

const Start = require(modulePath);
const Undefended = require('steps/undefended/Undefended.step');
const Entry = require('steps/entry/Entry.step');
const { redirect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  context('navigation', () => {
    it('to undefended page', () => {
      const session = {
        case: {}
      };
      return redirect.navigatesToNext(Start, Undefended, session);
    });

    it('to entry page', () => {
      return redirect.navigatesToNext(Start, Entry);
    });
  });
});
