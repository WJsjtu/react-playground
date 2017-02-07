import CodeMirror from 'codemirror';
import {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/jsx/jsx.js');

require('./syntax.css');
require('./react.css');

export default class CodeMirrorEditor extends Component {

    constructor(props) {
        super(props);
        this.handleChange = ::this.handleChange;
    }

    componentDidMount() {
        this.editor = CodeMirror.fromTextArea(findDOMNode(this.refs.editor), {
            mode: 'jsx',
            lineNumbers: this.props.lineNumbers,
            lineWrapping: true,
            smartIndent: false, // javascript mode does bad things with jsx indents
            matchBrackets: true,
            theme: 'solarized-light',
            readOnly: this.props.readOnly
        });
        this.editor.on('change', this.handleChange);
    }

    componentDidUpdate() {
        if (this.props.readOnly) {
            this.editor.setValue(this.props.codeText);
        }
    }

    handleChange() {
        if (!this.props.readOnly) {
            this.props.onChange && this.props.onChange(this.editor.getValue());
        }
    }

    render() {
        return (
            <div style={this.props.style} className={this.props.className}>
                <textarea ref='editor' defaultValue={this.props.codeText}/>
            </div>
        );
    }

}

CodeMirrorEditor.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    codeText: PropTypes.string,
    lineNumbers: PropTypes.bool,
    onChange: PropTypes.func
};

CodeMirrorEditor.defaultProps = {
    lineNumbers: true
};
