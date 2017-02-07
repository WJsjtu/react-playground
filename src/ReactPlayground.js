import React, {Component, PropTypes} from 'react';
import ReactDOM, {findDOMNode, unmountComponentAtNode} from 'react-dom';
import CodeMirrorEditor from './CodeMirrorEditor';

const Babel = require('babel-standalone');

export default class ReactPlayground extends Component {

    constructor(props) {
        super(props);
        this.MODES = {JSX: 'JSX', JS: 'JS'};
        this.handleCodeChange = ::this.handleCodeChange;

        this.state = {
            mode: this.MODES.JSX,
            code: this.props.codeText
        };
    }

    handleCodeChange(value) {
        this.setState({code: value});
        this.executeCode();
    }

    handleCodeModeSwitch(mode) {
        this.setState({mode: mode});
    }

    compileCode(options) {
        return this.props.transformer(this.state.code, options);
    }

    executeCode() {
        const mountNode = findDOMNode(this.refs.mount);

        try {
            unmountComponentAtNode(mountNode);
        } catch (e) {

        }

        try {
            var compiledCode;
            if (this.props.renderCode) {
                compiledCode = this.compileCode({skipES2015Transform: false});
                ReactDOM.render(
                    <CodeMirrorEditor codeText={compiledCode} readOnly={true}/>,
                    mountNode
                );
            } else {
                compiledCode = this.compileCode({skipES2015Transform: false});
                eval(compiledCode);
            }
        } catch (err) {

            console.log(err);

            clearTimeout(this.timeoutID);
            this.timeoutID = setTimeout(() => {
                ReactDOM.render(
                    <div className='playgroundError'>{err.toString()}</div>,
                    mountNode
                );
            }, 500);
        }
    }

    componentDidMount() {
        this.executeCode();
    }

    componentDidUpdate(prevProps, prevState) {
        clearTimeout(this.timeoutID);
        // execute code only when the state's not being updated by switching tab
        // this avoids re-displaying the error, which comes after a certain delay
        if (this.props.transformer !== prevProps.transformer || this.state.code !== prevState.code) {
            this.executeCode();
        }
    }

    render() {
        const isJS = this.state.mode === this.MODES.JS;

        let compiledCode = '';
        try {
            compiledCode = this.compileCode({skipES2015Transform: false});
        } catch (err) {
        }

        const JSContent = (
            <CodeMirrorEditor key='js'
                              className='playgroundStage CodeMirror-readonly'
                              onChange={this.handleCodeChange}
                              codeText={compiledCode}
                              readOnly={true}
                              lineNumbers={this.props.showLineNumbers}
            />
        );

        const JSXContent = (
            <CodeMirrorEditor key='jsx'
                              className='playgroundStage'
                              onChange={this.handleCodeChange}
                              codeText={this.state.code}
                              lineNumbers={this.props.showLineNumbers}
            />
        );

        const JSXTabClassName = 'playground-tab' + (isJS ? '' : ' playground-tab-active');
        const JSTabClassName = 'playground-tab' + (isJS ? ' playground-tab-active' : '');

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
    }
}

ReactPlayground.propTypes = {
    codeText: PropTypes.string.isRequired,
    transformer: PropTypes.func,
    renderCode: PropTypes.bool,
    showCompiledJSTab: PropTypes.bool,
    showLineNumbers: PropTypes.bool,
    editorTabTitle: PropTypes.string
};

ReactPlayground.defaultProps = {
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
