const { Page, branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');

class Start extends Page {
  static get ignorePa11yWarnings() {
    return ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'];
  }

  static get path() {
    return config.paths.index;
  }

  next() {
    const hasSession = () => {
      return this.req.session && this.req.session.case;
    };

    return branch(
      redirectTo(this.journey.steps.Undefended).if(hasSession),
      redirectTo(this.journey.steps.Entry)
    );
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
      super.handler(req, res, next);
    } else {
      this.next().redirect(req, res, next);
    }
  }

  get middleware() {
    return [...super.middleware, idam.setRedirectUri];
  }
}

module.exports = Start;


// const { Redirect, branch } = require('@hmcts/one-per-page');
// const { redirectTo } = require('@hmcts/one-per-page/flow');
// const config = require('config');
// const idam = require('services/idam');
//
// class Start extends Redirect {
//   static get path() {
//     return config.paths.index;
//   }
//
//   next() {
//     const hasSession = () => {
//       return this.req.session && this.req.session.case;
//     };
//
//     return branch(
//       redirectTo(this.journey.steps.Undefended).if(hasSession),
//       redirectTo(this.journey.steps.Entry)
//     );
//   }
//
//   get middleware() {
//     return [...super.middleware, idam.setRedirectUri];
//   }
// }
//
// module.exports = Start;
