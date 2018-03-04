
import * as RedAgate from 'red-agate/modules/red-agate';
import { ForEach }   from 'red-agate/modules/red-agate/taglib';



export interface FormProps extends RedAgate.ComponentProps {
    name: string;
    [propName: string]: any;
}

export class Form extends RedAgate.RedAgateComponent<FormProps> {
    public transform() {
        return (
            <form name={this.props.name} {...this.props}>{this.props.children}</form>
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
        let props = Object.assign({}, this.props);
        delete props.options;
        delete props.selected;
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
        return (
            <input name={this.props.name} {...this.props}/>
        );
    }
}


export interface TextAreaProps extends RedAgate.ComponentProps {
    name: string;
    [propName: string]: any;
}

export class TextArea extends RedAgate.RedAgateComponent<TextAreaProps> {
    public transform() {
        return (
            <textarea name={this.props.name} {...this.props}>{this.props.children}</textarea>
        );
    }
}
