import React, { useState } from 'react';
import clsx from 'clsx';
import { Collapse, IconButton, Typography, Box, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import { DeleteOutline } from '@material-ui/icons';
import { setBpState } from 'store';
import { getParsedData } from 'components/dsWorkbench/solutionBluePrint/utils';
import { NodeResizeControl } from '@xyflow/react';

const ExpandableBox = ({ boxHeader, boxData, classes, item }) => {
    const dispatch = useDispatch();
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const { selected_nodes, current_bp_State } = solutionBluePrintData;
    const { react_flow_data } = current_bp_State;

    const [expanded, setExpanded] = useState(false);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    let showDleteIcon = false;
    selected_nodes.forEach((node) => {
        if (item.id === node.id) showDleteIcon = true;
    });

    const onDeleteIconClick = () => {
        let available_nodes = getParsedData(react_flow_data.available_nodes).filter((node) => {
            return node.id !== item.id;
        });
        let new_nodes = getParsedData(react_flow_data.new_nodes).filter((node) => {
            return node.id !== item.id;
        });
        react_flow_data.available_nodes.forEach((rNode) => {
            available_nodes.forEach((eNode) => {
                if (eNode.id === rNode.id) {
                    eNode.position = rNode.position;
                }
            });
        });

        dispatch(
            setBpState({
                type: 'deleteNode',
                available_nodes,
                new_nodes,
                removed_node: item
            })
        );
    };

    return (
        <Box className={clsx(classes.root)}>
            <Box className={classes.nodeHeaderContainer}>
                <div className={classes.nodeHeader}>
                    <Typography variant="h4" className={clsx(classes.customNodeTitle, classes.h4)}>
                        {boxHeader}
                    </Typography>
                    {showDleteIcon && (
                        <ConfirmPopup
                            title={<span>Delete Folder</span>}
                            subTitle={
                                <>
                                    Are you sure you want to Delete <b>{item.value}</b> folder ?
                                </>
                            }
                            cancelText="No"
                            confirmText="Yes"
                            onConfirm={(e) => {
                                e.stopPropagation();
                                onDeleteIconClick(item);
                            }}
                        >
                            {(triggerConfirm) => (
                                <IconButton
                                    title="Delete Folder"
                                    onClick={triggerConfirm}
                                    aria-label="delete_folder"
                                    className={classes.deleteIcon}
                                >
                                    <DeleteOutline fontSize="large" style={{ color: 'red' }} />
                                </IconButton>
                            )}
                        </ConfirmPopup>
                    )}
                </div>

                <IconButton
                    size="large"
                    aria-expanded={expanded}
                    onClick={(event) => {
                        event.stopPropagation();
                        setExpanded(!expanded);
                    }}
                >
                    <ExpandMoreIcon
                        className={clsx(classes.expandIcon, classes.expand, {
                            [classes.expandOpen]: expanded
                        })}
                        onClick={handleToggle}
                    />
                </IconButton>
            </Box>

            <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit
                className={classes.collapseContainer}
            >
                <Grid
                    container
                    spacing={2}
                    className={classes.expanded}
                    onClick={(event) => event.stopPropagation()}
                >
                    <Grid item xs={12} sm={4}>
                        <Typography>{boxData}</Typography>
                    </Grid>
                </Grid>
            </Collapse>
            <NodeResizeControl minWidth={220} minHeight={70}></NodeResizeControl>
        </Box>
    );
};

export default ExpandableBox;
