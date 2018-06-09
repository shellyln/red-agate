// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



/** @jsx RedAgate.createElement */
import * as RedAgate from './red-agate';



export interface HtmlProps extends RedAgate.ComponentProps {
    [attrName: string]: any;
}



// tslint:disable-next-line:class-name
export class Html4_01_Strict extends RedAgate.RedAgatePhantomComponent<HtmlProps> {
    public constructor(props: HtmlProps) {
        super(props);
    }

    public render(contexts: Map<string, any>, children: string) {
        const x = RedAgate.htmlAttributesRenderer(this.props);
        return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html${
            x.attrs}>${x.children}${children}</html>`;
    }
}



// tslint:disable-next-line:class-name
export class Html4_01_Transitional extends RedAgate.RedAgatePhantomComponent<HtmlProps> {
    public constructor(props: HtmlProps) {
        super(props);
    }

    public render(contexts: Map<string, any>, children: string) {
        const x = RedAgate.htmlAttributesRenderer(this.props);
        return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html${
            x.attrs}>${x.children}${children}</html>`;
    }
}



// tslint:disable-next-line:class-name
export class Html4_01_Frameset extends RedAgate.RedAgatePhantomComponent<HtmlProps> {
    public constructor(props: HtmlProps) {
        super(props);
    }

    public render(contexts: Map<string, any>, children: string) {
        const x = RedAgate.htmlAttributesRenderer(this.props);
        return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd"><html${
            x.attrs}>${x.children}${children}</html>`;
    }
}



// tslint:disable-next-line:class-name
export class Xhtml1_0_Strict extends RedAgate.RedAgatePhantomComponent<HtmlProps> {
    public constructor(props: HtmlProps) {
        super(props);
    }

    public render(contexts: Map<string, any>, children: string) {
        const x = RedAgate.htmlAttributesRenderer(this.props);
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html${
            x.attrs}>${x.children}${children}</html>`;
    }
}



// tslint:disable-next-line:class-name
export class Xhtml1_0_Transitional extends RedAgate.RedAgatePhantomComponent<HtmlProps> {
    public constructor(props: HtmlProps) {
        super(props);
    }

    public render(contexts: Map<string, any>, children: string) {
        const x = RedAgate.htmlAttributesRenderer(this.props);
        return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html${
            x.attrs}>${x.children}${children}</html>`;
    }
}



// tslint:disable-next-line:class-name
export class Xhtml1_0_Frameset extends RedAgate.RedAgatePhantomComponent<HtmlProps> {
    public constructor(props: HtmlProps) {
        super(props);
    }

    public render(contexts: Map<string, any>, children: string) {
        const x = RedAgate.htmlAttributesRenderer(this.props);
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"><html${
            x.attrs}>${x.children}${children}</html>`;
    }
}



export class Html5 extends RedAgate.RedAgatePhantomComponent<HtmlProps> {
    public constructor(props: HtmlProps) {
        super(props);
    }

    public render(contexts: Map<string, any>, children: string) {
        const x = RedAgate.htmlAttributesRenderer(this.props);
        return `<!DOCTYPE html><html${x.attrs}>${x.children}${children}</html>`;
    }
}



export interface XmlProps extends RedAgate.ComponentProps {
    version?: string;
    encoding?: string;
}

export class Xml extends RedAgate.RedAgatePhantomComponent<XmlProps> {
    public constructor(props: XmlProps) {
        super(props);
    }

    public render(contexts: Map<string, any>, children: string) {
        return `<?xml version="${typeof this.props.version === 'string' ? this.props.version : '1.0'}" encoding="${
            typeof this.props.encoding === 'string' ? this.props.encoding : 'UTF-8'}"?>${children}`;
    }
}



export interface HtmlImpositionProps<T, S> extends RedAgate.ComponentProps {
    items: T[];
    scope?: S;
    paperWidth: number;
    paperHeight: number;
    cols: number;
    rows: number;
}

export class HtmlImposition<T, S> extends RedAgate.RedAgateComponent<HtmlImpositionProps<T, S>> {
    public constructor(props: HtmlImpositionProps<T, S>) {
        super(props);
    }

    public transform() {
        const repeater: (v: T, i: number, items: T[], scope: any) => RedAgate.RedAgateNode =
            (Array.isArray(this.props.children) ?
                (this.props.children as any[]).find(x => typeof x === 'function') :
                this.props.children) as any;
        const a: RedAgate.RedAgateNode[] = [];
        const scope = Object.assign({}, this.props.scope || {});
        for (let i = 0; i < this.props.items.length; i++) {
            a.push(
                <div style={{
                    position: 'absolute',
                    left: (this.props.paperWidth  / this.props.cols) * (i % this.props.cols),
                    top:  (this.props.paperHeight / this.props.rows) * (Math.floor(i / this.props.cols))
                }}
                >{repeater(this.props.items[i], i, this.props.items, scope)}</div>
            );
        }
        return a;
    }
}
