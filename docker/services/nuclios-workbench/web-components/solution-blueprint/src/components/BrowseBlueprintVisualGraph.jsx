import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Collapse from "@material-ui/core/Collapse";
import { useSpring, animated } from "@react-spring/web";
import { useDispatch, useSelector } from "react-redux";
import {
  setTreeviewNodeIds,
  setCollapseBrowseBpFilePreview,
  setShowPreview,
} from "store";
import { getPathFromNode } from "src/components/utils/utils";
import PreviewComponent from "src/components/PreviewFiles";
import BrowseBlueprintVisualGraphRenderer from "./BrowseBlueprintVisualGraphRenderer";
import { IconButton, Grid } from "@material-ui/core";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded";
import clsx from "clsx";

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  in: PropTypes.bool,
};

export default function BrowseBlueprintVisualGraph({ classes }) {
  const dispatch = useDispatch();
  const {
    treeviewNodes,
    fileShare,
    filePrefix,
    collapse_browse_bp_file_preview,
    showPreview,
  } = useSelector((state) => state.solutionBluePrint);
  const [filePath, setFilePath] = useState("");

  useEffect(() => {
    const nodeIds = extractNodeIds(treeviewNodes);
    dispatch(setTreeviewNodeIds({ nodeIds }));
  }, [treeviewNodes, dispatch]);

  function extractNodeIds(nodes, ids = []) {
    nodes.forEach((node) => {
      ids.push(node.nodeId);
      if (node.child && node.child.length > 0) {
        extractNodeIds(node.child, ids);
      }
    });
    return ids;
  }

  const onClickPreview = (e, node) => {
    if (node.icon !== "folder") {
      dispatch(setShowPreview({ show: true }));
      const file_path = `${getPathFromNode(treeviewNodes, node.nodeId)}`;
      setFilePath(file_path);
    }
  };

  const onClickCollapseScreens = (is_collapse) => {
    dispatch(setCollapseBrowseBpFilePreview(is_collapse));
  };

  return (
    <div className={classes.browseBpVisualGraphContainer}>
      {showPreview ? (
        <>
          <div className="visualGraph">
            <BrowseBlueprintVisualGraphRenderer
              classes={classes}
              onClickPreview={onClickPreview}
            />
          </div>
          <Grid item xs className={clsx(classes.browseBpReactFlowContainer)}>
            <IconButton
              onClick={() =>
                onClickCollapseScreens(!collapse_browse_bp_file_preview)
              }
              size="small"
              title={collapse_browse_bp_file_preview ? "expand" : "collapse"}
              className={classes.browseBlueprintDrawerHandle}
              aria-label="Collapse screen"
            >
              {collapse_browse_bp_file_preview ? (
                <ChevronRightRoundedIcon fontSize="large" />
              ) : (
                <ChevronLeftRoundedIcon fontSize="large" />
              )}
            </IconButton>

            <div
              className={clsx(
                collapse_browse_bp_file_preview
                  ? classes.hideScreenContainer
                  : "preview",
                classes.browseBpFilePreviewContainer
              )}
            >
              {
                <label className={classes.previewLabel}>
                  Preview: {filePath}
                </label>
              }
              <div className="previewContent">
                <PreviewComponent
                  fileShare={fileShare}
                  filePath={(filePrefix && filePrefix + "/") + filePath}
                />
              </div>
            </div>
          </Grid>
        </>
      ) : (
        <>
          <div className="visualGraph">
            <BrowseBlueprintVisualGraphRenderer
              classes={classes}
              onClickPreview={onClickPreview}
            />
          </div>
        </>
      )}
    </div>
  );
}

BrowseBlueprintVisualGraph.propTypes = {
  classes: PropTypes.object,
};
