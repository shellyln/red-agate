
/** @jsx RedAgate.createElement */
import * as RedAgate from 'red-agate/modules/red-agate';
import { ForEach,
         Template, 
         If }        from 'red-agate/modules/red-agate/taglib';



export function propsExcept<T>(props: T, ...x: string[]) {
    let p = Object.assign({}, props);
    delete p['id'];
    delete p['ref'];
    delete p['refs'];
    delete p['__nodeId'];
    delete p['children'];
    for (let n of x) {
        delete p[n];
    }
    return p;
}


export interface FormProps extends RedAgate.ComponentProps {
    name: string;
    setState?: string;
    [propName: string]: any;
}

export class Form extends RedAgate.RedAgateComponent<FormProps> {
    public transform() {
        let props = propsExcept(this.props, 'setState');
        return (
            <Template>
                <form name={props.name} {...props}>{this.props.children}</form>
                <If condition={Boolean(this.props.setState)}>
                    <script dangerouslySetInnerHTML={{ __html:
`(function() {
    var global = Function("return this")();
    var _state = {};
    var _subscribers = [];
    var _nested = false;
    var _setState = function(state) {
        if (_nested) return;
        _nested = true;
        var canceled = false;
        for (var s of _subscribers) {
            try {
                if (s[0]) canceled = (s[0])(_state, state);
            } catch (e) {}
            if (canceled) break;
        }
        _state = Object.assign({}, _state, state);
        for (var s of _subscribers) {
            try {
                if (s[1]) (s[1])(_state, state);
            } catch (e) {}
        }
        var form = document.forms["${props.name}"];
        for (var item of form){
            try {
                if (state.hasOwnProperty(item.name)) item.value = _state[item.name];
            } catch (e) {}
        }
        _nested = false;
    };
    _setState.subscribe = function(fnWillChange, fnDidChanged) {
        _subscribers.push([fnWillChange, fnDidChanged]);
        if (fnDidChanged) fnDidChanged(_state, {});
    }
    global.${this.props.setState} = _setState;
    (function() {
        var changeHandler = function(event) {
            var st = {};
            st[event.target.name] = event.target.value;
            _setState(st);
        };
        var form = document.forms["${props.name}"];
        var state = {};
        for (var item of form){
            switch (item.nodeName) {
            case 'INPUT':
                switch (item.type) {
                case 'button': case 'reset': case 'submit':
                    item.addEventListener('click', changeHandler);
                    break;
                default:
                    item.addEventListener('change', changeHandler);
                    break;
                }
                break;
            case 'BUTTON':
                item.addEventListener('click', changeHandler);
                break;
            default:
                item.addEventListener('change', changeHandler);
                break;
            }
            state[item.name] = item.value;
        }
        _setState(state);
    })();
})();`}}/>
                </If>
            </Template>
        );
    }
}


export interface SelectProps extends RedAgate.ComponentProps {
    name: string;
    options: Array<[string, string]>;
    selected?: string;
    [propName: string]: any;
}

export class Select extends RedAgate.RedAgateComponent<SelectProps> {
    public transform() {
        let props = propsExcept(this.props, 'options', 'selected');
        return (
            <select name={props.name} {...props}>
                <ForEach items={this.props.options}> { (o, i) =>
                    <option value={o[0]} selected={o[0] === this.props.selected}>{o[1]}</option> }
                </ForEach>
            </select>
        );
    }
}


export interface InputProps extends RedAgate.ComponentProps {
    name: string;
    type: string;
    [propName: string]: any;
}

export class Input extends RedAgate.RedAgateComponent<InputProps> {
    public transform() {
        let props = propsExcept(this.props);
        return (
            <input name={props.name} {...props}/>
        );
    }
}


export interface TextAreaProps extends RedAgate.ComponentProps {
    name: string;
    [propName: string]: any;
}

export class TextArea extends RedAgate.RedAgateComponent<TextAreaProps> {
    public transform() {
        let props = propsExcept(this.props);
        return (
            <textarea name={props.name} {...props}>{this.props.children}</textarea>
        );
    }
}
