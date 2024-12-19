import React, { useContext } from 'react';
import {
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@material-ui/core';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import ExecutionEnvironmentContext from '../context/ExecutionEnvironmentContext';

function PackageEditor({ classes, props }) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const addUpdatePackage = () => {
        const currentPack = execEnvContext.data.packageList;
        const allPacks = execEnvContext.data.packageLists;
        const lastPack = allPacks.length - 1;
        let updatedPacks = [];
        if (execEnvContext.data.isAddNewPack) {
            updatedPacks = allPacks;
            updatedPacks.push({
                name: currentPack.name,
                version: currentPack.version,
                id: lastPack < 0 ? 0 : allPacks[lastPack].id + 1
            });
        } else {
            updatedPacks = allPacks.map((item) => {
                if (item.name === currentPack.name) {
                    item.version = currentPack.version;
                }
                return item;
            });
        }
        execEnvContext.updateContext({
            packageLists: updatedPacks
        });
        props.cancelUpdatePackage();
    };

    return (
        <React.Fragment>
            <Dialog
                maxWidth="md"
                fullWidth
                classes={{ paper: classes.halfWidthDialog }}
                key={4}
                open={execEnvContext.data.showPackUpdateWin}
            >
                <DialogTitle className={classes.title} disableTypography>
                    <Typography variant="h4" className={classes.heading}>
                        {execEnvContext.data.isAddNewPack ? 'Add Package' : 'Edit Package'}
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            props.setShowPackUpdateWin(false);
                        }}
                        className={classes.closeIcon}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                <DialogContent className={classes.dialogContent}>
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs={12} md={6} direction="row">
                            <CustomTextField
                                key="name"
                                parent_obj={props}
                                field_info={{
                                    label: 'Package Name',
                                    id: 'package_name',
                                    fullWidth: true,
                                    required: true,
                                    disabled: !execEnvContext.data.disableExecEnvName,
                                    onChange: (value) =>
                                        execEnvContext.updateContext({
                                            packageList: {
                                                ...execEnvContext.data.packageList,
                                                name: value.trim()
                                            }
                                        }),
                                    value: execEnvContext.data.packageList.name
                                }}
                            />
                            <CustomTextField
                                key="version"
                                parent_obj={props}
                                field_info={{
                                    label: 'Package Version',
                                    id: 'package_version',
                                    fullWidth: true,
                                    required: true,
                                    onChange: (value) =>
                                        execEnvContext.updateContext({
                                            packageList: {
                                                ...execEnvContext.data.packageList,
                                                version: value.trim()
                                            }
                                        }),
                                    value: execEnvContext.data.packageList.version
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.dialogAction}>
                    <Button
                        className={classes.btn}
                        variant="outlined"
                        onClick={props.cancelUpdatePackage}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={() => addUpdatePackage()}
                        disabled={
                            !execEnvContext.data.packageList.name ||
                            !execEnvContext.data.packageList.version
                        }
                        aria-label="AddOrUpdate"
                    >
                        {execEnvContext.data.isAddNewPack ? 'Add ' : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default PackageEditor;
