const Sentry = require('@sentry/node');

function init({ dsn, serviceName }) {
    Sentry.init({
        dsn,
    });
    Sentry.setTag('service', serviceName);
}

const sentryErrorHandler = err => {
    Sentry.captureException(err);
};

const sentryMiddleware = () => {
    return async (ctx, next) => {
        Sentry.configureScope(sentry => {
            sentry.setTag('request_id', getRequestId(ctx));
        });
        await next();
    };
};

module.exports = {
    init,
    koa: require('./lib/koa'),
    express: require('./lib/express'),
    logger: require('./lib/logger'),
};
