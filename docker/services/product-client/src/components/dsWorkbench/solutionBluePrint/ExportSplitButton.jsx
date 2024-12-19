import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { downloadAsZip } from 'store/thunks/solutionBluePrintThunk';
import { getSaasZipLink, setZipLinkDownloadStatus, downloadAsPng } from 'store';
import { useDispatch, useSelector } from 'react-redux';

const options = ['Export as .zip', 'Export as .png'];

export default function ExportSplitButton({ classes }) {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const { current_bp_State, import_action_list } = solutionBluePrintData;
    const { react_flow_data } = current_bp_State;

    const handleClick = () => {
        if (selectedIndex === 0) {
            downloadAsZipFn();
        } else {
            downloadAsPngFn();
        }
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const downloadAsZipFn = () => {
        dispatch(
            downloadAsZip((formData) => {
                dispatch(
                    getSaasZipLink({
                        payload: formData,
                        callback: (data) => dispatch(setZipLinkDownloadStatus({ ...data }))
                    })
                );
            })
        );
    };

    const downloadAsPngFn = () => {
        let visual_graph = {
            nodes: [...react_flow_data.available_nodes],
            edges: [...react_flow_data.initial_edges]
        };
        visual_graph = JSON.stringify(visual_graph);
        const nodes = JSON.stringify(import_action_list);
        const formData = new FormData();
        formData.append('nodes', nodes);
        formData.append('visual_graph', visual_graph);
        dispatch(
            downloadAsPng({
                payload: formData
            })
        );
    };

    return (
        <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
                <ButtonGroup
                    variant="contained"
                    ref={anchorRef}
                    aria-label="split button"
                    className={classes.exportBtnGrp}
                >
                    <Button variant="contained" onClick={handleClick}>
                        {options[selectedIndex]}
                    </Button>
                    <Button aria-label="Export" onClick={handleToggle}>
                        <ArrowDropDownIcon fontSize="large" className={classes.arrowDropDownIcon} />
                    </Button>
                </ButtonGroup>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    // role={undefined}
                    transition
                    disablePortal
                    className={classes.exportBtnMenu}
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom' ? 'center top' : 'center bottom'
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={option}
                                                selected={index === selectedIndex}
                                                className={classes.dropdownItem}
                                                onClick={(event) =>
                                                    handleMenuItemClick(event, index)
                                                }
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Grid>
        </Grid>
    );
}
