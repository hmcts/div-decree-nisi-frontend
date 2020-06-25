const { ExitPoint, Page } = require('@hmcts/one-per-page');
const { Interstitial, Question } = require('@hmcts/one-per-page/steps');
const { CheckYourAnswers: CYA } = require('@hmcts/one-per-page/checkYourAnswers');
const { section } = require('@hmcts/one-per-page/src/steps/check-your-answers/section');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

class shimSessionCYA extends CYA {
  handler(req, res, next) {
    Promise
      .all(this.journey.answers.map(ans => {
        return ans.render(req.app);
      }))
      .then(answers => {
        this._answers = answers;
        this._sections = [
          ...this.sections().map(s => {
            return s.filterAnswers(answers);
          }),
          section.default.filterAnswers(answers)
        ];

        if (req.method === 'GET') {
          res.render(this.template, this.locals, (error, html) => {
            delete this.req.session.featureToggles;
            this.res.send(html);
          });
        } else if (req.method === 'POST') {
          this.parse();
          this.validate();

          if (this.valid) {
            this.store();
            this.next().redirect(req, res, next);
          } else {
            this.storeErrors();
            res.redirect(this.path);
          }
        } else {
          res.sendStatus(METHOD_NOT_ALLOWED);
        }
      })
      .catch(error => {
        next(error);
      });
  }
}

class shimSessionExitPoint extends ExitPoint {
  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template, this.locals, (error, html) => {
        delete this.req.session.featureToggles;
        this.res.send(html);
      });
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

class shimSessionInterstitial extends Interstitial {
  handler(req, res, next) {
    if (req.method === 'POST') {
      this.next().redirect(req, res, next);
    } else if (req.method === 'GET') {
      res.render(this.template, this.locals, (error, html) => {
        delete this.req.session.featureToggles;
        this.res.send(html);
      });
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

class shimSessionStaticPage extends Page {
  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template, this.locals, (error, html) => {
        delete this.req.session.featureToggles;
        this.res.send(html);
      });
    }
  }
}

class shimSessionQuestion extends Question {
  handler(req, res, next) {
    if (req.method === 'GET') {
      delete this.req.session.featureToggles;
      this.renderPage();
    } else if (req.method === 'POST') {
      this.parse();
      this.validate();

      if (this.valid) {
        this.store();
        this.next().redirect(req, res, next);
      } else {
        this.storeErrors();
        res.redirect(this.path);
      }
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

module.exports = {
  shimSessionCYA,
  shimSessionExitPoint,
  shimSessionInterstitial,
  shimSessionStaticPage,
  shimSessionQuestion
};
