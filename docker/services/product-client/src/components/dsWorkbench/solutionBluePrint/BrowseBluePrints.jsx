import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from 'assets/Icons/CloseBtn';
import { onCloseBrowseBlueprint } from 'store';
import BrowseBluePrintContent from './BrowseBluePrintContent';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { getDirectoryTree } from 'store';

function BrowseBluePrints({ classes }) {
    const dispatch = useDispatch();
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const { show_browse_blueprint, loading_blueprint, blueprint_loaded, loading_blueprint_msg } =
        solutionBluePrintData;

    const close = () => {
        dispatch(onCloseBrowseBlueprint());
    };

    useEffect(() => {
        if (!blueprint_loaded) {
            dispatch(getDirectoryTree({}));
        }
    }, [blueprint_loaded]);

    return (
        <React.Fragment>
            <Dialog
                open={show_browse_blueprint}
                fullWidth
                classes={{ paper: classes.paper }}
                maxWidth="md"
                aria-labelledby="browse_blueprint_win"
                aria-describedby="browse_blueprint_win"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="visualization-execution-env"
                >
                    <Typography variant="h4" className={classes.heading}>
                        {'Browse Blueprints'}
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
                <DialogContent id="browse_blueprint_win" className={classes.dialogContent}>
                    {loading_blueprint ? (
                        <div className={classes.browseBlueprintSideBarLoadingContainer}>
                            <CodxCircularLoader size={40} />
                            <Typography variant="h4" className={classes.textContent}>
                                {loading_blueprint_msg}
                            </Typography>
                        </div>
                    ) : (
                        <BrowseBluePrintContent classes={classes} />
                    )}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default BrowseBluePrints;
