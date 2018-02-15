// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export interface Monoid<T> {
    /**
     * absorbing element
     */
    ZERO: T ;
    /**
     * identity element
     */
    ID: T ;
    /**
     * NaN value
     */
    NaN: T ;

    /**
     * normalize a value
     */
    normalize(x: T): T;
    /**
     * check value is NaN
     */
    isNaN(x: T): boolean;

    /**
     * compare element and return true if x equals to y
     * eq(v,v)     -> true
     * eq(NaN,NaN) -> false
     */
    eq(x: T, y: T): boolean;
    /**
     * compare element and return false if x equals to y
     */
    noteq(x: T, y: T): boolean;

    /**
     * left inverse (x^-1)
     */
    invL(x: T): T ;

    /**
     * right inverse (x^-1)
     */
    invR(x: T): T ;

    /**
     * binary operator (x*y)
     */
    op(x: T, y: T): T ;
}


/**
 *
 */
export interface Ring<T> {
    /**
     * additive identity element
     */
    ZERO: T ;
    /**
     * multiplicative identity element
     */
    ONE: T ;
    /**
     * NaN value
     */
    NaN: T ;

    /**
     * normalize a value
     */
    normalize(x: T): T;
    /**
     * check value is NaN
     */
    isNaN(x: T): boolean;

    /**
     * compare element and return true if x equals to y
     * eq(v,v)     -> true
     * eq(NaN,NaN) -> false
     */
    eq(x: T, y: T): boolean;
    /**
     * compare element and return false if x equals to y
     */
    noteq(x: T, y: T): boolean;

    /**
     * negate; additive inverse (-x)
     */
    neg(x: T): T ;

    /**
     * addition (x+y)
     */
    add(x: T, y: T): T ;
    /**
     * subtraction (x-y)
     */
    sub(x: T, y: T): T ;
    /**
     * multiplication (x*y)
     */
    mul(x: T, y: T): T ;
    /**
     * modulation (x%y)
     */
    mod(x: T, y: T): T ;
    /**
     * division (x/y)
     *             ? = div(x,ZERO) ; depends on field definition
     * mul(x,inv(y)) = div(x,y)    ;  when  y != ZERO
     */
    divmod(x: T, y: T): {q: T, r: T, divisible: boolean} ;

    /**
     * exponentiation (a^x)
     *   y = pow(a,x)
     *   x = log(a,y)
     * ONE = pow(a,0)
     *   a = pow(a,1)
     */
    pow(a: T, x: number): T;
    /**
     * pow(ALPHA,x) = exp(x)
     *          ONE = exp(0)
     *        ALPHA = exp(1)
     */
    exp(x: number): T;
}


/**
 * commutative field
 */
export interface Field<T> extends Ring<T> {
    /**
     * inverse; multiplicative inverse (1/x)
     *    ? = inv(ZERO)  ;  depends on field definition
     *  ONE = x * inv(x) ;  when  x != ZERO
     */
    inv(x: T): T ;
    /**
     * division (x/y)
     *             ? = div(x,ZERO) ; depends on field definition
     * mul(x,inv(y)) = div(x,y)    ;  when  y != ZERO
     */
    div(x: T, y: T): T ;
    /**
     * logarithm (log_a x)
     * y = log(a,x)
     * x = pow(a,y)
     * 0 = log(a,ONE)
     * 1 = log(a,a)
     */
    log(a: T, x: T): number;
    /**
     * logarithmus naturalis
     * log(ALPHA,x) = ln(x)
     *            0 = ln(ONE)
     *            1 = ln(ALPHA)
     */
    ln(x: T): number;
}


/**
 *
 */
export interface FiniteField<T> extends Field<T> {
    checkGenerationResult(): boolean;

    /**
     * generator element, base of ln()
     */
    ALPHA: T;
    /**
     * order of this field
     */
    MODULO: number;
}


/**
 *
 */
export interface PolynomialRing<T, V> extends Ring<T> {
    field: Field<V>;

    listPx(nth: number): T[];
    getAt(x: T, index: number): V;
    setAt(x: T, index: number, v: V): T;
    slice(x: T, start: number, end: number): T;
    map(x: T, fn: (x: V) => V): T;
    mapToSelf(x: T, fn: (x: V) => V): T;
    newNthPolynomial(n: number): T;

    // override base interface and define overloads.
    // mod(x: T, y: T): T ;
    mod(x: T, y: T, extendDividendLength?: number): T ;
    // divmod(x: T, y: T): {q: T, r: T, divisible: boolean} ;
    divmod(x: T, y: T, extendDividendLength?: number): {q: T, r: T, divisible: boolean} ;
}
