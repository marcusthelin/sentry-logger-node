# Sentry logger node
This package includes Sentry middleware for Express and Koa and also exports a logger function. This mirrors how Winston logging functions work so replacing would be as simple as possible.

## How to install
Install the package:
```
npm install @24hr/sentry-logger-node
```

Initialize Sentry in your app:
```js
const sentryLogger = require('@24hr/sentry-logger-node');

sentryLogger.init({ dsn: SENTRY_DSN, release: SENTRY_RELEASE, environment: SENTRY_ENVIRONMENT, serviceName: 'my-service' });

// If you dont want it to send to Sentry in development:
if (process.env.NODE_ENV === 'production') {
    sentryLogger.init({ dsn: SENTRY_DSN, release: SENTRY_RELEASE, environment: SENTRY_ENVIRONMENT, serviceName: 'my-service' });
}
```

## Setup with Express
The package exports an Express middleware. To use it, be sure to use as soon as possible:
```js
app.use(sentryLogger.express.middleware());
```

## Setup with Koa
```js
app.use(sentryLogger.koa.middleware());
```

## Middleware options
The middleware function takes an option object where you can pass tags and requestId. This works the same for both Koa and Express.

### Tags
To add more tags:
```js
const extraTags = {
    tagKey: 'tagValue';
}
app.use(sentryLogger.koa.middleware({ tags: extraTags }));
```

### Request ID
A Request ID is just a another tag but is a unique identifier for the request. It's super useful if you have a request that has to pass by multiple microservices. 

By default the middleware will set the request ID to the value of the `x-request-id` header, but if that doesn't suit you, you can pass the requestId as an option.

```js
app.use(sentryLogger.koa.middleware({ requestId: 'unique id' }));
```

### Get request Id from other source
If you don't have a `x-request-id` header you can create a custom middleware to retrieve it.

For Koa:
```js
app.use((ctx, next) => {
    const myRequestId = ctx.headers['x-my-request-id'];
    return sentryLogger.koa.middleware({ requestId: myRequestId })(ctx, next)
});
```
For Express:
```js
app.use((req, res, next) => {
    const myRequestId = ctx.headers['x-my-request-id'];
    return sentryLogger.koa.middleware({ requestId: myRequestId })(req, res, next)
});
```

# Logging
This package exports a logger object with different logging levels.
The current levels are: verbose, info, warning, error, fatal and critical.

The ones that gets sent to Sentry are error, fatal and critical.

I plan to add a LOG_LEVEL env variable feature to exclude unwanted logs, e.g verbose. Right now, verbose and info are the same, but exists for backwards compatibility. 

## How to use (examples)
```js
const { logger } = require('@24hr/sentry-logger-node');

logger.info('Info text'); // Green color in console
logger.warning('Warning text'); // Yellow color in console
logger.error('Error', new Error('An error occcured!')); // Red color in console and sent to Sentry.
```