const config = require('config');
const express = require('express');
const path = require('path');
const onePerPage = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const { accessLogger } = require('services/logger');
const getSteps = require('steps');
const documentHandler = require('services/documentHandler');
const setupHelmet = require('middleware/helmet');
const setupPrivacy = require('middleware/privacy');
const setupHealthChecks = require('middleware/healthcheck');
const idam = require('services/idam');
const cookieParser = require('cookie-parser');
const setupRateLimiter = require('services/rateLimiter');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getFilters = require('views/filters');
const { parseBool } = require('@hmcts/one-per-page/util');
const errorContent = require('views/errors/error-content');
const events = require('events');

const app = express();

// Prevent node warnings re: MaxListenersExceededWarning
events.EventEmitter.defaultMaxListeners = Infinity;

setupHelmet(app);
setupPrivacy(app);
setupHealthChecks(app);
setupRateLimiter(app);

// Parsing cookies
app.use(cookieParser());

lookAndFeel.configure(app, {
  baseUrl: '/',
  express: {
    views: [
      path.resolve(__dirname, 'mocks', 'steps'),
      path.resolve(__dirname, 'steps'),
      path.resolve(__dirname, 'views')
    ]
  },
  webpack: {
    entry: [
      path.resolve(__dirname, 'assets/js/main.js'),
      path.resolve(__dirname, 'assets/js/cookiesManager.js'),
      path.resolve(__dirname, 'assets/scss/_web-chat.scss'),
      path.resolve(__dirname, 'assets/scss/main.scss'),
      path.resolve(__dirname, 'assets/scss/_cookies.scss'),
      path.resolve(__dirname, 'node_modules/dropzone/dist/dropzone.js'),
      path.resolve(__dirname, 'assets/js/webchat.js')
    ],
    plugins: [
      new CopyWebpackPlugin(
        [
          {
            from: path.resolve(__dirname, 'assets/images'),
            to: 'images'
          }
        ])
    ]
  },
  nunjucks: {
    filters: getFilters(),
    globals: {
      phase: 'BETA',
      feedbackLink: 'https://www.smartsurvey.co.uk/s/Divorce_Feedback/',
      googleAnalyticsId: config.services.googleAnalytics.id,
      antennaWebchat: {
        url: config.services.antennaWebchat.url,
        service: config.services.antennaWebchat.service,
        version: config.services.antennaWebchat.version
      },
      commonProps: {
        en: {
          courtPhoneNumber: config.commonProps.courtPhoneNumberEn,
          courtOpeningHours: config.commonProps.courtOpeningHourEn
        }
      },
      features: {
        antennaWebchatUserAttribute: parseBool(config.features.antennaWebchatUserAttribute),
        antennaWebchatAvailabilityToggle: parseBool(config.features.antennaWebchatAvailabilityToggle),
        // Dynatrace Feature Toggle
        dynatrace: parseBool(config.features.dynatrace)
      }
    }
  }
});
app.use('/public/locale', express.static(`${__dirname}/assets/locale`));

// Get user details from idam, sets req.idam.userDetails
app.use(idam.userDetails());

// 1px image used for tracking
app.get('/noJS.png', (req, res) => {
  res.send('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
});

app.use(accessLogger());

app.set('trust proxy', 1);

onePerPage.journey(app, {
  baseUrl: config.node.baseUrl,
  steps: getSteps(),
  routes: [ documentHandler ],
  errorPages: {
    serverError: {
      template: 'errors/server-error',
      message: {
        tryAgain: errorContent.tryAgain,
        canContact: errorContent.canContact,
        phoneDetails: errorContent.isThereAProblemWithThisPagePhone,
        emailDetails: errorContent.isThereAProblemWithThisPageEmail,
        serviceName: errorContent.serviceName,
        youCanEither: errorContent.youCanEither,
        backLink: errorContent.backLink,
        feedback: errorContent.feedback,
        accessibility: errorContent.accessibility,
        cookies: errorContent.cookies,
        privacyPolicy: errorContent.privacyPolicy,
        termsAndConditions: errorContent.termsAndConditions
      }
    },
    notFound: {
      template: 'errors/not-found-error',
      message: {
        errorMessage: errorContent.notFoundMessage,
        isThereAProblem: errorContent.isThereAProblemWithThisPageParagraph,
        phoneDetails: errorContent.isThereAProblemWithThisPagePhone,
        emailDetails: errorContent.isThereAProblemWithThisPageEmail,
        serviceName: errorContent.serviceName,
        youCanEither: errorContent.youCanEither,
        backLink: errorContent.backLink,
        feedback: errorContent.feedback,
        accessibility: errorContent.accessibility,
        cookies: errorContent.cookies,
        privacyPolicy: errorContent.privacyPolicy,
        termsAndConditions: errorContent.termsAndConditions
      }
    }
  },
  noSessionHandler: (req, res) => {
    return res.redirect(config.paths.entry);
  },
  session: {
    redis: { url: config.services.redis.url },
    cookie: {
      secure: config.session.secure,
      expires: config.session.expires
    },
    secret: config.session.secret,
    sessionEncryption: req => {
      let key = config.services.redis.encryptionAtRestKey;
      if (req && req.idam && req.idam.userDetails) {
        key += req.idam.userDetails.id;
      }
      return key;
    }
  },
  timeoutDelay: config.journey.timeoutDelay,
  i18n: { filters: getFilters() },
  useCsrfToken: true
});

module.exports = app;
