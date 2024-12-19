import React, { useContext, useEffect, useState } from 'react';
import CustomSnackbar from '../../CustomSnackbar';
import PackageEditor from '../Package/PackageEditor';
import BulkUpdate from '../BulkPackageEditor/BulkUpdate';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { StyledTableCell } from '../Styles/ExecutionEnvStyles';
import PackageList from '../Package/PackageList';
import ErrorPackages from '../Package/ErrorPackages';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CustomLoadMask from 'components/CustomLoadMask';
import clsx from 'clsx';
import ExecutionEnvironmentContext from '../context/ExecutionEnvironmentContext';

let tempPackageLists = [];

function ExecutionEnvironmentConfigurator(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const execEnvContextData = execEnvContext.data;
    const { error_in_name, envWinTitle } = execEnvContextData;
    const [packageLists, setPackageLists] = useState([]);
    const [onDeleteClicked, setOnDeleteClicked] = useState(false);
    const { classes, componentConfig } = props;
    const [state, setState] = useState({
        open: false,
        packageLists: execEnvContextData.packageLists || [],
        details: execEnvContextData.details || {}
    });

    useEffect(() => {
        setPackageLists(tempPackageLists);
    }, [onDeleteClicked]);

    useEffect(() => {
        setPackageLists(execEnvContextData.packageLists);
    }, [execEnvContextData.packageLists, execEnvContextData.isAddNewPack]);

    const setShowPackUpdateWin = (value) => {
        execEnvContext.updateContext({
            showPackUpdateWin: value
        });
    };

    const cancel = () => {
        componentConfig.setOpen(false);
        handleUpdateResponse('Cancelled Successfully', 'warning');
    };

    const close = () => {
        componentConfig.setOpen(false);
    };

    const cancelUpdatePackage = () => {
        setShowPackUpdateWin(false);
    };

    const handleUpdateResponse = (message, severity = 'success') => {
        if (severity === 'error') {
            execEnvContext.updateContext({
                snackbar: {
                    open: true,
                    message: message,
                    severity: severity
                }
            });
        } else {
            execEnvContext.updateContext({
                snackbar: {
                    open: true,
                    message: message,
                    severity: severity
                },
                details: execEnvContextData.details
            });
        }
    };

    const addNewPack = () => {
        execEnvContext.updateContext({
            isAddNewPack: true,
            disableExecEnvName: true,
            packageList: {
                name: '',
                version: ''
            }
        });
        setShowPackUpdateWin(true);
    };

    const onEditPackage = (row) => {
        execEnvContext.updateContext({
            isAddNewPack: false,
            disableExecEnvName: error_in_name,
            packageList: {
                name: row.name,
                version: row.version
            }
        });
        setShowPackUpdateWin(true);
    };

    const onDeletePackage = (row) => {
        const updatedPackLists = execEnvContextData.packageLists.filter((item) => {
            return item.name !== row.name;
        });
        tempPackageLists = updatedPackLists;
        setOnDeleteClicked((prevState) => !prevState);
        execEnvContext.updateContext({
            packageLists: updatedPackLists
        });
    };

    const showBulkEdit = () => {
        const formattedPackageList = execEnvContextData.packageLists
            .map((pkg) => `${pkg.name} == ${pkg.version}`)
            .join('\n');
        execEnvContext.updateContext({
            packageListForEditor: formattedPackageList,
            showBulkEditCmp: true
        });
    };

    const cancelShowBulkUpdate = () => {
        execEnvContext.updateContext({
            showBulkEditCmp: false
        });
    };

    const config = {
        state,
        setState,
        setShowPackUpdateWin,
        cancelUpdatePackage,
        showBulkEdit,
        cancel,
        close,
        cancelShowBulkUpdate,
        onEditPackage,
        onDeletePackage,
        addNewPack
    };

    return (
        <React.Fragment>
            {!error_in_name && (
                <IconButton
                    key={1}
                    title
                    onClick={() => {
                        componentConfig.setOpen(true);
                    }}
                    disabled={props.disabled}
                    className={
                        props.disabled
                            ? clsx(classes.iconBtn, classes.disabledIcon)
                            : classes.iconBtn
                    }
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            )}

            <Dialog
                key={3}
                open={componentConfig.state.open}
                fullWidth
                classes={{ paper: classes.paper }}
                maxWidth="md"
                aria-labelledby="visualization-execution-env"
                aria-describedby="environment-content"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="visualization-execution-env"
                >
                    <Typography variant="h4" className={classes.heading}>
                        {envWinTitle}
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={close}
                        className={classes.closeIcon}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                {execEnvContextData.isListLoading ? (
                    <CustomLoadMask loadMaskMsg={execEnvContextData.loadMaskMsg} />
                ) : (
                    <DialogContent id="environment-content" className={classes.dialogContent}>
                        <div className={classes.main} key={1}>
                            <div className={classes.dialogSubTitle}>
                                <CustomTextField
                                    key="name"
                                    parent_obj={props}
                                    field_info={{
                                        label: 'Environment Name',
                                        id: 'environment_name',
                                        fullWidth: true,
                                        required: true,
                                        value: execEnvContextData.details.name,
                                        disabled: !error_in_name,
                                        onChange: (value) => {
                                            execEnvContext.updateContext({
                                                details: {
                                                    ...execEnvContextData.details,
                                                    name: value.trim()
                                                }
                                            });
                                            execEnvContext.updateContext({
                                                newEnvName: value.trim(),
                                                showCreateNewEnv: true,
                                                disableCreateExecEnvBtn: !value.trim(),
                                                packageLists: execEnvContextData.packageLists,
                                                execEnvName: value.trim()
                                            });
                                        }
                                    }}
                                />
                                <Typography variant="h4" style={{ color: 'red' }}>
                                    {execEnvContextData.execEnvWinMessage}
                                </Typography>
                                <div className={classes.dialogSubTitleHeader}>
                                    <Typography variant="h4">Available Packages : </Typography>
                                    <div>
                                        <Button
                                            className={classes.btn}
                                            variant="contained"
                                            onClick={showBulkEdit}
                                            aria-label="BulkEdit"
                                        >
                                            Bulk Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <TableContainer component={Paper} className={classes.tableContainer}>
                                <Table stickyHeader aria-label="caption table">
                                    <caption>
                                        <Button
                                            className={classes.btn}
                                            variant="outlined"
                                            onClick={addNewPack}
                                            aria-label="AddNewPackage"
                                            fullWidth={true}
                                            startIcon={<AddCircleOutlineOutlinedIcon />}
                                        >
                                            Add New Package
                                        </Button>
                                    </caption>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell className={classes.halfWidth}>
                                                Name
                                            </StyledTableCell>
                                            <StyledTableCell>Version</StyledTableCell>
                                            <StyledTableCell>Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {packageLists.map((row) => (
                                            <React.Fragment key={row.name}>
                                                <PackageList
                                                    key={row.name}
                                                    classes={classes}
                                                    props={config}
                                                    error_in_name={false}
                                                    row={row}
                                                />

                                                {row.error && (
                                                    <ErrorPackages
                                                        key={row.name}
                                                        row={row}
                                                        classes={classes}
                                                    />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </DialogContent>
                )}

                <DialogActions className={[classes.dialogAction, classes.customDialogAction]}>
                    <div>
                        <Button
                            className={classes.btn}
                            variant="outlined"
                            onClick={cancel}
                            aria-label="Cancel"
                        >
                            Cancel
                        </Button>
                        <Button
                            className={classes.btn}
                            variant="contained"
                            onClick={() => {
                                execEnvContext.updateContext({
                                    loadMaskMsg: 'Updating Environment...',
                                    packageLists: execEnvContextData.packageLists
                                });
                                componentConfig.addOrCreateEnv();
                            }}
                            aria-label="add_update_Environment"
                            disabled={execEnvContextData.disableCreateExecEnvBtn}
                        >
                            {envWinTitle}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
            <PackageEditor props={config} classes={classes} />
            <CustomSnackbar
                open={execEnvContextData.snackbar.open}
                message={execEnvContextData.snackbar.message}
                autoHideDuration={3000}
                onClose={() => {
                    execEnvContext.updateContext({
                        snackbar: {
                            open: false
                        }
                    });
                }}
                severity={execEnvContextData.snackbar.severity}
            />
            <BulkUpdate props={config} classes={classes} />
        </React.Fragment>
    );
}

export default ExecutionEnvironmentConfigurator;
