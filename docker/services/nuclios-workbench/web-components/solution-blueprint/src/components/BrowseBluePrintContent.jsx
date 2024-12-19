import { IconButton, Grid } from "@material-ui/core";
import clsx from "clsx";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded";
import BrowseBluePrintLists from "src/components/BrowseBluePrintLists";
import BrowseBluePrintTreeView from "src/components/BrowseBluePrintTreeView";
import BrowseBluePrintTreeViewFooter from "src/components/BrowseBluePrintTreeViewFooter";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { setCollapseBrowseBlueprintScreen } from "store";
import BrowseBlueprintVisualGraph from 'src/components/BrowseBlueprintVisualGraph';

function BrowseBluePrintContent({ classes, BASE_URL }) {
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
            onClick={() =>
              onClickCollapseScreens(!collapse_browse_blueprint_screen)
            }
            size="small"
            title={collapse_browse_blueprint_screen ? "expand" : "collapse"}
            className={classes.browseBlueprintDrawerHandle}
            aria-label="Collapse screen"
          >
            {collapse_browse_blueprint_screen ? (
              <ChevronRightRoundedIcon fontSize="large" />
            ) : (
              <ChevronLeftRoundedIcon fontSize="large" />
            )}
          </IconButton>
          {/* <BrowseBluePrintTreeView classes={classes} /> */}
          <BrowseBlueprintVisualGraph classes={classes} />
          <BrowseBluePrintTreeViewFooter
            classes={classes}
            BASE_URL={BASE_URL}
          />
        </Grid>
      </Grid>
    </>
  );
}

BrowseBluePrintContent.propTypes = {
  classes: PropTypes.object,
  BASE_URL: PropTypes.string,
};

export default BrowseBluePrintContent;
