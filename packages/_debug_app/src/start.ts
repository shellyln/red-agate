
import { exec } from 'child_process';



export function start(commandOrFilename: string) {
    switch (process.platform) {
        case 'darwin':
            exec('open ' + commandOrFilename);
            break;
        case 'win32':
            exec('start ' + commandOrFilename);
            break;
        default:
            exec('xdg-open ' + commandOrFilename);
            break;
    }
}
