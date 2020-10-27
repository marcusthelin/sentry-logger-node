const Sentry = require('@sentry/node');
const chalk = require('chalk');

const sendExceptionIfTheseTypes = [
    Sentry.Severity.Critical,
    Sentry.Severity.Fatal,
    Sentry.Severity.Error,
];

function sendMessageToSentry(level, ...args) {
    let message = new Error(args.join(', '));
    const logColor = level === Sentry.Severity.Warning ? chalk.yellow : chalk.red;
    const levelPart = logColor(`[${level}]:`);
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
    console.log(`${levelPart} ${message}`); // Also log the message to the console.
    Sentry.configureScope(scope => {
        scope.setLevel(level);
        if (sendExceptionIfTheseTypes.includes(level)) {
            Sentry.captureException(message);
        } else {
            Sentry.captureMessage(message);
        }
    });
}

function writeNonCrucialLog(message, level = 'info') {
    const levelPart = chalk.green(`[${level}]:`);
    console.log(`${levelPart} ${message}`);
}

module.exports = {
    error: (...args) => sendMessageToSentry(Sentry.Severity.Error, ...args),
    warning: (...args) => sendMessageToSentry(Sentry.Severity.Warning, ...args),
    critical: (...args) => sendMessageToSentry(Sentry.Severity.Critical, ...args),
    fatal: (...args) => sendMessageToSentry(Sentry.Severity.Fatal, ...args),
    info: message => writeNonCrucialLog(message, 'info'),
    verbose: message => writeNonCrucialLog(message, 'verbose'),
};
