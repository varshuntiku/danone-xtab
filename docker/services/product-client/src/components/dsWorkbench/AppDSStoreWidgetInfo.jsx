import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

import DSStoreMarkdownRenderer from 'components/dsWorkbench/DSStoreMarkdownRenderer';
import appSystemWidgetInfoStyle from 'assets/jss/appSystemWidgetInfoStyle.jsx';
import { Dialog, DialogTitle, IconButton, Typography, Grid, Link } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import * as _ from 'underscore';

import { getDsStorePreviewArtifacts, getSystemWidgetDocumentation } from 'services/screen.js';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import MarkdownRenderer from 'components/MarkdownRenderer';

function AppDSStoreWidgetInfo(props) {
    const { parent_obj, closeCallback, classes, isDialog = true, appId } = props;
    const headerText = 'Widget Documentation - ' + props.widget_info.name;
    const [loading, setLoading] = useState(true);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState({});
    const [showDsPreview, setShowDsPreview] = useState(false);
    const [selected_ds_store_artifact, setSelected_ds_store_artifact] = useState(
        props.selected_ds_store_artifact
    );
    const [tablePreviewData, setTablePreviewData] = useState([]);
    const [plotlyPreviewData, setPlotlyPreviewData] = useState({});
    const [modelPreview, setModelPreview] = useState('');
    const [previewMdFileData, setPreviewMdFileData] = useState(null);

    const hideWidgetInfo = () => {
        closeCallback();
    };

    useEffect(() => {
        getDsStorePreviewArtifactsFn();
    }, []);
    useEffect(() => {
        setSelected_ds_store_artifact(props.selected_ds_store_artifact);
        setShowDsPreview(false);
    }, [props.selected_ds_store_artifact]);

    const getDsStorePreviewArtifactsFn = () => {
        getDsStorePreviewArtifacts({
            app_id: appId,
            callback: onResponseGetDsStorePreviewArtifacts,
            payload: {
                artifact_type: selected_ds_store_artifact.type,
                artifact_name: selected_ds_store_artifact.key
            }
        });
    };

    const getDSStoreWidgetDocumentationFn = (previewResponse) => {
        getSystemWidgetDocumentation({
            md_file_name: 'dsstore_artifacts.md',
            callback: (res) => onResponseGetDSStoreWidgetDocumentation(res, previewResponse)
        });
    };

    const onResponseGetDsStorePreviewArtifacts = (response_data) => {
        if (response_data.message === 'success') {
            getDSStoreWidgetDocumentationFn(response_data);
        } else {
            setNotificationOpen(true);
            setNotification({
                message: 'Fetch to failed preview artifacts data. Try again!'
            });
            setShowDsPreview(false);
        }
    };

    const onResponseGetDSStoreWidgetDocumentation = (response_data, previewRes) => {
        setLoading(false);
        if (response_data.status === 'error') {
            setNotificationOpen(true);
            setNotification({
                message: 'Fetch to failed DS Store Artifacts Documentations data. Try again!'
            });
            setShowDsPreview(false);
        } else {
            if (selected_ds_store_artifact.type === 'dataframe') {
                setTablePreviewData(previewRes.results);
            } else if (selected_ds_store_artifact.type === 'figure') {
                setPlotlyPreviewData(previewRes.results);
            } else if (selected_ds_store_artifact.type === 'model') {
                setModelPreview(previewRes.results.message);
            }
            setPreviewMdFileData(response_data.data);
            setShowDsPreview(true);
        }
    };

    const renderDSStoreComponent = () => {
        return (
            <div className={classes.dsStoreWidgetWinFormCont}>
                <FormControl
                    fullWidth
                    className={clsx(classes.widgetConfigFormControl, classes.widgetConfigSelect)}
                >
                    <InputLabel
                        id="screen-overview-image"
                        className={classes.widgetConfigCheckboxLabel}
                    >
                        DS Store Artifacts
                    </InputLabel>
                    <Select
                        variant="filled"
                        classes={{
                            icon: classes.widgetConfigIcon
                        }}
                        labelId="screen-overview-image"
                        id="ds_store_artifacts"
                        value={props.ds_store_artifacts_value ? props.ds_store_artifacts_value : ''}
                        label="DS Store Artifacts"
                        onChange={(event) =>
                            props.ondsStoreArtifactFieldChange(event.target.value, setShowDsPreview)
                        }
                        MenuProps={{ className: classes.menu }}
                        inputProps={{
                            classes: {
                                input: classes.input,
                                formControl: classes.formControl
                            }
                        }}
                    >
                        {parent_obj.state.ds_store_artifacts &&
                            !parent_obj.state.loading_system_widgets &&
                            _.map(
                                parent_obj.state.ds_store_artifacts,
                                function (ds_store_artifact) {
                                    return (
                                        <MenuItem
                                            key={'ds_store_artifact-' + ds_store_artifact.key}
                                            value={ds_store_artifact.key}
                                            title={ds_store_artifact.desc}
                                        >
                                            <Typography
                                                className={clsx(classes.f1, classes.defaultColor)}
                                                variant="h5"
                                            >
                                                {ds_store_artifact.key}
                                            </Typography>
                                        </MenuItem>
                                    );
                                }
                            )}
                    </Select>
                </FormControl>
                {props.ds_store_artifacts_value && (
                    <div className={classes.previewBtnContainer}>
                        <Link
                            component="button"
                            className={classes.viewDocs}
                            onClick={() => props.onClickCopyDSStoreArtifacts()}
                        >
                            Copy Code
                        </Link>
                        <Link component="button" className={classes.viewDocs} onClick={showPreview}>
                            Preview
                        </Link>
                    </div>
                )}
            </div>
        );
    };

    const renderContent = (classes, isDialog, headerText) => {
        const { parent_obj } = props;
        return (
            <>
                {headerText ? (
                    <DialogTitle
                        disableTypography
                        id="widget-documentation"
                        className={classes.widgetInfoTitle}
                    >
                        <Typography variant="h2" className={classes.widgetInfoHeading}>
                            {headerText}
                        </Typography>
                        {isDialog ? (
                            <IconButton
                                title="Close"
                                onClick={() => {
                                    hideWidgetInfo();
                                }}
                                className={classes.widgetInfoActionIcon}
                            >
                                <Close fontSize="large" />
                            </IconButton>
                        ) : null}
                    </DialogTitle>
                ) : null}
                <div
                    className={classes.widgetInfoContainer}
                    style={!isDialog ? { overflow: 'visible' } : null}
                >
                    <Grid container spacing={0} className={classes.widgetInfoContainerGrid}>
                        <>
                            {!loading ? (
                                <div className={classes.dsStoreWidgetWinContainer}>
                                    {renderDSStoreComponent()}
                                    <DSStoreMarkdownRenderer
                                        classes={classes}
                                        top_parent_obj={parent_obj}
                                        tablePreviewData={tablePreviewData}
                                        plotlyPreviewData={plotlyPreviewData}
                                        modelPreview={modelPreview}
                                        showPreview={showDsPreview}
                                        selected_ds_store_artifact={selected_ds_store_artifact}
                                    ></DSStoreMarkdownRenderer>
                                    {previewMdFileData && (
                                        <>
                                            <Typography
                                                variant="h6"
                                                className={clsx(
                                                    classes.widgetInfoHeading,
                                                    classes.widgetPreviewTxt
                                                )}
                                            >
                                                {`Documentation for DS Store Artifacts`}
                                            </Typography>
                                            <MarkdownRenderer
                                                markdownContent={previewMdFileData}
                                            ></MarkdownRenderer>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <CodxCircularLoader size={60} center />
                            )}
                        </>
                    </Grid>
                </div>
            </>
        );
    };

    const showPreview = () => {
        setLoading(true);
        getDsStorePreviewArtifactsFn();
        setShowDsPreview(true);
    };

    return (
        <React.Fragment>
            <Dialog
                open={true}
                fullWidth
                classes={{ paper: classes.widgetInfoPaper }}
                maxWidth="xl"
                onClose={() => {
                    hideWidgetInfo();
                }}
                aria-labelledby="widget-documentaion"
            >
                {renderContent(classes, isDialog, headerText)}
                <CustomSnackbar
                    open={notificationOpen && notification?.message ? true : false}
                    autoHideDuration={3000}
                    onClose={() => setNotificationOpen(false)}
                    severity={notification?.severity || 'error'}
                    message={notification?.message}
                />
            </Dialog>
        </React.Fragment>
    );
}

export default withStyles(
    (theme) => ({
        ...appSystemWidgetInfoStyle(theme)
    }),
    { withTheme: true }
)(AppDSStoreWidgetInfo);
