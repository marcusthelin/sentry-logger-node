const Sentry = require('@sentry/node');
const domain = require('domain');
const requestHandler = (ctx, next) => {
    return new Promise((resolve, _) => {
      const local = domain.create();
      local.add(ctx);
      local.on("error", err => {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit("error", err, ctx);
      });
      local.run(async () => {
        Sentry.getCurrentHub().configureScope(scope =>
          scope.addEventProcessor(event =>
            Sentry.Handlers.parseRequest(event, ctx.request, { user: false, serverName: false, transaction: 'handler', ip: true })
          )
        );
        await next();
        resolve();
      });
    });
  };
/**
 * @typedef options
 * @property {Object} tags - Key/value pairs of tags to be sent with the payload to Sentry.
 * @property {string} [requestId] - Request ID to be set as a tag. Will default to get it from x-request-id header.
 */

/**
 *
 * Middleware for Koa to set tags on Sentry scope.
 * @param {options} [Options] - Optional options
 */
function koaMiddleware({ tags = {}, requestId } = {}) {
    return async (ctx, next) => {
        Sentry.configureScope(scope => {
            scope.setTag('request_id', requestId || ctx.headers['x-request-id']);
            const extraTags = Object.entries(tags);
            if (extraTags.length) {
                extraTags.forEach(([key, value]) => {
                    scope.setTag(key, value);
                });
            }
        });
        return requestHandler(ctx, next);
    };
}

module.exports = koaMiddleware;
