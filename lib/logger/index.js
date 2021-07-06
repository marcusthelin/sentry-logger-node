const Sentry = require('@sentry/node');
const cliColor = require('cli-color')
const sendExceptionIfTheseTypes = [
    Sentry.Severity.Critical,
    Sentry.Severity.Fatal,
    Sentry.Severity.Error,
];

function sendMessageToSentry(level, ...args) {
    let message;
    const clonedArgs = [...args];
    // If not an exception we set first argument as title
    if (clonedArgs.length > 1) {
        const title = clonedArgs[0];
        clonedArgs.splice(0, 1);
        message = new Error(clonedArgs.map(JSON.stringify).join(','));
        message.name = title;
    }

    // If only one argument, set message to first arg
    if (clonedArgs.length === 1) {
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
    
    console.log(color(`[${level}]:`), ...args);
}

module.exports = {
    error: (...args) => sendMessageToSentry(Sentry.Severity.Error, ...args),
    warning: (...args) => sendMessageToSentry(Sentry.Severity.Warning, ...args),
    critical: (...args) => sendMessageToSentry(Sentry.Severity.Critical, ...args),
    fatal: (...args) => sendMessageToSentry(Sentry.Severity.Fatal, ...args),
    info: (...args) => log('info', ...args),
    verbose: (...args) => log('verbose', ...args),
};
