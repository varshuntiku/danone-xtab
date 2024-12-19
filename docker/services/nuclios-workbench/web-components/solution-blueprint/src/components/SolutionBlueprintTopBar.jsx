import React, { useState } from "react";
import { Button, Link, withStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import PropsTypes from "prop-types";
import {
  setBpState,
  setEnableDownload,
  setShowFilesUpload,
  setAddBlueprint,
  addFolder,
  browseBlueprints,
  onResetBtnClick,
  saveSolutionBlueprint,
  onClearCurrentBpState,
} from "store";
import ConfirmPopup from "src/components/ConfirmPopup";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { Link as RouterLink } from "react-router-dom";
import ExportSplitButton from "src/components/ExportSplitButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import {
  getParsedData,
  getEdges,
  getPayloadActions,
} from "src/components/utils/utils";

const SB_TITLE = "Solution Blueprint";

function SolutionBlueprintTopBar({ classes }) {
  const dispatch = useDispatch();
  const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
  const {
    current_bp_State,
    import_action_list,
    enableDownload,
    loading_blueprint,
    addBlueprint,
  } = solutionBluePrintData;
  const { react_flow_data } = current_bp_State;
  const [isChecked, setIsChecked] = useState(false);

  const onAddBlueprintBtnClick = () => {
    dispatch(setAddBlueprint({ show: true, getSbList: true }));
  };

  const backToBlueprintListBtnClick = () => {
    dispatch(
      setAddBlueprint({
        show: false,
        showReactFlow: false,
        getSbList: false,
        blueprintName: "",
      })
    );
    dispatch(onClearCurrentBpState({}));
  };

  const backToPlatformUtils = () => {
    dispatch(setAddBlueprint({ show: false }));
  };

  const onSaveBlueprint = () => {
    const edges = getEdges(getParsedData(react_flow_data.available_nodes), [
      ...getParsedData(react_flow_data.new_edges),
    ]);
    const blueprintName = addBlueprint?.blueprintName || "";
    const modifiedActionsList = [];
    let importActionList = [];
    getParsedData(import_action_list).forEach((list) => {
      const actionName = list.action || "";
      list?.payload?.map((subList) => {
        if (actionName === "add") {
          subList.path = `golden-bps/${blueprintName}`;
        } else {
          subList.path = `golden-bps/${blueprintName}/${subList.path}`;
        }
        return subList;
      });
      modifiedActionsList.push(list);
    });

    modifiedActionsList.forEach((item) => {
      if (item.action === "copy") {
        item.payload = item.payload.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.path === value.path)
        );
        importActionList.push(item);
      } else {
        importActionList.push(item);
      }
    });

    const getPayloadActionData = getPayloadActions(
      getParsedData(react_flow_data),
      blueprintName,
      edges,
      modifiedActionsList
    );
    dispatch(
      setBpState({
        type: "updateEdge",
        new_edges: edges,
      })
    );
    dispatch(
      setBpState({
        type: "setPayload",
        payload: getPayloadActionData,
      })
    );
    dispatch(
      saveSolutionBlueprint({
        payload: getPayloadActionData,
      })
    );
  };

  return (
    <>
      <div className={classes.navBarMain}>
        <RouterLink
          className={classes.navigationLink}
          to={"/platform-utils"}
          title={"Back To Platform Utils"}
          onClick={backToPlatformUtils}
        >
          <ArrowBackIosRoundedIcon />
          <div className={classes.backTitle}>{"Back to Platform Utils"}</div>
        </RouterLink>
        {!enableDownload && addBlueprint?.showReactFlow && (
          <>
            <Button
              variant="contained"
              className={classes.addFolderButton}
              onClick={() => dispatch(addFolder())}
              aria-label="Add Folder"
              title="Add Folder"
            >
              + Add Folder
            </Button>
            <Button
              variant="contained"
              className={classes.addFolderButton}
              onClick={() => dispatch(setShowFilesUpload({ show: true }))}
              aria-label="Upload"
              title="Upload"
            >
              Upload
            </Button>
            <Link
              onClick={() => dispatch(browseBlueprints())}
              className={classes.link}
              disabled
            >
              Browse Blueprints
            </Link>
            <div className={classes.sb_title}>
              <span>{SB_TITLE}</span>
              {addBlueprint?.blueprintName && (
                <span className="sub_name">{`(${addBlueprint.blueprintName})`}</span>
              )}
            </div>
          </>
        )}
        {enableDownload && (
          <>
            <Button
              variant="contained"
              className={classes.addFolderButton}
              onClick={() => dispatch(addFolder())}
              aria-label="Add Folder"
              title="Add Folder"
            >
              + Add Folder
            </Button>
            <Link
              onClick={() => dispatch(browseBlueprints())}
              className={classes.link}
              disabled
            >
              Browse Blueprints
            </Link>
            <div className={classes.sb_title}>
              <span>{SB_TITLE}</span>
            </div>
          </>
        )}
        {!enableDownload && !addBlueprint?.showReactFlow && (
          <div className={`${classes.sb_title} ${classes.sb_title1}`}>
            <span>{SB_TITLE}</span>
          </div>
        )}
        <div className={classes.saveResetBtnContainer}>
          {enableDownload ? (
            <>
              <ConfirmPopup
                title={<span>Reset Blueprints</span>}
                subTitle={
                  <>
                    Your changes will be discarded, Click <b>Yes</b> to
                    proceed.?
                  </>
                }
                cancelText="No"
                confirmText="Yes"
                onConfirm={(e) => {
                  e.stopPropagation();
                  dispatch(onResetBtnClick());
                }}
              >
                {(triggerConfirm) => (
                  <Button
                    onClick={triggerConfirm}
                    variant="outlined"
                    title={"Reset"}
                    aria-label="reset"
                  >
                    Reset
                  </Button>
                )}
              </ConfirmPopup>
              <ExportSplitButton classes={classes} />
            </>
          ) : (
            <>
              {addBlueprint?.showReactFlow ? (
                <>
                  <Button
                    variant="contained"
                    className={classes.addFolderButton}
                    onClick={onSaveBlueprint}
                    aria-label="Save"
                    title="Save"
                  >
                    Save
                  </Button>
                  <ConfirmPopup
                    title={<span>Back To Blueprint List</span>}
                    subTitle={
                      <>
                        You may have unsaved changes.
                        <br /> Click <b>Yes</b> to discard any changes and go
                        back to the <b>Solution Blueprint list</b>,<br /> or{" "}
                        <b>No</b> to stay and continue editing.
                      </>
                    }
                    cancelText="No"
                    confirmText="Yes"
                    onConfirm={(e) => {
                      e.stopPropagation();
                      backToBlueprintListBtnClick();
                    }}
                  >
                    {(triggerConfirm) => (
                      <Button
                        variant={"outlined"}
                        className={classes.addFolderButton}
                        onClick={triggerConfirm}
                        aria-label={"BackToBluePrintList"}
                        title={"Back to Blueprint List"}
                      >
                        <ArrowBackIosRoundedIcon
                          style={{ marginRight: "1rem" }}
                        />
                        {"Back to Blueprint List"}
                      </Button>
                    )}
                  </ConfirmPopup>
                </>
              ) : (
                <Button
                  variant={"contained"}
                  className={classes.addFolderButton}
                  onClick={onAddBlueprintBtnClick}
                  aria-label={"AddBlueprint"}
                  title={"Add Blueprint"}
                  disabled={loading_blueprint}
                >
                  {"Add Blueprint"}
                </Button>
              )}
            </>
          )}
        </div>
        {!enableDownload && !addBlueprint?.showReactFlow ? (
          <FormGroup>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={enableDownload}
                  onChange={(e) =>
                    dispatch(setEnableDownload({ check: e.target.checked }))
                  }
                  name="download_bp_switch"
                />
              }
              labelPlacement="start"
              label={
                <span className={classes.downloadBpLabel}>
                  {"Download Blueprints"}
                </span>
              }
            />
          </FormGroup>
        ) : (
          <ConfirmPopup
            title={<span>Back To Blueprint List</span>}
            subTitle={
              <>
                {isChecked ? (
                  <>
                    You may have unsaved changes.
                    <br /> Click <b>Yes</b> to discard any changes and go to{" "}
                    <b>Download Solution Blueprint</b>,
                    <br /> or <b>No</b> to stay and continue editing.
                  </>
                ) : (
                  <>
                    Any unsaved changes will be lost. Are you sure you want to
                    exit <b>Download Solution Blueprint</b>?
                    <br /> Click <b>Yes</b> to exit{" "}
                    <b>Download Solution Blueprint</b>,
                    <br /> or <b>No</b> to stay and continue.
                  </>
                )}
              </>
            }
            cancelText="No"
            confirmText="Yes"
            onConfirm={(e) => {
              e.stopPropagation();
              dispatch(setEnableDownload({ check: isChecked }));
            }}
          >
            {(triggerConfirm) => (
              <FormGroup>
                <FormControlLabel
                  control={
                    <CustomSwitch
                      checked={enableDownload}
                      onChange={(e) => {
                        setIsChecked(e.target.checked);
                        triggerConfirm();
                      }}
                      name="download_bp_switch"
                    />
                  }
                  labelPlacement="start"
                  label={
                    <span className={classes.downloadBpLabel}>
                      {"Download Blueprints"}
                    </span>
                  }
                />
              </FormGroup>
            )}
          </ConfirmPopup>
        )}
      </div>
      <hr className={classes.sepratorline} />
    </>
  );
}

const CustomSwitch = withStyles((theme) => ({
  switchBase: {
    color: "green",
    "&$checked": {
      color: theme.palette.primary.contrastText + " !important",
    },
    "&$checked + $track": {
      backgroundColor: theme.palette.text.revamp + " !important",
    },
  },
  checked: {},
  track: {},
}))(Switch);

SolutionBlueprintTopBar.propsTypes = {
  classes: PropsTypes.object,
};

export default SolutionBlueprintTopBar;
