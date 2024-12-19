import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { setSelectAll } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllUpdateCheckedNodes } from './utils';
import { updateTreeViewNodes } from 'store';

function BrowseBluePrintTreeViewTopBar({ classes }) {
    const dispatch = useDispatch();
    const { treeviewNodes } = useSelector((state) => state.solutionBluePrint);
    const [checked, setChecked] = useState(false);
    const onSelectAllChange = () => {
        setChecked((prevState) => !prevState);
        dispatch(setSelectAll({ checked: !checked }));

        const updatedTreeviewNodes = JSON.parse(JSON.stringify([].concat(treeviewNodes)));

        selectAllUpdateCheckedNodes(updatedTreeviewNodes, !checked);

        dispatch(updateTreeViewNodes({ updatedTreeviewNodes }));
    };
    return (
        <div className={classes.browseBluePrintTreeViewTopBar}>
            <FormControlLabel
                className={classes.formControlLabel}
                control={
                    <Checkbox
                        checked={checked}
                        onChange={onSelectAllChange}
                        name="select_all_checkbox"
                        size="large"
                    />
                }
                label="Select All"
            />
        </div>
    );
}

export default BrowseBluePrintTreeViewTopBar;
