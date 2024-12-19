import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import appAdminStyle from "src/assets/jss/appAdminStyle";
import { solutionBluePrintStyles } from "src/components/style/solutionBluePrintStyles";
import { solutionBluePrintListStyles } from "src/components/style/listStyles";
import DownLoadSolutionBlueprint from "src/components/DownLoadSolutionBlueprint";
import SolutionBlueprintTopBar from "src/components/SolutionBlueprintTopBar";
import SolutionBlueprintList from "src/components/SolutionBlueprintList";
import FilesUpload from "src/components/FilesUpload";
import AddBlueprint from "src/components/AddBlueprint";
import { withStyles } from "@material-ui/core";
import { getDirectoryTree, setPopUp } from "store";
import CustomSnackbar from "src/components/CustomSnackbar";
import CodxCircularLoader from "src/components/CodxCircularLoader";
import { Typography } from "@material-ui/core";

function SolutionBlueprintMain({ classes, parentCurrentTheme }) {
  const dispatch = useDispatch();
  const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
  const {
    enableDownload,
    loading_blueprint,
    popup_msg,
    addBlueprint,
    saving_blueprint,
  } = solutionBluePrintData;
  useEffect(() => {
    if (!enableDownload && !addBlueprint?.getSbList) {
      dispatch(getDirectoryTree({ isGetBp: true }));
    }
  }, [enableDownload, addBlueprint]);
  return (
    <>
      <SolutionBlueprintTopBar classes={classes} />
      {!enableDownload && loading_blueprint && !addBlueprint?.showReactFlow ? (
        <div className={classes.circularLoaderContainer}>
          <CodxCircularLoader size={40} center />
          <Typography variant="h4" className={classes.loadMaskText}>
            {"Loading..."}
          </Typography>
        </div>
      ) : (
        <>
          {saving_blueprint ? (
            <div className={classes.circularLoaderContainer}>
              <CodxCircularLoader size={40} center />
              <Typography variant="h4" className={classes.loadMaskText}>
                {"Saving..."}
              </Typography>
            </div>
          ) : (
            <>
              {enableDownload && (
                <DownLoadSolutionBlueprint
                  enableDownload={enableDownload}
                  parentCurrentTheme={parentCurrentTheme}
                />
              )}
              {!enableDownload && !addBlueprint?.showReactFlow && (
                <SolutionBlueprintList />
              )}
              {addBlueprint?.showReactFlow && (
                <DownLoadSolutionBlueprint
                  enableDownload={enableDownload}
                  parentCurrentTheme={parentCurrentTheme}
                />
              )}
            </>
          )}
        </>
      )}
      <FilesUpload classes={classes} />
      <AddBlueprint classes={classes} />
      <CustomSnackbar
        open={popup_msg.open}
        message={popup_msg.message}
        autoHideDuration={5000}
        onClose={() => {
          dispatch(
            setPopUp({
              open: false,
            })
          );
        }}
        severity={popup_msg.severity}
      />
    </>
  );
}

SolutionBlueprintMain.propTypes = {
  parentCurrentTheme: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(
  (theme) => {
    return {
      ...solutionBluePrintStyles(theme),
      ...appAdminStyle(theme),
      ...solutionBluePrintListStyles(theme),
    };
  },
  { withTheme: true }
)(SolutionBlueprintMain);

