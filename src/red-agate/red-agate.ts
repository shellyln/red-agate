// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { Escape } from 'red-agate-util/modules/convert/Escape';



export interface RedAgateElement<P> {
    type: string | ComponentClass<P>;
    props: P;
    nodeId: number | null;
    children: RedAgateNode[];
    component: Component<P> | null;
}

/*
export interface RedAgatePortal {
    key: RedAgateKey | null;
    children: RedAgateNode;
}
*/

/* export type RedAgateKey = string | number; */
export type RedAgateText = string | number;
export type RedAgateChild = RedAgateElement<any> | RedAgateText;

// Should be Array<RedAgateNode> but type aliases cannot be recursive
export type RedAgateFragment = {} | Array<RedAgateChild | any[] | boolean>;
export type RedAgateNode = RedAgateChild | RedAgateFragment /*| RedAgatePortal*/ | string | number | boolean | null | undefined;

export interface ComponentProps {
    id?: string;
    ref?: string;
    refs?: { [refName: string]: RedAgateElement<any> };
    // key?: RedAgateKey;
    __nodeId?: number;
    styleClass?: object | string;
    style?: object | string;
    children?: RedAgateNode | RedAgateNode[];
    dangerouslySetInnerHTML?: {__html: string};
    setInnerText?: {__text: string};

    accesskey?: string;
    contenteditable?: 'true' | 'false';
    contextmenu?: string;
    dir?: string;
    draggable?: 'true' | 'false' | 'auto';
    dropzone?: 'copy' | 'move' | 'link';
    hidden?: true;
    lang?: string;
    spellcheck?: 'true' | 'false';
    tabindex?: string | number;
    title?: string;
    translate?: 'yes' | 'no';
}

export interface ComponentClass<P extends ComponentProps> {
    new (props?: P): Component<P>;
}

export interface Component<P extends ComponentProps> {
    earlyConstruct?(): void;
    transform?(): RedAgateNode;
    defer?(): Promise<any>;
    beforeRender?(contexts: Map<string, any>): void;
    render?(contexts: Map<string, any>, children: string): string;
    afterRender?(contexts: Map<string, any>): void;
}

export type ComponentFactory<P extends ComponentProps> =
    ComponentClass<P> |
    string;



declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }

        interface ElementClass extends Component<any> {
        }

        interface Element extends RedAgateElement<any> {
        }

        interface ElementAttributesProperty {
            props: any; // specify the property name to use
        }

        interface ElementChildrenAttribute {
            children: {};  // specify children name to use
        }
    }
}



const HTML_NO_CLOSE_TAGS = new Set([
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr',
    'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr',
]);



export abstract class RedAgateComponent<P extends ComponentProps> implements Component<P> {

    private savedContexts: Map<string, any>;

    // tslint:disable-next-line:no-object-literal-type-assertion
    public constructor(public props: P = {} as P) {
        this.savedContexts = new Map<string, any>();
    }

    public abstract transform(): RedAgateNode;

    public defer() {
        return Promise.resolve();
    }

    protected setContext(contexts: Map<string, any>, key: string, value: any) {
        if (this.savedContexts.has(key)) {
            throw new Error(`RedAgateComponent#setContext: the key '${key}' has already set by myself.`);
        }
        if (contexts.has(key)) {
            contexts.set(key, contexts.get(key));
        }
        contexts.set(key, value);
    }

    protected unsetContext(contexts: Map<string, any>, key: string) {
        contexts.delete(key);
        if (this.savedContexts.has(key)) {
            contexts.set(key, this.savedContexts.get(key));
            this.savedContexts.delete(key);
        }
    }

    protected getContext(contexts: Map<string, any>, key: string) {
        return contexts.get(key);
    }
}



export abstract class RedAgatePhantomComponent<P extends ComponentProps> extends RedAgateComponent<P> {
    public transform() {
        return (
            (this.props.children !== null && this.props.children !== void 0) ?
            this.props.children : []
        );
    }
}



class RedAgateSimpleComponent<P extends ComponentProps> extends RedAgateComponent<P> {
    public constructor(private fn: (props: P) => RedAgateNode, props: P) {
        super(props);
    }

    public transform(): RedAgateNode {
        return this.fn(this.props);
    }
}



