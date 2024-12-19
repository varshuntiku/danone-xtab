import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { withStyles } from "@material-ui/core";
import appAdminStyle from "src/assets/jss/appAdminStyle";
import { solutionBluePrintStyles } from "src/components/style/solutionBluePrintStyles";
import { Typography } from "@material-ui/core";
import clsx from "clsx";
import ReactFlowRenderer from "src/components/ReactFlowRenderer";
import BrowseBluePrints from "src/components/BrowseBluePrints";
import CustomSnackbar from "src/components/CustomSnackbar";
import LinearProgressBar from "src/components/LinearProgressBar";
import CodxCircularLoader from "src/components/CodxCircularLoader";
import { onClearCurrentBpState, setIsDownload, setPopUp } from "store";

const DownLoadSolutionBlueprint = ({
  classes,
  parentCurrentTheme,
  enableDownload,
}) => {
  const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
  const dispatch = useDispatch();
  const {
    popup_msg,
    loading_sb_download,
    zipLinkDownloadProgressCount,
    zipLinkDownloadStatus,
    show_browse_blueprint,
    is_download,
  } = solutionBluePrintData;

  useEffect(() => {
    setTimeout(() => {
      enableDownload && dispatch(onClearCurrentBpState());
    }, 10);
    if (!is_download) {
      dispatch(setIsDownload(true));
    }
  }, [is_download, onClearCurrentBpState, setIsDownload, dispatch]);

  return (
    <>
      {loading_sb_download ? (
        <div className={classes.progressBarContainer}>
          <Typography
            variant="subtitle1"
            className={clsx(classes.fontSize1, classes.currentStatusTxt)}
          >
            Current Status : <b>{zipLinkDownloadStatus}</b>
          </Typography>
          <CodxCircularLoader style={{ top: "-5rem" }} size={40} center />
          <Typography
            style={{ marginBottom: "2rem" }}
            variant="subtitle1"
            className={classes.fontSize1}
          >
            {"Downloading Files..."}
          </Typography>
          <LinearProgressBar
            variant="determinate"
            value={zipLinkDownloadProgressCount}
            className={classes.progressBar}
          />
        </div>
      ) : (
        <>
          <ReactFlowRenderer parentCurrentTheme={parentCurrentTheme} />
          {show_browse_blueprint && (
            <BrowseBluePrints classes={classes} is_download={true} />
          )}
        </>
      )}
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
};

DownLoadSolutionBlueprint.propTypes = {
  classes: PropTypes.object,
  parentCurrentTheme: PropTypes.string,
  enableDownload: PropTypes.bool,
};

export default withStyles(
  (theme) => {
    return {
      ...solutionBluePrintStyles(theme),
      ...appAdminStyle(theme),
    };
  },
  { withTheme: true }
)(DownLoadSolutionBlueprint);
