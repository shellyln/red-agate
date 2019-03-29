// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



let isNode = false;
if (typeof process === 'object') {
    if (typeof process.versions === 'object') {
        if (typeof process.versions.node !== 'undefined') {
            if (typeof (process as any).type !== 'undefined' && (process as any).type === 'renderer') {
                // electron renderer process
            } else {
                isNode = true;
            }
        }
    }
}
export default isNode;
