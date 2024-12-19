import React, { useEffect, useState } from 'react';
import { Typography, Grid, Link } from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import * as _ from 'underscore';
import AppDSStoreWidgetInfo from 'components/dsWorkbench/AppDSStoreWidgetInfo.jsx';

function DSStoreArtifacts(props) {
    const { classes, state, parent_obj, ds_store_artifacts } = props;
    const [ds_store_artifacts_value, setDs_store_artifacts_value] = useState('');
    const [ds_store_artifacts_desc, setDs_store_artifacts_desc] = useState('');
    const [selected_ds_store_artifact, setSelected_ds_store_artifact] = useState(null);
    const [ds_store_artifacts_info, setDs_store_artifacts_info] = useState(false);

    useEffect(() => {
        setDs_store_artifacts_value(state.ds_store_artifacts_value);
    }, [state.ds_store_artifacts_value]);

    const renderDSStoreComponent = () => {
        const dsStoreDocsInfo = {
            name: 'DS Store Docs'
        };
        return (
            <Grid item xs={12} className={classes.codeTemplateItem}>
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
                        value={ds_store_artifacts_value || ''}
                        label="DS Store Artifacts"
                        onChange={(event) => ondsStoreArtifactFieldChange(event.target.value)}
                        MenuProps={{ className: classes.menu }}
                        inputProps={{
                            classes: {
                                input: classes.input,
                                formControl: classes.formControl
                            }
                        }}
                    >
                        {ds_store_artifacts &&
                            _.map(ds_store_artifacts, function (ds_store_artifact) {
                                return (
                                    <MenuItem
                                        key={'ds_store_artifact-' + ds_store_artifact.key}
                                        value={ds_store_artifact.key}
                                        title={`${ds_store_artifact.key} ( ${ds_store_artifact.desc} ) `}
                                    >
                                        <Typography
                                            className={clsx(classes.f1, classes.defaultColor)}
                                            variant="h5"
                                        >
                                            {ds_store_artifact.key}
                                        </Typography>
                                    </MenuItem>
                                );
                            })}
                    </Select>
                </FormControl>
                {ds_store_artifacts_value && (
                    <Link
                        component="button"
                        className={classes.viewDocs}
                        onClick={() => onClickCopyDSStoreArtifacts()}
                    >
                        Copy Code
                    </Link>
                )}
                {ds_store_artifacts_value && (
                    <Link
                        component="button"
                        className={classes.viewDocs}
                        onClick={() => onClickDsStoreViewDocs()}
                    >
                        View Docs
                    </Link>
                )}
                {ds_store_artifacts_info && ds_store_artifacts_value && (
                    <AppDSStoreWidgetInfo
                        parent_obj={parent_obj}
                        widget_info={dsStoreDocsInfo}
                        closeCallback={() => onCloseDsStoreViewDocs()}
                        classes={classes}
                        appId={state.app_id}
                        selected_ds_store_artifact={selected_ds_store_artifact}
                        ds_store_artifacts_value={ds_store_artifacts_value}
                        ondsStoreArtifactFieldChange={ondsStoreArtifactFieldChange}
                        onClickCopyDSStoreArtifacts={onClickCopyDSStoreArtifacts}
                    />
                )}
            </Grid>
        );
    };

    const ondsStoreArtifactFieldChange = (field_value, setShowDsPreview) => {
        const selectedObj = ds_store_artifacts.filter((item) => item.key === field_value);
        setDs_store_artifacts_value(field_value);
        setDs_store_artifacts_desc(selectedObj[0].desc);
        setSelected_ds_store_artifact(selectedObj[0]);
        if (setShowDsPreview) setShowDsPreview(false);
    };

    const onClickCopyDSStoreArtifacts = () => {
        navigator.clipboard.writeText(ds_store_artifacts_desc);
    };

    const onClickDsStoreViewDocs = () => {
        setDs_store_artifacts_info(true);
    };

    const onCloseDsStoreViewDocs = () => {
        setDs_store_artifacts_info(false);
    };

    return <>{renderDSStoreComponent()}</>;
}

export default DSStoreArtifacts;
