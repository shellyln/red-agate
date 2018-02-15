// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export enum LoggerLogLevel {
    NO_LOG      = 0,

    ERROR       = 1,
    PRODUCTION  = 1,

    ASSERT      = 2,
    WARN        = 3,
    STAGING     = 3,

    INFO        = 4,
    LOG         = 5,
    DEVELOPMENT = 5,

    TRACE       = 6,
    DEBUG       = 6,
    VERBOSE     = 6
}


export class Logger {
    private static isNode: boolean;
    private static con: Console;
    public static logLevel: LoggerLogLevel;

    /** static constructor */
    // tslint:disable-next-line:variable-name
    private static __ctor = (() => {
        Logger.isNode = false;
        if (typeof process === "object") {
            if (typeof process.versions === "object") {
                if (typeof process.versions.node !== "undefined") {
                    if (typeof (process as any).type !== "undefined" && (process as any).type === "renderer") {
                        // electron renderer process
                    } else {
                        Logger.isNode = true;
                    }
                }
            }
        }

        if (Logger.isNode) {
            Logger.con = new console.Console(process.stderr);

            if (process.env.NODE_ENV) {
                switch (process.env.NODE_ENV) {
                case "production":
                    Logger.logLevel = LoggerLogLevel.PRODUCTION;
                    break;
                case "staging":
                    Logger.logLevel = LoggerLogLevel.STAGING;
                    break;
                case "development": default:
                    Logger.logLevel = LoggerLogLevel.DEVELOPMENT;
                    break;
                }
            }
        } else {
            Logger.con = console;
            Logger.logLevel = LoggerLogLevel.DEVELOPMENT;
        }
    })();

    public static assert(test?: boolean, message?: string, ...optionalParams: any[]) {
        if (this.logLevel <= LoggerLogLevel.PRODUCTION) {
            return this;
        }

        let succeeded = false;
        try {
            succeeded = Boolean(test);
        } catch (e) {
            succeeded = false;
        }

        if (!succeeded) {
            try {
                Logger.con.assert(test, message, ...optionalParams);
            } catch (e) {
                // node's assert() throws AssertionError.
                if (this.logLevel <= LoggerLogLevel.STAGING) {
                    throw e;
                }
            }

            if (this.logLevel <= LoggerLogLevel.STAGING) {
                let m = "";
                try {
                    m = String(message);
                } catch (e) {}
                throw new Error("Assertion failed:" + m);
            }
        }

        return this;
    }

    public static dir(value?: any, ...optionalParams: any[]) {
        if (this.logLevel <= LoggerLogLevel.DEBUG) {
            return this;
        }
        try {
            Logger.con.dir(value, ...optionalParams);
        } catch (e) {}
        return this;
    }

    public static error(message?: any, ...optionalParams: any[]) {
        if (this.logLevel < LoggerLogLevel.ERROR) {
            return this;
        }
        try {
            Logger.con.error(message, ...optionalParams);
        } catch (e) {}
        return this;
    }

    public static info(message?: any, ...optionalParams: any[]) {
        if (this.logLevel < LoggerLogLevel.INFO) {
            return this;
        }
        try {
            Logger.con.info(message, ...optionalParams);
        } catch (e) {}
        return this;
    }

    public static log(message?: any, ...optionalParams: any[]) {
        if (this.logLevel < LoggerLogLevel.LOG) {
            return this;
        }
        try {
            Logger.con.log(message, ...optionalParams);
        } catch (e) {}
        return this;
    }

    public static time(timerName?: string) {
        if (this.logLevel <= LoggerLogLevel.DEBUG) {
            return this;
        }
        try {
            Logger.con.time(timerName);
        } catch (e) {}
        return this;
    }

    public static timeEnd(timerName?: string) {
        if (this.logLevel <= LoggerLogLevel.DEBUG) {
            return this;
        }
        try {
            Logger.con.timeEnd(timerName);
        } catch (e) {}
        return this;
    }

    public static trace(message?: any, ...optionalParams: any[]) {
        if (this.logLevel < LoggerLogLevel.TRACE) {
            return this;
        }
        try {
            Logger.con.trace(message, ...optionalParams);
        } catch (e) {}
        return this;
    }

    public static warn(message?: any, ...optionalParams: any[]) {
        if (this.logLevel < LoggerLogLevel.WARN) {
            return this;
        }
        try {
            Logger.con.warn(message, ...optionalParams);
        } catch (e) {}
        return this;
    }
}