function getPromises(promises: Array<Promise<any>>, element: RedAgateNode) {
    if (element === null || element === void 0) {
        return promises;
    }

    if (Array.isArray(element)) {
        element.forEach(x => getPromises(promises, x));
        return promises;
    }
    if (typeof element !== 'object') {
        return promises;
    }

    if ((element as any).component && (element as any).component.defer) {
        const el = element as RedAgateElement<any>;
        const p = (el as any).component.defer();
        if (p) promises.push(p);
    }
    if ((element as any).children) {
        getPromises(promises, (element as any).children);
    }

    return promises;
}



function buildElementProps<P extends ComponentProps>(props: P, children: RedAgateNode[]) {
    if (children) {
        if (children.length === 1) {
            props.children = children[0];
        } else if (children.length > 1) {
            props.children = children;
        }

        let refs = {};
        let hasRefs = false;
        for (const c of children) {
            if (c === null || c === void 0) {
                // do nothing
            } else if (Array.isArray(c)) {
                // do nothing
            } else if (typeof c !== 'object') {
                // do nothing
            } else {
                if ((c as RedAgateElement<P>).props) {
                    const p = (c as RedAgateElement<P>).props;
                    if (typeof p.refs === 'object') {
                        hasRefs = true;
                        refs = Object.assign(refs, p.refs);
                    }
                    if (typeof p.ref === 'string') {
                        hasRefs = true;
                        refs[p.ref] = c;
                    }
                }
            }
        }
        if (hasRefs) {
            props.refs = refs;
        }
    }
    return props;
}

export function createElement<P extends ComponentProps>(
    type: ComponentFactory<P>, props: P | null | undefined,
    ...children: RedAgateNode[]): RedAgateElement<P> {

    // tslint:disable-next-line:no-object-literal-type-assertion
    props = buildElementProps(props || ({} as P), children);

    if (typeof type === 'function') {
        return {
            type,
            props,
            nodeId: null,
            children,
            component: type.prototype.earlyConstruct && type.prototype.transform ?
                new type(props) :
                null,
        };
    }
    if (typeof type === 'string') {
        return {
            type,
            props,
            nodeId: null,
            children,
            component: null,
        };
    }

    throw new Error('createElement receives invalid parameter type.');
}

export function cloneElement(el: RedAgateElement<any>): RedAgateElement<any> {
    let props = Object.assign({}, el.props || {});
    delete props.__nodeId;

    const children = (Array.isArray(el.children) ? el.children.slice(0) : el.children);
    props = buildElementProps(props, children);

    return {
        type: el.type,
        props,
        nodeId: null,
        children,
        component: null,
    };
}



export interface TransformContext {
    counter: number;
}

function constructComponent(el: RedAgateElement<any>, transformContext: TransformContext) {
    if (el.nodeId === null || el.nodeId === void 0) {
        el.nodeId = transformContext.counter++;
        el.props.__nodeId = el.nodeId;
    }
    if (el.component === null || el.component === void 0) {
        if (typeof el.type === 'function') {
            el.component = el.type.prototype.transform ?
                new el.type(el.props) :
                new RedAgateSimpleComponent(el.type as any, el.props);
        }
    }
    return el;
}

function duplicateElement(el: RedAgateElement<any>): RedAgateElement<any> {
    return {
        type: el.type,
        props: el.props,
        nodeId: el.nodeId,
        children: (Array.isArray(el.children) ? el.children.slice(0) : el.children),
        component: el.component,
    };
}

export function transform(element: RedAgateNode, transformContext?: TransformContext): RedAgateNode {
    if (!transformContext) {
        transformContext = { counter: 0 };
    }
    if (element === null || element === void 0) {
        return element;
    } else if (Array.isArray(element)) {
        return (element
            .map(x => transform(x, transformContext))
            .filter(x => x !== null && x !== void 0)
        );
    } else if (typeof element !== 'object') {
        return element;
    }

    const el = duplicateElement(constructComponent(element as RedAgateElement<any>, transformContext));

    if (el.component && el.component.transform) {
        const z = el.component.transform();

        if (z === null || z === void 0) {
            el.children = [];
        } else if (Array.isArray(z)) {
            el.children = z;
        } else if (typeof z !== 'object') {
            el.children = [z];
        } else {
            el.children = [z];
        }
    } else if (! el.children) {
        el.children = [];
    }

    el.children = el.children
        .map(x => transform(x, transformContext))
        .filter(x => x !== null && x !== void 0);

    return el;
}



