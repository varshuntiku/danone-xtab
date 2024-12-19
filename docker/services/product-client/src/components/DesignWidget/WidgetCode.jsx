import React from 'react';
import PropTypes from 'prop-types';

import {
    /*Dialog, */ Tabs,
    Tab,
    Typography,
    Button,
    Snackbar,
    LinearProgress
} from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';
// import NavPills from "components/NavPills/NavPills.jsx";
import AddAlert from '@material-ui/icons/AddAlert';

import { getWidgetCode } from 'services/admin.js';

import Editor, { loader } from '@monaco-editor/react';

if (loader) {
    loader.config({
        paths: {
            vs: '/monaco-editor/min/vs'
        }
    });
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Typography>{children}</Typography>}
        </div>
    );
}

class WidgetCode extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            selected_type: 0,
            code: '',
            base_code: '',
            show_saved_notification: false
        };
    }

    componentDidMount() {
        const { project_id, widget_id, base_widget_id } = this.props;

        this.setState({
            loading: true
        });

        getWidgetCode({
            project_id: project_id,
            widget_id: widget_id,
            base_widget_id: base_widget_id,
            callback: this.onResponseGetCode
        });
    }

    onResponseGetCode = (response_data) => {
        this.setState({
            code: response_data.data,
            base_code: response_data.base_data,
            loading: false
        });
    };

    closeDialog = () => {
        const { parent_obj } = this.props;

        parent_obj.closeCodeDialog();
    };

    // saveCode = () => {
    //   const { project_id, widget_id } = this.props;

    //   this.setState({
    //     loading: true
    //   });

    //   CodexDataProvider(
    //     CODEX_API_ACTION,
    //     {
    //       resource: "projects/save-code",
    //       action: project_id,
    //       callback: "onResponseSaveCode",
    //       request_data: {
    //         widget_id: widget_id,
    //         code_text: this.state.code
    //       }
    //     },
    //     this,
    //     false
    //   );
    // }

    onChangeCode = (code_text) => {
        this.setState({
            code: code_text
        });
    };

    onResponseSaveCode = () => {
        this.setState({
            show_saved_notification: true
        });

        setTimeout(
            function () {
                this.parentObj.setState({
                    show_saved_notification: false
                });
            }.bind({ parentObj: this }),
            6000
        );

        this.setState({
            loading: false
        });
    };

    onChangeType = (event, newValue) => {
        this.setState({
            selected_type: newValue
        });
    };

    render() {
        const code = this.state.code;
        const base_code = this.state.base_code;
        const editable_options = {
            selectOnLineNumbers: true
        };
        const { classes } = this.props;

        // const readonly_editable_options = {
        //   selectOnLineNumbers: true,
        //   readOnly: true
        // };

        return (
            <div className={classes.blueprintEditorTabs}>
                <Button
                    variant="outlined"
                    className={classes.blueprintBackToDesignButton}
                    onClick={this.closeDialog}
                    aria-label="Back to Design"
                >
                    <KeyboardBackspace fontSize="large" /> Back
                </Button>

                <br />
                <Tabs
                    value={this.state.selected_type}
                    onChange={this.onChangeType}
                    classes={classes.tabsContainer}
                    aria-label="widget code"
                >
                    <Tab label="Widget Factory Code" />
                    <Tab label="Blueprint Code" />
                </Tabs>
                <TabPanel
                    className={classes.blueprintEditorContainer}
                    value={this.state.selected_type}
                    index={0}
                >
                    <div className={classes.blueprintEditorBody}>
                        <Editor
                            key={'base_code_editor'}
                            width="100%"
                            height="112%"
                            language="python"
                            theme={
                                localStorage.getItem('codx-products-theme', 'dark') === 'dark'
                                    ? 'vs-dark'
                                    : 'vs'
                            }
                            value={base_code}
                            options={editable_options}
                            onChange={this.onChangeCode}
                        />
                        <br />
                    </div>
                </TabPanel>
                <TabPanel
                    className={classes.blueprintEditorContainer}
                    value={this.state.selected_type}
                    index={1}
                >
                    <div className={classes.blueprintEditorBody}>
                        <Editor
                            key={'blueprint_code_editor'}
                            width="100%"
                            height="112%"
                            language="python"
                            theme={
                                localStorage.getItem('codx-products-theme', 'dark') === 'dark'
                                    ? 'vs-dark'
                                    : 'vs'
                            }
                            value={code}
                            options={editable_options}
                            onChange={this.onChangeCode}
                        />
                        <br />
                    </div>
                </TabPanel>
                <Button
                    variant="contained"
                    className={classes.blueprintSaveCodeButton}
                    onClick={this.saveCode}
                    aria-label="Save code"
                >
                    Save code
                </Button>
                <br />
                {this.state.loading ? <LinearProgress /> : ''}
                <Snackbar
                    place="bc"
                    color="primary"
                    icon={AddAlert}
                    message={'Widget code saved successfully !'}
                    open={this.state.show_saved_notification}
                    closeNotification={() => this.setState({ show_saved_notification: false })}
                    close
                />
            </div>
        );
    }
}

WidgetCode.propTypes = {
    parent_obj: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    project_id: PropTypes.number.isRequired,
    widget_id: PropTypes.string.isRequired
};

export default WidgetCode;
