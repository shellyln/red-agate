// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import * as RedAgate from './red-agate';



export interface RepeatProps<S> extends RedAgate.ComponentProps {
    times: number;
    scope?: S;
}

export class Repeat<S> extends RedAgate.RedAgateComponent<RepeatProps<S>> {
    public constructor(props: RepeatProps<S>) {
        super(props);
    }

    public transform(): RedAgate.RedAgateNode {
        const repeater: (times: number, scope: any) => RedAgate.RedAgateNode =
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



export interface ForEachProps<S> extends RedAgate.ComponentProps {
    items: any[];
    scope?: S;
}

export class ForEach<S> extends RedAgate.RedAgateComponent<ForEachProps<S>> {
    public constructor(props: ForEachProps<S>) {
        super(props);
    }

    public transform() {
        const repeater: (v: any, i: number, items: any[], scope: any) => RedAgate.RedAgateNode =
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