export function htmlAttributesRenderer(props: any, omitKeys?: Set<string>): {attrs: string, children: string} {
    let attrs = '';
    let children = '';

    const formatArrayProp = (prop: string | string[]) => {
        return Array.isArray(prop) ?
            prop.map((x) => Escape.html(x.toString()))
                .filter(x => x !== null && x !== void 0)
                .join(' ') :
            Escape.html(prop.toString());
    };

    for (const key of Object.getOwnPropertyNames(props)) {
        switch (key) {
            case 'styleClass': case 'class':
                attrs += ` class="${formatArrayProp(props[key])}"`;
                break;

            case 'style':
                attrs += ` style="${
                    typeof props.style === 'string' ? props.style :
                        Object.getOwnPropertyNames(props.style)
                            .filter(x => props.style[x] !== null && props.style[x] !== void 0)
                            .map(x => `${Escape.html(x)}:${Escape.html(props.style[x])};`)
                            .join('')}"`;
                break;

            case 'children': case '__nodeId':
                break;

            case 'dangerouslySetInnerHTML':
                children += props[key].__html;
                break;

            case 'setInnerText':
                children += Escape.html(props[key].__text).replace(/\r?\n/g, '<br/>').replace(/\r/g, '<br/>');
                break;

            default:
                if (omitKeys && omitKeys.has(key)) {
                    // no output
                } else if (props[key] === null || props[key] === void 0 || props[key] === false) {
                    // no output
                } else if (props[key] === true) {
                    attrs += ` ${Escape.html(key)}`;
                } else {
                    attrs += ` ${Escape.html(key)}="${formatArrayProp(props[key])}"`;
                }
        }
    }
    return {attrs, children};
}

export function htmlRenderer(element: RedAgateNode, contexts: Map<string, any>): string {
    if (element === null || element === void 0) {
        return '';
    }

    if (Array.isArray(element)) {
        return element.map(x => htmlRenderer(x, contexts)).join('');
    }
    if (typeof element !== 'object') {
        return Escape.html(element.toString());
    }
    if (!(element as any).props) {
        return Escape.html(element.toString());
    }

    const el = element as RedAgateElement<any>;
    // tslint:disable-next-line:prefer-const
    let {attrs, children} = htmlAttributesRenderer(el.props);

    if (el.component && el.component.beforeRender) {
        el.component.beforeRender(contexts);
    }

    if (el.children !== null && el.children !== void 0) {
        children += el.children.map(x => htmlRenderer(x, contexts)).join('');
    }

    let r = '';

    if (el.component && el.component.render) {
        r = el.component.render(contexts, children);
    } else if (typeof el.type === 'string') {
        const type = Escape.html(el.type);
        if ((children === '' || children === null || children === void 0) && HTML_NO_CLOSE_TAGS.has(type)) {
            r = `<${type}${attrs}/>`;
        } else {
            r = `<${type}${attrs}>${children}</${type}>`;
        }
    } else {
        r = children;
    }

    if (el.component && el.component.afterRender) {
        el.component.afterRender(contexts);
    }

    return r;
}

export function renderAsHtml(element: RedAgateNode): Promise<string> {
    const contexts = new Map<string, any>();
    const transformContext = { counter: 0 };
    const z = transform(element, transformContext);

    return (
        Promise.all(getPromises([], z))
            .then(d => htmlRenderer(z, contexts))
    );
}



export function render(
    element: RedAgateNode, container: HTMLElement,
    callback?: (html: string | null, error: any | null) => void): void {

    renderAsHtml(element)
    .then(html => {
        container.innerHTML = html;
        if (callback) callback(html, null);
    })
    .catch(error => {
        if (callback) callback(null, error);
    });
}



export function renderOnAwsLambda(
    element: RedAgateNode,
    callback: (error: any | null, result: any | null) => void): void {

    renderAsHtml(element)
    .then(html => {
        callback(null, html);
    })
    .catch(error => {
        callback(error, null);
    });
}



export function renderOnExpress(
    element: RedAgateNode,
    req: any, res: any): void {

    renderAsHtml(element)
    .then(html => {
        res.send(html);
    })
    .catch(error => {
        console.error(JSON.stringify(error));
        res.status(500).send('');
    });
}
