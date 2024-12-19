import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Typography,
    IconButton,
    Button
} from '@material-ui/core';
import PropsTypes from 'prop-types';
import CloseIcon from 'assets/Icons/CloseBtn';
import { setAddBlueprint, createBlueprint } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import CustomTextField from "src/components/CustomTextField";

function AddBlueprint({ classes, props }) {
    const dispatch = useDispatch();
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const { addBlueprint } = solutionBluePrintData;
    const [blueprintName, setBlueprintName] = useState('');

    useEffect(() => {
        if (addBlueprint?.show) {
            setBlueprintName('');
        }
    }, [addBlueprint]);

    const addBlueprintOnClick = () => {
        dispatch(setAddBlueprint({ show: false, blueprintName, showReactFlow: false,  }));
        dispatch(
            createBlueprint({
                payload: {
                    name: blueprintName
                }
            })
        );
    };

    return (
        <Dialog
            open={addBlueprint?.show}
            aria-labelledby="add_blueprint_win"
            aria-describedby="add_blueprint_win"
            maxWidth="md"
            fullWidth
            classes={{ paper: classes.addBlueprintWin }}
        >
            <DialogTitle className={classes.title} disableTypography id="add_blueprint_win_title">
                <Typography variant="h4" className={classes.heading}>
                    {'Add Blueprint'}
                </Typography>
                <IconButton
                    title="Close"
                    onClick={() => dispatch(setAddBlueprint({ show: false }))}
                    className={classes.closeIcon}
                    aria-label="Close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <hr className={classes.sepratorline} />
            <DialogContent id="add_blueprint_win" className={classes.dialogContent}>
                <CustomTextField
                    key="bp_name"
                    parent_obj={props}
                    field_info={{
                        label: 'Blueprint Name :',
                        id: 'bp_name',
                        fullWidth: true,
                        required: true,
                        value: blueprintName,
                        onChange: (value) => {
                            setBlueprintName(value);
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    className={classes.btn}
                    variant="outlined"
                    onClick={() => dispatch(setAddBlueprint({ show: false }))}
                    aria-label="Cancel"
                >
                    Cancel
                </Button>
                <Button
                    className={classes.btn}
                    variant="contained"
                    onClick={addBlueprintOnClick}
                    disabled={!blueprintName}
                    aria-label="add_blueprint"
                >
                    {'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AddBlueprint.propsTypes = {
    classes: PropsTypes.object,
    props: PropsTypes.object
};

export default AddBlueprint;
