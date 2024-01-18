import { createLogger, format, transports } from 'winston';

const { combine, label, printf } = format;

const logFormat = printf(({ level, message, label }) => {
    let customLevel = 'Nuclear_App_Info';
    if (level === 'error') {
        customLevel = 'Nuclear_App_Error';
    } else if (level === 'warn') {
        customLevel = 'Nuclear_App_Warning';
    } else if (level === 'debug') {
        customLevel = 'Nuclear_App_Debug';
    }

    return `[${label}] ${customLevel}: ${message}`;
});

export class Logger {
    private static loggerInst = null;
    private static getLogger() {
        if (!Logger.loggerInst) {
            Logger.loggerInst = createLogger({
                format: combine(label({ label: 'nuc-wrs-user-feedback' }), logFormat),
                transports: [new transports.Console({ level: 'debug' })],
            });
        }
        return Logger.loggerInst;
    }

    static info(...args: any[]) {
        const logger = Logger.getLogger();
        logger.info(...args);
    }

    static error(...args: any[]) {
        const logger = Logger.getLogger();
        logger.error(...args);
    }

    static warn(...args: any[]) {
        const logger = Logger.getLogger();
        logger.warn(...args);
    }

    static debug(...args: any[]) {
        const logger = Logger.getLogger();
        logger.debug(...args);
    }
}
