// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import * as RedAgate from './red-agate';



// TODO: S formal argument type do not be applied to actual argument type on TSC 2.6.2.
//       so set S to any.
export type RepeatRepeater<S> = (times: number, scope: /*S*/any) => RedAgate.RedAgateNode;

export interface RepeatProps<S> extends RedAgate.ComponentProps {
    times: number;
    scope?: S;
    children?: RepeatRepeater<S> | RedAgate.RedAgateNode | RedAgate.RedAgateNode[];
}

export class Repeat<S> extends RedAgate.RedAgateComponent<RepeatProps<S>> {
    public constructor(props: RepeatProps<S>) {
        super(props);
    }

    public transform(): RedAgate.RedAgateNode {
        const repeater: RepeatRepeater<S> =
            (Array.isArray(this.props.children) ?
                (this.props.children as any[]).find(x => typeof x === 'function') :
                this.props.children) as any;
        const a: RedAgate.RedAgateNode[] = [];
        const scope = Object.assign({}, this.props.scope || {});
        for (let i = 0; i < this.props.times; i++) {
            a.push(repeater(i, scope));
        }
        return a;
    }
}


// TODO: T and S formal argument types do not be applied to actual argument types on TSC 2.6.2.
//       so set T and S to any.
export type ForEachRepeater<T, S> = (v: /*T*/any, i: number, items: /*T*/any[], scope: /*S*/any) => RedAgate.RedAgateNode;

export interface ForEachProps<T, S> extends RedAgate.ComponentProps {
    items: T[];
    scope?: S;
    children?: ForEachRepeater<T, S> | RedAgate.RedAgateNode | RedAgate.RedAgateNode[];
}

export class ForEach<T, S> extends RedAgate.RedAgateComponent<ForEachProps<T, S>> {
    public constructor(props: ForEachProps<T, S>) {
        super(props);
    }

    public transform() {
        const repeater: ForEachRepeater<T, S> =
            (Array.isArray(this.props.children) ?
                (this.props.children as any[]).find(x => typeof x === 'function') :
                this.props.children) as any;
        const a: RedAgate.RedAgateNode[] = [];
        const scope = Object.assign({}, this.props.scope || {});
        for (let i = 0; i < this.props.items.length; i++) {
            a.push(repeater(this.props.items[i], i, this.props.items, scope));
        }
        return a;
    }
}



export interface IfProps extends RedAgate.ComponentProps {
    condition: boolean;
}

export class If extends RedAgate.RedAgateComponent<IfProps> {
    public constructor(props: IfProps) {
        super(props);
    }

    public transform() {
        if (this.props.condition) return this.props.children;
        else return [];
    }
}



export interface DoProps extends RedAgate.ComponentProps {
}

export class Do extends RedAgate.RedAgateComponent<DoProps> {
    public constructor(props: DoProps) {
        super(props);
        const fn: () => void =
            (Array.isArray(this.props.children) ?
                (this.props.children as any[]).find(x => typeof x === 'function') :
                this.props.children) as any;
        fn();
    }

    public earlyConstruct() {}

    public transform() {
        return [];
    }

    public render(contexts: Map<string, any>, children: string) {
        return ``;
    }
}



export interface FacetProps extends RedAgate.FragmentProps {
}

export class Facet extends RedAgate.Fragment {
    public constructor(props: FacetProps) {
        super(props);
    }
}

export type TemplateProps = FacetProps;
export const Template = Facet;
