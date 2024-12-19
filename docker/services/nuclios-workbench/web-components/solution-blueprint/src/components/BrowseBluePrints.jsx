import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "src/assets/Icons/CloseBtn";
import BrowseBluePrintContent from "src/components/BrowseBluePrintContent";
import PropTypes from "prop-types";
import CodxCircularLoader from "src/components/CodxCircularLoader";
import { onCloseBrowseBlueprint } from "store";
import { getDirectoryTree } from "src/store/thunks/solutionBluePrintThunk";
function BrowseBluePrints({ classes, BASE_URL }) {
  const dispatch = useDispatch();
  const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
  const {
    show_browse_blueprint,
    loading_blueprint,
    blueprint_loaded,
    loading_blueprint_msg,
  } = solutionBluePrintData;

  const close = () => {
    dispatch(onCloseBrowseBlueprint());
  };

  useEffect(() => {
    if (!blueprint_loaded) {
        dispatch(
          getDirectoryTree({})
        );
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
            {"Browse Blueprints"}
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
        <DialogContent
          id="browse_blueprint_win"
          className={classes.dialogContent}
        >
          {loading_blueprint ? (
            <div className={classes.browseBlueprintSideBarLoadingContainer}>
              <CodxCircularLoader size={40} />
              <Typography variant="h4" className={classes.textContent}>
                {loading_blueprint_msg}
              </Typography>
            </div>
          ) : (
            <BrowseBluePrintContent classes={classes} BASE_URL={BASE_URL} />
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

BrowseBluePrints.propTypes = {
  classes: PropTypes.object,
  BASE_URL: PropTypes.string,
};

export default BrowseBluePrints;
