import React, { createRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  IconButton,
  useTheme,
  Button,
} from "@material-ui/core";
import PropsTypes from "prop-types";
import CloseIcon from "src/assets/Icons/CloseBtn";
import { setShowFilesUpload, uploadFiles } from "store";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as CloudUploadIconLight } from "src/assets/img/datasource-upload-icon-light.svg";
import { ReactComponent as CloudUploadIconDark } from "src/assets/img/datasource-upload-icon-dark.svg";
import CodxCircularLoader from "src/components/CodxCircularLoader";
import { getParsedData } from "src/components/utils/utils";

function FilesUpload({ classes }) {
  const dispatch = useDispatch();
  const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
  const { showFilesUpload, startUpload, addBlueprint } = solutionBluePrintData;
  const fileRef = createRef();
  const [solutionBlueprintFiles, setSolutionBlueprintFiles] = useState([]);
  const themeGlobal = useTheme();
  const { current_bp_State, last_node_position } = solutionBluePrintData;
  const { react_flow_data } = current_bp_State;

  useEffect(() => {
    setSolutionBlueprintFiles([]);
  }, [showFilesUpload]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = (e) => {
    const removedFile = e.currentTarget.getAttribute("file-name");
    const existingFiles = solutionBlueprintFiles.filter((file) => {
      return file.name !== removedFile;
    });
    setSolutionBlueprintFiles(existingFiles);
  };

  const dialogOpen = () => {
    fileRef.current.click();
  };

  const handleMultipleChange = (event) => {
    let newFiles = Array.from(event.target.files);
    setSolutionBlueprintFiles((prevFiles) => {
      const allFiles = [...prevFiles, ...newFiles];
      const uniqueFiles = allFiles.filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name)
      );
      return uniqueFiles;
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    let newFiles = Array.from(event.dataTransfer.files).filter((file) => {
      const allowedExtensions = [".py", ".ipynb", ".zip"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(`.${fileExtension}`);
    });

    setSolutionBlueprintFiles((prevFiles) => {
      const allFiles = [...prevFiles, ...newFiles];
      const uniqueFiles = allFiles.filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name)
      );

      return uniqueFiles;
    });
  };

  const renderUploadButtonIcon =
    themeGlobal.props.mode === "light" ? (
      <CloudUploadIconLight />
    ) : (
      <CloudUploadIconDark />
    );

  const uploadFilesBtnClick = () => {
    const formData = new FormData();
    solutionBlueprintFiles.forEach((file) => {
      formData.append("files", file);
    });
    const server_file_path = addBlueprint.blueprintName;
    formData.append("server_file_path", server_file_path);
    formData.append("extract_zip", true);

    dispatch(
      uploadFiles({
        formData,
        solutionBlueprintFiles,
        buildNewNodes,
      })
    );
  };

  const buildNewNodes = (new_node_name, nodeId) => {
    const nodes = getParsedData(react_flow_data.initial_nodes);
    let newNodes = [].concat(nodes);
    const newNode = {
      id: nodeId.toString(),
      position: {
        x: last_node_position.x + 100,
        y: last_node_position.y + 100,
      },
      sourcePosition: "right",
      targetPosition: "left",
      type: "DynamicCustomNodeComponent",
      deletable: true,
      selectable: true,
      data: [
        {
          value: new_node_name,
          treeNode: [],
          id: nodeId.toString(),
          isNewNode: true,
          handles: [
            {
              type: "target",
              position: "Left",
            },
            {
              type: "source",
              position: "Right",
            },
          ],
        },
      ],
    };
    newNodes.push(newNode);
    return {
      newNodes: newNode,
      availableNodes: getParsedData([...nodes]),
      lastNodeId: nodeId,
    };
  };

  return (
    <Dialog
      open={showFilesUpload}
      classes={{ paper: classes.filesUploadWin }}
      aria-labelledby="file_upload_win"
      aria-describedby="file_upload_win"
    >
      <DialogTitle
        className={classes.title}
        disableTypography
        id="file_upload_win_title"
      >
        <Typography variant="h4" className={classes.heading}>
          {"Upload Files"}
        </Typography>
        <IconButton
          title="Close"
          onClick={() => dispatch(setShowFilesUpload({ show: false }))}
          className={classes.closeIcon}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <hr className={classes.sepratorline} />
      <DialogContent id="file_upload_win" className={classes.dialogContent}>
        {startUpload ? (
          <>
            <div className={classes.loadMaskContainer}>
              <CodxCircularLoader size={40} center />
              <Typography
                style={{ marginTop: "10rem" }}
                variant="h4"
                className={classes.loadMaskText}
              >
                {"Uploading..."}
              </Typography>
            </div>
          </>
        ) : (
          <div className={classes.fileUploadMainContainer}>
            <div
              className={classes.fileField}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileRef}
                multiple={true}
                style={{ width: "0" }}
                onChange={handleMultipleChange}
                accept={".py, .ipynb, .zip"}
              />

              <div className={classes.uploadContainer}>
                <div>{renderUploadButtonIcon}</div>
                <div style={{ textAlign: "center" }}>
                  <Typography variant={"h4"}>
                    <b>Drag & Drop to Upload File</b>
                    <br />
                    <span className={classes.extensionNamesTxt}>
                      .py, .ipynb, .zip
                    </span>
                  </Typography>
                </div>
                <div>
                  <Typography variant={"h4"}>
                    <b>OR</b>
                  </Typography>
                </div>
                <div>
                  <Button
                    className={classes.browse}
                    variant="text"
                    onClick={dialogOpen}
                  >
                    Browse
                  </Button>
                </div>
              </div>
            </div>
            <Typography
              variant={"h4"}
              className={classes.uploadFilesLabel}
            >{`Uploaded Files (${solutionBlueprintFiles.length})`}</Typography>
            <div className={classes.filesListContainer}>
              {solutionBlueprintFiles.length > 0 &&
                solutionBlueprintFiles.map((file, index) => (
                  <div key={index} className={classes.fileName}>
                    <span title={file.name}>{file.name}</span>
                    <IconButton
                      title="Remove"
                      onClick={(e) => removeFile(e)}
                      className={classes.closeIcon}
                      aria-label="Close"
                      file-name={file.name}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          className={classes.btn}
          variant="outlined"
          onClick={() => dispatch(setShowFilesUpload({ show: false }))}
          aria-label="Cancel"
        >
          Cancel
        </Button>
        <Button
          className={classes.btn}
          variant="contained"
          disabled={!solutionBlueprintFiles.length || startUpload}
          onClick={uploadFilesBtnClick}
          aria-label="upload_files"
        >
          {"Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FilesUpload.propsTypes = {
  classes: PropsTypes.object,
};

export default FilesUpload;
