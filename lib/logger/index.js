const Sentry = require('@sentry/node');
const sendExceptionIfTheseTypes = [
    Sentry.Severity.Critical,
    Sentry.Severity.Fatal,
    Sentry.Severity.Error,
];

function sendMessageToSentry(message, level) {
    let captureFunction = Sentry.captureMessage;
    Sentry.conigureScope(scope => {
        scope.setLevel(level);
        if (sendExceptionIfTheseTypes.includes(level)) {
            Sentry.captureException(message);
        } else {
            Sentry.captureMessage(message);
        }
    });
}

module.exports = {
    error: Sentry.captureException,
    info: message => sendMessageToSentry(message, Sentry.Severity.Info),
    warning: message => sendMessageToSentry(message, Sentry.Severity.Warning),
    critical: message => sendMessageToSentry(message, Sentry.Severity.Critical),
    fatal: message => sendMessageToSentry(message, Sentry.Severity.Fatal),
};
