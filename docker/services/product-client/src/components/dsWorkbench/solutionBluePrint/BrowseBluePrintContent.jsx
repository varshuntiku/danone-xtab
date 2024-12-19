import React from 'react';
import { IconButton, Grid } from '@material-ui/core';
import clsx from 'clsx';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import BrowseBluePrintLists from '../solutionBluePrint/BrowseBluePrintLists';
import BrowseBluePrintTreeViewFooter from './BrowseBluePrintTreeViewFooter';
import { setCollapseBrowseBlueprintScreen } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import BrowseBlueprintVisualGraph from 'components/dsWorkbench/solutionBluePrint/BrowseBlueprintVisualGraph';

function BrowseBluePrintContent({ classes }) {
    const dispatch = useDispatch();
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const { collapse_browse_blueprint_screen } = solutionBluePrintData;
    const onClickCollapseScreens = (is_collapse) => {
        dispatch(setCollapseBrowseBlueprintScreen(is_collapse));
    };

    return (
        <>
            <Grid container spacing={0} className={classes.browseBlueprintContainer}>
                <Grid
                    item
                    xs="auto"
                    className={clsx(
                        classes.browseBlueprintListViewContainer,
                        collapse_browse_blueprint_screen && classes.hideScreenContainer
                    )}
                >
                    <BrowseBluePrintLists classes={classes} />
                </Grid>
                <Grid item xs className={classes.browseBlueprintTreeViewContainer}>
                    <IconButton
                        onClick={() => onClickCollapseScreens(!collapse_browse_blueprint_screen)}
                        size="small"
                        title={collapse_browse_blueprint_screen ? 'expand' : 'collapse'}
                        className={classes.browseBlueprintDrawerHandle}
                        aria-label="Collapse screen"
                    >
                        {collapse_browse_blueprint_screen ? (
                            <ChevronRightRoundedIcon fontSize="large" />
                        ) : (
                            <ChevronLeftRoundedIcon fontSize="large" />
                        )}
                    </IconButton>
                    <BrowseBlueprintVisualGraph classes={classes} />
                    <BrowseBluePrintTreeViewFooter classes={classes} />
                </Grid>
            </Grid>
        </>
    );
}

export default BrowseBluePrintContent;
