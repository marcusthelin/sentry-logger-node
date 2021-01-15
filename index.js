const Sentry = require('@sentry/node');
const logger = require('./lib/logger');
const packageName = require('./package.json').name;

function init({ dsn, serviceName, release, environment = 'dev', ...rest }, optionFn) {
    Sentry.init({
        dsn,
        ...(release && { release }),
        environment,
        beforeSend: (event, hint) => {
            // Convert all non errors to error objects
            const error = hint.originalException;
            if (!(error instanceof Error)) {
                return new Error(error);
            }
            return event;
        },
        ...rest,
    });
    Sentry.setTag('service', serviceName);
    if (typeof optionFn === 'function') {
        optionFn(Sentry);
    }
    logger.info(`From ${packageName}:`, 'Sentry has been initialized!');
}

module.exports = {
    init,
    koa: require('./lib/koa'),
    express: require('./lib/express'),
    logger: require('./lib/logger'),
};
