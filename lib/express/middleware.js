const Sentry = require('@sentry/node');

/**
 * @typedef options
 * @property {Object} tags - Key/value pairs of tags to be sent with the payload to Sentry.
 * @property {string} [requestId] - Request ID to be set as a tag. Will default to get it from x-request-id header.
 */

/**
 *
 * Middleware for express to set tags on Sentry scope.
 * @param {options} [Options] - Optional options
 */
function expressMiddleware({ tags = {}, requestId } = {}) {
    return (req, res, next) => {
        Sentry.configureScope(scope => {
            scope.setTag('request_id', requestId || req.headers['x-request-id']);
            const extraTags = Object.entries(tags);
            if (extraTags.length) {
                extraTags.forEach(([key, value]) => {
                    scope.setTag(key, value);
                });
            }
        });
        next();
    };
}

module.exports = expressMiddleware;
