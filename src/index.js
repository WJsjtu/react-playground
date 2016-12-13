/********* Dependencies ********/
require('codemirror/lib/codemirror.css');
const CodeMirror = require('codemirror/lib/codemirror.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/jsx/jsx.js');

/********* Playground ********/

const {createElement} = React;
require('./syntax.css');
require('./react.css');

const CodeMirrorEditor = React.createClass({
    displayName: 'CodeMirrorEditor',

    propTypes: {
        lineNumbers: React.PropTypes.bool,
        onChange: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            lineNumbers: true
        };
    },

    componentDidMount: function () {

        this.editor = CodeMirror.fromTextArea(ReactDOM.findDOMNode(this.refs.editor), {
            mode: 'jsx',
            lineNumbers: this.props.lineNumbers,
            lineWrapping: true,
            smartIndent: false, // javascript mode does bad things with jsx indents
            matchBrackets: true,
            theme: 'solarized-light',
            readOnly: this.props.readOnly
        });
        this.editor.on('change', this.handleChange);
    },

    componentDidUpdate: function () {
        if (this.props.readOnly) {
            this.editor.setValue(this.props.codeText);
        }
    },

    handleChange: function () {
        if (!this.props.readOnly) {
            this.props.onChange && this.props.onChange(this.editor.getValue());
        }
    },

    render: function () {
        // wrap in a div to fully contain CodeMirror
        return (
            <div style={this.props.style} className={this.props.className}>
                <textarea ref='editor' defaultValue={this.props.codeText}/>
            </div>
        );
    }
});

const selfCleaningTimeout = {
    componentDidUpdate: function () {
        clearTimeout(this.timeoutID);
    },

    setTimeout: function () {
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout.apply(null, arguments);
    }
};

const ReactPlayground = React.createClass({
    displayName: 'ReactPlayground',

    mixins: [selfCleaningTimeout],

    MODES: {JSX: 'JSX', JS: 'JS'}, //keyMirror({JSX: true, JS: true}),

    propTypes: {
        codeText: React.PropTypes.string.isRequired,
        transformer: React.PropTypes.func,
        renderCode: React.PropTypes.bool,
        showCompiledJSTab: React.PropTypes.bool,
        showLineNumbers: React.PropTypes.bool,
        editorTabTitle: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            transformer: function (code, options) {
                var presets = ['react'];
                if (!options || !options.skipES2015Transform) {
                    presets.push('es2015');
                }
                return Babel.transform(code, {
                    presets: presets
                }).code;
            },
            editorTabTitle: 'Live JSX Editor',
            showCompiledJSTab: true,
            showLineNumbers: true
        };
    },

    getInitialState: function () {
        return {
            mode: this.MODES.JSX,
            code: this.props.codeText
        };
    },

    handleCodeChange: function (value) {
        this.setState({code: value});
        this.executeCode();
    },

    handleCodeModeSwitch: function (mode) {
        this.setState({mode: mode});
    },

    compileCode: function (options) {
        return this.props.transformer(this.state.code, options);
    },

    render: function () {
        var isJS = this.state.mode === this.MODES.JS;
        var compiledCode = '';
        try {
            compiledCode = this.compileCode({skipES2015Transform: false});
        } catch (err) {
        }

        var JSContent = React.createElement(CodeMirrorEditor, {
            key: 'js',
            className: 'playgroundStage CodeMirror-readonly',
            onChange: this.handleCodeChange,
            codeText: compiledCode,
            readOnly: true,
            lineNumbers: this.props.showLineNumbers
        });

        var JSXContent = React.createElement(CodeMirrorEditor, {
            key: 'jsx',
            onChange: this.handleCodeChange,
            className: 'playgroundStage',
            codeText: this.state.code,
            lineNumbers: this.props.showLineNumbers
        });

        var JSXTabClassName = 'playground-tab' + (isJS ? '' : ' playground-tab-active');
        var JSTabClassName = 'playground-tab' + (isJS ? ' playground-tab-active' : '');


        return (
            <div className='playground'>
                <div>
                    <div className={JSXTabClassName}
                         onClick={this.handleCodeModeSwitch.bind(this, this.MODES.JSX)}>
                        {this.props.editorTabTitle}
                    </div>
                    {this.props.showCompiledJSTab && (
                        <div className={JSTabClassName}
                             onClick={this.handleCodeModeSwitch.bind(this, this.MODES.JS)}>
                            Compiled JS
                        </div>
                    )}
                </div>
                <div className='playgroundCode'>{isJS ? JSContent : JSXContent}</div>
                <div className='playgroundPreview'>
                    <div ref='mount'></div>
                </div>
            </div>
        );
    },

    componentDidMount: function () {
        this.executeCode();
    },

    componentDidUpdate: function (prevProps, prevState) {
        // execute code only when the state's not being updated by switching tab
        // this avoids re-displaying the error, which comes after a certain delay
        if (this.props.transformer !== prevProps.transformer || this.state.code !== prevState.code) {
            this.executeCode();
        }
    },

    executeCode: function () {
        var mountNode = ReactDOM.findDOMNode(this.refs.mount);

        try {
            ReactDOM.unmountComponentAtNode(mountNode);
        } catch (e) {
        }

        try {
            var compiledCode;
            if (this.props.renderCode) {
                compiledCode = this.compileCode({skipES2015Transform: false});
                ReactDOM.render(React.createElement(CodeMirrorEditor, {
                    codeText: compiledCode,
                    readOnly: true
                }), mountNode);
            } else {
                compiledCode = this.compileCode({skipES2015Transform: false});
                eval(compiledCode);
            }
        } catch (err) {
            console.log(err);
            this.setTimeout(function () {
                ReactDOM.render(<div className='playgroundError'>{err.toString()}</div>, mountNode);
            }, 500);
        }
    }
});

window.ReactPlayground = ReactPlayground;