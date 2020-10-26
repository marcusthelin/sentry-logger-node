const Sentry = require('@sentry/node');

function init({ dsn, serviceName, release }) {
    Sentry.init({
        dsn,
        ...(release && { release }),
    });
    Sentry.setTag('service', serviceName);
}

module.exports = {
    init,
    koa: require('./lib/koa'),
    express: require('./lib/express'),
    logger: require('./lib/logger'),
};
