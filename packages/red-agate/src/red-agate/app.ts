

export interface AwsLambdaClientContextClientInfo {
    installation_id: string;
    app_title: string;
    app_version_name: string;
    app_version_code: string;
    app_package_name: string;
}

export interface AwsLambdaClientContextEnvInfo {
    platform_version: string;
    platform: string;
    make: string;
    model: string;
    locale: string;
}

export interface AwsLambdaClientContext {
    client: AwsLambdaClientContextClientInfo;
    Custom: any | null;
    env: AwsLambdaClientContextEnvInfo;
}

export interface LambdaContext {
    callbackWaitsForEmptyEventLoop: boolean;
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: number;
    awsRequestId: string;
    logGroupName: string;
    logStreamName: string;
    identity: string | null;
    clientContext: AwsLambdaClientContext | null;
}
export type AwsLambdaContext = LambdaContext;

export type Lambda<T=any, E=any, R=any> = (event: T, context: LambdaContext, callback: (error: E | null, result: R | null) => void) => void;
export type AwsLambda = Lambda;


export class Lambdas {
    public static pipe<T1, E1, R1, E2, R2>(handler1: Lambda<T1, E1, R1>, handler2: Lambda<R1, E2, R2>): Lambda<T1, E1 | E2, R2> {
        return (event, context, callback) => {
            handler1(event, context, (error, evt2) => {
                if (error) {
                    callback(error, null);
                } else {
                    handler2(evt2 as R1, context, (err, res) => callback(err, res));
                }
            });
        };
    }
}


export class App {
    private static lambdas = new Map<string, Lambda>();
    private static suppressRun = false;

    public static cli(options: string[], handler: (opts: Map<string, string>) => void) {
        if (App.suppressRun) {
            return this;
        }

        const optsMap = new Map<string, string>();
        for (let op of options) {
            let matched = false;
            let isOptional = false;
            if (op.startsWith('?')) {
                op = op.substring(1);
                isOptional = true;
            }
            for (let arg of process.argv.slice(2)) {
                if (op.endsWith('*')) {
                    if (arg.startsWith(op.substring(0, op.length - 1))) {
                        matched = true;
                        optsMap.set(op, arg.substring(op.length - 1));
                        break;
                    }
                } else {
                    if (arg === op) {
                        matched = true;
                        optsMap.set(op, arg.substring(op.length));
                        break;
                    }
                }
            }
            if (!isOptional && !matched) {
                return this;
            }
        }

        handler(optsMap);
        App.suppressRun = true;
        return this;
    }

    public static route(name: string, lambda: Lambda) {
        App.lambdas.set(name, lambda);
        return this;
    }

    public static run(context: any, lambda?: Lambda) {
        if (App.suppressRun) {
            return;
        }

        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        let inputData = '';

        process.stdin.on('data', (chunk) => {
            inputData += chunk;
        });

        process.stdin.on('end', () => {
            const write = (data: string, exitCode: number) => {
                const done = process.stdout.write(data);
                if (done) {
                    process.exit(exitCode);
                } else {
                    process.stdout.once('drain', () => {
                        process.exit(exitCode);
                    });
                }
            };

            try {
                const event = JSON.parse(inputData);

                // tslint:disable-next-line:variable-name
                let lambda_ = lambda;
                if (! lambda_) {
                    if (event && event.eventName) {
                        lambda_ = App.lambdas.get(event.eventName);
                    }
                }

                lambda_ = lambda_ || ((evt, ctx, cb) => {
                    cb({message: `Error: event name ${(event && event.eventName) || ''} is not found.`}, null);
                });

                lambda_(event, context, (error, result) => {
                    if (error) {
                        write(String(error), -1);
                    } else {
                        write(result, 0);
                    }
                });
            } catch (e) {
                write(String(e), -1);
            }
        });
    }
}
