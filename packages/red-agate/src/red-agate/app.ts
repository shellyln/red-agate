

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

export interface AwsLambdaContext {
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

export type AwsLambda = (event: any, context: AwsLambdaContext, callback: (error: any | null, result: any | null) => void) => void;


export class App {
    private static lambdas = new Map<string, AwsLambda>();
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

    public static route(name: string, lambda: AwsLambda) {
        App.lambdas.set(name, lambda);
        return this;
    }

    public static run(context: any, lambda?: AwsLambda) {
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