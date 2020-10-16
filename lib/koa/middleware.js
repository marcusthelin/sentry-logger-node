const Sentry = require('@sentry/node');

module.exports = () => {
    return async (ctx, next) => {
        Sentry.configureScope(sentry => {
            sentry.setTag('request_id', getRequestId(ctx));
        });
        await next();
    };
};
