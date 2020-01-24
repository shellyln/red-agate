// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { default as isNode }   from './is-node';

// @ts-ignore TS7016 Could not find a declaration file
import * as requireDynamicGen_ from './commonjs/require-cjs';
const requireDynamicGen = (requireDynamicGen_ as any).default || requireDynamicGen_;

// tslint:disable-next-line:no-eval
export default isNode ? ((requireDynamicGen()) as (id: string) => any) : (id: string) => (void 0 as any);
