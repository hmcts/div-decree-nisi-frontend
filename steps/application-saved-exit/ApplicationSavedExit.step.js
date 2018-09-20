const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const preserveSession = require('middleware/preserveSession');

class ApplicationSavedExit extends ExitPoint {
    static get path() {
        return config.paths.applicationSavedExit;
    }

    get session() {
        return this.req.sess;
    }

    get middleware() {
        return [
            preserveSession,
            ...super.middleware
        ];
    }
}

module.exports = ApplicationSavedExit;