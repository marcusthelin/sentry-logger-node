const Sentry = require('@sentry/node');
const chalk = require('chalk');
const cliColor = require('cli-color')

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
    log(level, ...args);
    Sentry.configureScope(scope => {
        scope.setLevel(level);
        if (sendExceptionIfTheseTypes.includes(level)) {
            Sentry.captureException(message);
        } else {
            Sentry.captureMessage(message);
        }
    });
}

function log(level = 'info', ...args) {
    let color;
    switch(level) {
        case Sentry.Severity.Error:
        case Sentry.Severity.Fatal:
        case Sentry.Severity.Critical:
            color = cliColor.red;
            break;
        
        case Sentry.Severity.Warning:
            color = cliColor.yellow;
            break;
        
        case Sentry.Severity.Info:
        case 'verbose':
            color = cliColor.green;
            break;
        
        default:
            color = color = cliColor.green;
    }
    let string = args[0];
    string = `[${level}]: ${string}` 
    args.splice(0, 1);
    console.log(color(string), color(...args));
}

module.exports = {
    error: (...args) => sendMessageToSentry(Sentry.Severity.Error, ...args),
    warning: (...args) => sendMessageToSentry(Sentry.Severity.Warning, ...args),
    critical: (...args) => sendMessageToSentry(Sentry.Severity.Critical, ...args),
    fatal: (...args) => sendMessageToSentry(Sentry.Severity.Fatal, ...args),
    info: (...args) => log('info', ...args),
    verbose: (...args) => log('verbose', ...args),
};
