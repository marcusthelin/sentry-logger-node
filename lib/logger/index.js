const Sentry = require('@sentry/node');

const sendExceptionIfTheseTypes = [
    Sentry.Severity.Critical,
    Sentry.Severity.Fatal,
    Sentry.Severity.Error,
];

function sendMessageToSentry(level, ...args) {
    let message = new Error(args.join(', '));

    // If not an exception we set first argument as title
    if (args.length > 1 && !sendExceptionIfTheseTypes.includes(level)) {
        const title = args[0];
        args.splice(0, 1);
        message = `${title}, ${args.map(JSON.stringify).join(',')}`;
    }

    // If only one argument, set message to first arg
    if (args.length === 1) {
        message = args[0];
    }
    console.log(`[${level}]: ${message}`);
    Sentry.configureScope(scope => {
        scope.setLevel(level);
        if (process.env.SENTRY_LOGGING_ENABLED) {
            if (sendExceptionIfTheseTypes.includes(level)) {
                Sentry.captureException(message);
            } else {
                Sentry.captureMessage(message);
            }
        }
    });
}

module.exports = {
    error: (...args) => sendMessageToSentry(Sentry.Severity.Error, ...args),
    info: (...args) => sendMessageToSentry(Sentry.Severity.Info, ...args),
    warning: (...args) => sendMessageToSentry(Sentry.Severity.Warning, ...args),
    critical: (...args) => sendMessageToSentry(Sentry.Severity.Critical, ...args),
    fatal: (...args) => sendMessageToSentry(Sentry.Severity.Fatal, ...args),
    verbose: message => console.log(`[verbose]: ${message}`),
};
