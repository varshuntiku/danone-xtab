import React, { useContext, useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@material-ui/core';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import BulkDataEditor from './BulkDataEditor';
import { styles } from '../Styles/ExecutionEnvStyles';
import ExecutionEnvironmentContext from 'components/ExecutionEnvironment/context/ExecutionEnvironmentContext';
import clsx from 'clsx';
import PackageErrors from './PackageErrors';
import CustomLoadMask from 'components/CustomLoadMask';

function BulkUpdate({ classes, props }) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const execEnvContextData = execEnvContext.data;
    const { packageError } = execEnvContextData;
    const [editorValue, setEditorValue] = useState([]);

    useEffect(() => {
        setEditorValue(execEnvContextData.packageLists);
    }, [execEnvContextData.packageLists]);

    const handleEditorChange = (value) => {
        const lines = value.split('\n');
        let packages_ = [];
        lines.map((line, index) => {
            if (!line.trim() || line.startsWith('#')) return;
            const [name, version] = line.split('==').map((str) => str.trim());
            const urlRegex = /(https?|http):\/\/[^ ]+/;
            if (urlRegex.test(name) && (!version || version === 'custom_package_url')) {
                packages_.push({ id: index + 1, name: name, version: 'custom_package_url' });
            } else if (version) {
                packages_.push({ id: index + 1, name, version });
                return;
            }
            // packages_.push({ id: index + 1, name: name, version: "custom_package_url" })
            // return version ? { id: index + 1, name, version } : { name };
        });
        // const packages = lines
        //     .map((line, index) => {
        //         const [name, version] = line.split('==').map((str) => str.trim());
        //         return version ? { id: index + 1, name, version } : { name };
        //     })
        //     .filter((pkg) => pkg.id);
        setEditorValue(packages_);
    };

    const updateBulkUpdate = () => {
        if (execEnvContextData.packageError) {
            verifyAndUpdate();
        } else {
            execEnvContext.updateContext({
                packageLists: editorValue,
                verifyPackagesLoadMask: true
            });
            verify(editorValue);
        }
    };

    const verify = (packagelists) => {
        setEditorValue(packagelists);
        execEnvContext.verifyPackages(packagelists);
    };

    const verifyAndUpdate = () => {
        let updatedEditorValue = [];

        editorValue.forEach((pkgItem) => {
            execEnvContextData.errorPackages.forEach((errItem) => {
                if (errItem.name === pkgItem.name) {
                    pkgItem['isRemoved'] = true;
                    updatedEditorValue.push({
                        // id: pkgItem.id,
                        name: pkgItem.name,
                        version: errItem.versionValue
                    });
                } else if (!pkgItem.isRemoved) {
                    pkgItem['isRemoved'] = true;
                    updatedEditorValue.push({
                        // id: pkgItem.id,
                        name: pkgItem.name,
                        version: pkgItem.version
                    });
                }
            });
            if (!pkgItem.isRemoved) {
                updatedEditorValue.push({
                    // id: pkgItem.id,
                    name: pkgItem.name,
                    version: pkgItem.version
                });
            }
        });

        let seen = new Set();
        let uniqueUpdatedEditorValue = updatedEditorValue.reverse().filter((obj) => {
            return !seen.has(obj.name) ? seen.add(obj.name) : false;
        });

        execEnvContext.updateContext({
            packageLists: uniqueUpdatedEditorValue,
            packageError: false,
            verifyPackagesLoadMask: true
        });
        verify(uniqueUpdatedEditorValue);
    };

    const editorTheme =
        localStorage.getItem('codx-products-theme', 'dark') === 'dark' ? 'vs-dark' : 'vs';

    const editorConfig = {
        key: 'code_editor',
        width: '100%',
        language: 'txt',
        theme: editorTheme,
        value: execEnvContext.data.packageListForEditor,
        options: {
            selectOnLineNumbers: true,
            minimap: { enabled: false },
            readOnly: false
        },
        onChange: handleEditorChange
    };

    return (
        <React.Fragment>
            <Dialog
                maxWidth="md"
                fullWidth
                classes={{ paper: classes.halfWidthDialog }}
                key={4}
                open={execEnvContext.data.showBulkEditCmp}
            >
                <DialogTitle className={classes.title} disableTypography>
                    <Typography variant="h4" className={classes.heading}>
                        Bulk Manage Packages
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            props.cancelShowBulkUpdate(false);
                        }}
                        className={classes.closeIcon}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                <DialogContent className={classes.dialogContent}>
                    <div style={{ width: '100%', height: '95%' }}>
                        {execEnvContextData.verifyPackagesLoadMask ? (
                            <CustomLoadMask
                                className={classes.verifyingPackagesLoadMask}
                                loadMaskMsg={'Verifying Packages...'}
                            />
                        ) : (
                            <React.Fragment>
                                {' '}
                                {packageError ? (
                                    <PackageErrors props={props} classes={classes} />
                                ) : (
                                    <BulkDataEditor config={editorConfig} />
                                )}{' '}
                            </React.Fragment>
                        )}
                    </div>
                </DialogContent>
                <DialogActions
                    className={clsx(classes.dialogAction, classes.bulkUpdatezDialogAction)}
                >
                    {!packageError && (
                        <Button
                            className={classes.btn}
                            variant="outlined"
                            onClick={props.cancelShowBulkUpdate}
                            aria-label="Cancel"
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={updateBulkUpdate}
                        aria-label="Verify_Update"
                        disabled={execEnvContextData.verifyPackagesLoadMask}
                    >
                        {'Verify & Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(BulkUpdate);
