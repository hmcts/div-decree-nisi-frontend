const config = require('config');
const divAppRouter = require('@hmcts/div-app-router');

// Setup appRouter
divAppRouter.setup(config.appRouter);

const middleware = divAppRouter.router.middleware;

module.exports = { middleware };