const Sentry = require('@sentry/node');

function init({ dsn, serviceName, release, environment = 'dev' }) {
    Sentry.init({
        dsn,
        ...(release && { release }),
        environment,
    });
    Sentry.setTag('service', serviceName);
}

module.exports = {
    init,
    koa: require('./lib/koa'),
    express: require('./lib/express'),
    logger: require('./lib/logger'),
};
