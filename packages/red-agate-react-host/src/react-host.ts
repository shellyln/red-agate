
import * as RedAgate from 'red-agate/modules/red-agate';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';



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
