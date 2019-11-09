
import * as RedAgate from 'red-agate/modules/red-agate';

import * as React from 'react';

// NOTE: hack bad .d.ts definition for ESM.
import * as ReactDOMServer_ from 'react-dom/server';
export const ReactDOMServer: typeof ReactDOMServer_ = (ReactDOMServer_ as any).default || ReactDOMServer_;



export interface ReactHostProps<P> extends RedAgate.ComponentProps {
    element: React.ReactElement<P>;
}

export class ReactHost<P> extends RedAgate.RedAgateComponent<ReactHostProps<P>> {
    public constructor(props: ReactHostProps<P>) {
        super(props);
    }

    public transform() {
        return [];
    }

    public render() {
        return ReactDOMServer.renderToStaticMarkup(this.props.element);
    }
}
