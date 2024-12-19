import React from 'react';
import { Button } from '@material-ui/core';
import { onCloseBrowseBlueprint, onImportBtnClick, importBluePrints } from 'store';
import { useDispatch, useSelector } from 'react-redux';

function BrowseBluePrintTreeViewFooter({ classes }) {
    const dispatch = useDispatch();
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const { projectId, all_treeview_nodes, set_disable_saveBtn, current_bp_State, is_download } =
        solutionBluePrintData;
    const { react_flow_data } = current_bp_State;

    const cancel = () => {
        dispatch(onCloseBrowseBlueprint());
    };

    const onImportClick = () => {
        dispatch(onImportBtnClick());
        const payload = {
            current_state: getCurrentState(react_flow_data.available_nodes),
            import_list: all_treeview_nodes
        };
        dispatch(importBluePrints({ projectId, payload, is_download }));
    };

    const getCurrentState = (available_nodes) => {
        let current_state = [];
        available_nodes.forEach((item) => {
            if (item.data[0]?.treeNode?.length) {
                current_state.push({
                    ...item.data[0]?.treeNode?.[0],
                    selected: true,
                    position: item.position,
                    oldPosition: item.oldPosition
                });
            } else {
                current_state.push({
                    name: item.data[0].value,
                    child: item.data[0].treeNode,
                    nodeId: +item.id,
                    position: item.position,
                    oldPosition: item.oldPosition,
                    icon: 'folder',
                    selected: true,
                    parentNodeId: null
                });
            }
        });
        return current_state;
    };

    return (
        <div className={classes.browseBluePrintTreeViewFooterContainer}>
            <Button className={classes.btn} variant="outlined" onClick={cancel} aria-label="Cancel">
                Cancel
            </Button>
            <Button
                className={classes.btn}
                variant="contained"
                onClick={onImportClick}
                aria-label="add_update_Environment"
                disabled={set_disable_saveBtn}
            >
                {'Import'}
            </Button>
        </div>
    );
}

export default BrowseBluePrintTreeViewFooter;
