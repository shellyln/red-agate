// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export interface WritableArrayLike<T> {
    readonly length: number;
    [n: number]: T;
}
