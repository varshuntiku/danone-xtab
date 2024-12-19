import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import appAdminCodeEditorStyle from 'assets/jss/appAdminCodeEditorStyle.jsx';
import { Typography } from '@material-ui/core';
import Editor, { loader } from '@monaco-editor/react';
import nl2br from 'react-newline-to-break';

loader.config({
    paths: {
        vs: '/monaco-editor/min/vs'
    }
});

class AppAdminCodeEditor extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            code: props.code || '',
            selected_section: props.showTest ? 'TEST' : 'OUTPUT',
            test: props.test || '',
            output: props.output || false,
            timetaken: props.timetaken || false,
            logs: props.logs || false,
            size: props.size || false
        };
    }

    onChangeCode = (code_string) => {
        // Update state immediately for better UI responsiveness
        this.setState({ code: code_string });
        // Use the debounced function for the callback
        this.props.onChangeCodeCallback(code_string);
    };

    onChangeTestCode = (code_string) => {
        const { onChangeTestCodeCallback } = this.props;
        this.setState({ test: code_string });
        onChangeTestCodeCallback(code_string);
    };

    onClickSection = (selected_section) => {
        this.setState({ selected_section });
    };

    componentDidUpdate(prevProps) {
        const { output, timetaken, size, logs, code, test } = this.props;

        if (output !== prevProps.output) {
            this.setState({ output: output || false });
        }

        if (timetaken !== prevProps.timetaken) {
            this.setState({ timetaken: timetaken || false });
        }

        if (size !== prevProps.size) {
            this.setState({ size: size || false });
        }

        if (logs !== prevProps.logs) {
            this.setState({ logs: logs || false });
        }

        if (code !== prevProps.code) {
            this.setState({ code: code || '' });
        }

        if (test !== prevProps.test) {
            this.setState({ test: test || '' });
        }
    }

    render() {
        const { classes, is_light, extraClasses, showTest, language } = this.props;
        const { selected_section, code, test, output, timetaken, logs, size } = this.state;

        const extra_bkgd_classname = is_light
            ? classes.codeEditorLightStyle
            : classes.codeEditorDarkStyle;
        const extra_border_classname = is_light
            ? classes.codeSectionsLightBorder
            : classes.codeSectionsDarkBorder;

        return (
            <div className={classes.codeAccordionContainer}>
                <div
                    className={clsx(
                        classes.codeEditorBody,
                        extra_bkgd_classname,
                        extraClasses.editorSection
                    )}
                >
                    <Editor
                        key={'code_editor'}
                        width="100%"
                        language={'python'}
                        theme={
                            localStorage.getItem('codx-products-theme') === 'dark'
                                ? 'vs-dark'
                                : 'vs'
                        }
                        value={code}
                        options={{
                            selectOnLineNumbers: true,
                            minimap: { enabled: false },
                            readOnly: this.props.readOnly
                        }}
                        onChange={this.onChangeCode}
                    />
                    <br />
                </div>
                {(!language || language === 'python') && (
                    <>
                        <div className={clsx(classes.codeSectionsToolbar, extra_border_classname)}>
                            {showTest && (
                                <Typography
                                    variant="h6"
                                    className={
                                        selected_section === 'TEST'
                                            ? classes.codeSectionsHeaderSelected
                                            : classes.codeSectionsHeader
                                    }
                                    onClick={() => this.onClickSection('TEST')}
                                >
                                    {this.props.testLabel || 'TEST'}
                                </Typography>
                            )}
                            <Typography
                                variant="h6"
                                className={
                                    selected_section === 'OUTPUT'
                                        ? classes.codeSectionsHeaderSelected
                                        : classes.codeSectionsHeader
                                }
                                onClick={() => this.onClickSection('OUTPUT')}
                            >
                                OUTPUT
                            </Typography>
                            <Typography
                                variant="h6"
                                className={
                                    selected_section === 'DEBUG'
                                        ? classes.codeSectionsHeaderSelected
                                        : classes.codeSectionsHeader
                                }
                                onClick={() => this.onClickSection('DEBUG')}
                            >
                                DEBUG
                            </Typography>
                            <Typography
                                variant="h6"
                                className={
                                    selected_section === 'PERF'
                                        ? classes.codeSectionsHeaderSelected
                                        : classes.codeSectionsHeader
                                }
                                onClick={() => this.onClickSection('PERF')}
                            >
                                PERFORMANCE
                            </Typography>
                        </div>
                        {selected_section === 'TEST' && (
                            <div
                                className={clsx(
                                    classes.codeTinyEditorBody,
                                    extra_bkgd_classname,
                                    extraClasses.outputSection
                                )}
                            >
                                <Editor
                                    key={'test_editor'}
                                    width="100%"
                                    language="python"
                                    theme={
                                        localStorage.getItem('codx-products-theme') === 'dark'
                                            ? 'vs-dark'
                                            : 'vs'
                                    }
                                    value={test}
                                    options={{
                                        selectOnLineNumbers: true,
                                        minimap: { enabled: false }
                                    }}
                                    onChange={this.onChangeTestCode}
                                />
                                <br />
                            </div>
                        )}
                        {selected_section === 'OUTPUT' && (
                            <div
                                className={clsx(
                                    classes.codeSmallEditorBody,
                                    extra_bkgd_classname,
                                    extraClasses.outputSection
                                )}
                            >
                                <Editor
                                    key={'output_editor'}
                                    width="100%"
                                    language="json"
                                    theme={
                                        localStorage.getItem('codx-products-theme') === 'dark'
                                            ? 'vs-dark'
                                            : 'vs'
                                    }
                                    value={output ? JSON.stringify(output, null, 2) : ''}
                                    readOnly
                                    options={{
                                        selectOnLineNumbers: true,
                                        minimap: { enabled: false }
                                    }}
                                />
                                <br />
                            </div>
                        )}
                        {selected_section === 'DEBUG' && (
                            <div
                                className={clsx(
                                    classes.codeLogsBody,
                                    extra_bkgd_classname,
                                    extraClasses.outputSection
                                )}
                            >
                                {logs && (
                                    <Typography variant="h5" className={classes.codeResponseMetric}>
                                        {nl2br(logs)}
                                    </Typography>
                                )}
                            </div>
                        )}
                        {selected_section === 'PERF' && (
                            <div
                                className={clsx(
                                    classes.codeLogsBody,
                                    extra_bkgd_classname,
                                    extraClasses.outputSection
                                )}
                            >
                                {timetaken && (
                                    <Typography variant="h5" className={classes.codeResponseMetric}>
                                        {'Timetaken: ' + timetaken + ' seconds'}
                                    </Typography>
                                )}
                                {size && (
                                    <Typography variant="h5" className={classes.codeResponseMetric}>
                                        {'Size: ' + size + ' bytes'}
                                    </Typography>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
}

AppAdminCodeEditor.propTypes = {
    classes: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired,
    onChangeCodeCallback: PropTypes.func.isRequired,
    onChangeTestCodeCallback: PropTypes.func,
    showTest: PropTypes.bool,
    is_light: PropTypes.bool,
    extraClasses: PropTypes.object,
    language: PropTypes.string,
    output: PropTypes.any,
    timetaken: PropTypes.any,
    logs: PropTypes.any,
    size: PropTypes.any,
    readOnly: PropTypes.bool,
    testLabel: PropTypes.string
};

export default withStyles(
    (theme) => ({
        ...appAdminCodeEditorStyle(theme)
    }),
    { withTheme: true }
)(AppAdminCodeEditor);
