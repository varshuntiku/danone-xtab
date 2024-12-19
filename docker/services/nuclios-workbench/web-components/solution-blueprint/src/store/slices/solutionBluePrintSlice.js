import { createSlice } from "@reduxjs/toolkit";
import { selectAllUpdateCheckedNodes } from "src/components/utils/utils";
import { toPng } from "html-to-image";
import {
  importBluePrints,
  getSaasZipLink,
  downloadAsPng,
  editBlueprint,
  createBlueprint,
  saveSolutionBlueprint,
  uploadFiles,
} from "store";
import { getDirectoryTree } from "src/store/thunks/solutionBluePrintThunk";

const initialState = {
  BASE_URL: "",
  treeviewNodes: [],
  all_treeview_nodes: [],
  directories_list: [],
  on_loading: true,
  loading_blueprint: true,
  fileShare: "",
  filePrefix: "",
  loading_blueprint_msg: "Loading...",
  blueprint_loaded: false,
  show_browse_blueprint: false,
  show_default_blueprint: false,
  loading_get_directories: true,
  loading_get_directory_tree: true,
  collapse_browse_blueprint_screen: false,
  treeview_checked_nodes: [],
  treeview_node_ids: [],
  projectId: null,
  show_folder_details: false,
  new_node_name: "",
  new_nodes: [],
  new_edges: [],
  last_node_id: 1,
  last_node_position: { x: 100, y: 100 },
  set_disable: false,
  set_disable_saveBtn: true,
  adding_folder: false,
  loading_deafult_blueprint: true,
  selected_nodes: [],
  resetBtnClcked: false,
  node_deleted: false,
  on_saved: false,
  zipLinkDownloadProgressCount: 10,
  zipLinkDownloadStatus: "Copying started...",
  loading_sb_download: false,
  showPreview: false,
  collapse_browse_bp_file_preview: false,
  enableDownload: false,
  showFilesUpload: false,
  startUpload: false,
  saving_blueprint: false,
  enableEditBlueprint: {
    enable: false,
  },
  addBlueprint: {
    show: false,
    blueprintName: "",
  },
  popup_msg: {
    open: false,
    message: "",
    severity: "success",
  },
  is_save_btn_clicked: false,
  import_action_list: [],
  is_download: false,
  current_bp_State: {
    tree_view_data: {
      dir_tree: [],
    },
    react_flow_data: {
      initial_nodes: [],
      available_nodes: [],
      available_node_ids: [],
      new_nodes: [],
      removed_nodes: [],
      initial_edges: [],
      available_edges: [],
      new_edges: [],
      removed_edges: [],
    },
  },
  prev_bp_state: {},
};

const onLoadCompleted = (state, action, isFromImport) => {
  let resData = [];
  let isVisualGraph = false;
  let initial_nodes = [];
  let initial_edges =
    [...state.current_bp_State.react_flow_data.initial_edges] || [];
  const staticPos = {
    x: 100,
    y: 100,
  };
  if (isFromImport) {
    resData = action;
  } else {
    isVisualGraph =
      action.payload?.data?.visual_graph?.length > 0 &&
      action.payload.data.visual_graph[0]?.nodes.length > 0;

    resData =
      (isVisualGraph && action.payload?.data?.visual_graph) ||
      (action.payload?.data?.dir_tree?.data?.length > 0 &&
        action.payload.data.dir_tree.data) ||
      [];
  }

  if (isVisualGraph && resData.length > 0) {
    initial_nodes = resData[0].nodes.map((nodeItem) => {
      state.last_node_id = +nodeItem.id + 1;
      state.last_node_position = nodeItem.position || staticPos;
      return {
        id: nodeItem.id.toString(),
        type: "DynamicCustomNodeComponent",
        position: nodeItem.position || staticPos,
        oldPosition: nodeItem.position,
        deletable: true,
        selectable: true,
        data: [
          {
            value: nodeItem.data[0]?.value,
            treeNode:
              nodeItem.data[0]?.treeNode?.length > 0
                ? nodeItem.data[0].treeNode
                : [],
            id: nodeItem.id.toString(),
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
    });
  } else {
    const buildComponent = (item, index) => {
      initial_nodes.push({
        id: item.nodeId.toString(),
        type: "DynamicCustomNodeComponent",
        oldPosition: item.position,
        position: item.position || {
          x: 220 * index,
          y: 100,
        },
        deletable: true,
        selectable: true,
        data: [
          {
            value: item.name,
            treeNode: [item],
            id: item.nodeId.toString(),
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
      });
    };
    const filteredData = resData.filter((item) => {
      const icon = item.icon.toLowerCase();
      const name = item.name.toLowerCase();
      if (icon === "file") {
        return name.endsWith(".py") || name.endsWith(".ipynb");
      }
      if (icon === "folder") {
        return !name.startsWith(".");
      }
      if (icon === "x-zip-compressed_file") {
        return !name.startsWith(".");
      }
      if (icon === "x-python_file") {
        return true;
      }
      return false;
    });
    filteredData.forEach((item, index) => {
      state.last_node_id = +item.nodeId + 1;
      buildComponent(item, index);
    });
  }

  if (isVisualGraph && resData.length > 0 && resData[0].edges?.length > 0) {
    initial_edges = [...resData[0].edges];
  }

  state.current_bp_State = {
    ...state.current_bp_State,
    react_flow_data: {
      ...state.current_bp_State.react_flow_data,
      initial_edges,
      new_edges: [],
      new_nodes: [],
      removed_nodes: [],
      initial_nodes,
      available_nodes: initial_nodes,
      available_edges: initial_edges,
    },
  };
  state.on_loading = false;
  if (initial_nodes.length === 0) {
    state.popup_msg = {
      open: true,
      message: "There are currently no blueprints available...",
      severity: "warning",
    };
  }
};

const downloadImage = (dataUrl) => {
  const a = document.createElement("a");

  a.setAttribute("download", "solution_blueprint_image.png");
  a.setAttribute("href", dataUrl);
  a.click();
};

const startDownloadAsPng = () => {
  const element = document.querySelector(".react-flow");
  element.classList.add("download-mode");
  toPng(element, {
    backgroundColor:
      localStorage.getItem("codx-products-theme") === "light"
        ? "white"
        : "black",
  }).then((dataUrl) => {
    element.classList.remove("download-mode");
    downloadImage(dataUrl);
  });
};

const solutionBluePrintSlice = createSlice({
  name: "solutionBluePrint",
  initialState: initialState,
  reducers: {
    setAddBlueprint: (state, action) => {
      state.addBlueprint = {
        ...state.addBlueprint,
        ...action.payload,
      };
    },
    setEnableEditBlueprint: (state, action) => {
      state.enableEditBlueprint = action.payload;
    },
    setShowFilesUpload: (state, action) => {
      state.showFilesUpload = action.payload.show;
      state.startUpload = action.payload?.startUpload || false;
      if (!action.payload.show) {
        state.enableEditBlueprint = {
          enable: false,
        };
      }
    },
    setProjectId: (state, action) => {
      state.projectId = action.payload;
    },
    setPopUp: (state, action) => {
      state.popup_msg = action.payload;
    },
    addFolder: (state) => {
      state.show_folder_details = true;
      state.node_deleted = false;
    },
    browseBlueprints: (state) => {
      state.on_loading = false;
      state.treeview_checked_nodes = [];
      state.show_browse_blueprint = true;
      state.show_default_blueprint = false;
      state.blueprint_loaded = false;
      state.resetBtnClcked = false;
      state.node_deleted = false;
      state.loading_blueprint_msg = "Loading...";
    },
    defaultBlueprint: (state) => {
      state.on_loading = true;
      state.loading_blueprint_msg = "Loading default blueprint...";
      state.show_browse_blueprint = false;
      state.show_default_blueprint = true;
      state.blueprint_loaded = false;
      state.resetBtnClcked = true;
      state.node_deleted = false;
      state.popup_msg = {
        open: true,
        message:
          "Your changes will be discarded, and the default blueprint will be applied.",
        severity: "warning",
      };
      state.current_bp_State = {
        ...state.current_bp_State,
        react_flow_data: {
          initial_nodes: [],
          available_nodes: [],
          new_nodes: [],
          removed_nodes: [],
          initial_edges: [],
          available_edges: [],
          new_edges: [],
          removed_edges: [],
        },
      };
    },
    onCloseBrowseBlueprint: (state) => {
      state.on_loading = false;
      state.show_browse_blueprint = false;
    },
    setCollapseBrowseBlueprintScreen: (state, action) => {
      state.collapse_browse_blueprint_screen = action.payload;
    },
    setTreeviewChecked: (state, action) => {
      state.treeview_checked_nodes = action.payload.nodeList;
    },
    setSelectAll: (state, action) => {
      if (action.payload.checked) {
        state.treeview_checked_nodes = state.treeview_node_ids;
      } else {
        state.treeview_checked_nodes = [];
      }
    },
    setTreeviewNodeIds: (state, action) => {
      state.treeview_node_ids = action.payload.nodeIds;
    },
    updateTreeViewNodes: (state, action) => {
      state.treeviewNodes = action.payload.updatedTreeviewNodes;
    },
    updateAllTreeViewNodes: (state, action) => {
      state.all_treeview_nodes = action.payload.updatedAllTreeviewNodes;
    },
    updateTreeView: (state, action) => {
      state.treeviewNodes = action.payload;
    },
    onImportBtnClick: (state, action) => {
      state.loading_blueprint_msg = action.payload?.msg || "Importing...";
      state.loading_blueprint = true;
    },
    onResetBtnClick: (state) => {
      state.new_nodes = [];
      state.new_edges = [];
      state.set_disable = false;
      state.set_disable_saveBtn = true;
      state.resetBtnClcked = true;
      state.last_node_id = 1;
      state.current_bp_State = {
        ...state.current_bp_State,
        react_flow_data: {
          ...state.current_bp_State.react_flow_data,
          initial_edges: !state.is_download
            ? state.current_bp_State.react_flow_data.initial_edges
            : [],
          new_edges: [],
          new_nodes: [],
          removed_nodes: [],
          initial_nodes: !state.is_download
            ? state.current_bp_State.react_flow_data.initial_nodes
            : [],
          available_nodes: !state.is_download
            ? state.current_bp_State.react_flow_data.available_nodes
            : [],
        },
      };
      if (state.is_download) {
        state.import_action_list = [];
      }
    },
    setShowFolderDetails: (state, action) => {
      state.show_folder_details = action.payload;
    },
    onAddNode: (state, action) => {
      action.payload.newNodes && (state.new_nodes = action.payload.newNodes);
      action.payload.last_node_id &&
        (state.last_node_id = action.payload.last_node_id);
      state.new_node_name = "";
      action.payload.initial_edges &&
        (state.new_edges = action.payload.initial_edges);
    },
    onNewNodeFieldChange: (state, action) => {
      state.new_node_name = action.payload;
    },
    setSelectedNode: (state, action) => {
      state.selected_nodes = action.payload;
    },
    setBpState: (state, action) => {
      const type = action.payload.type;
      state.resetBtnClcked = false;
      state.is_save_btn_clicked = false;
      let existingData = { ...state.current_bp_State };
      let currentReactFlowdata = { ...existingData.react_flow_data };
      if (type === "addEdge") {
        currentReactFlowdata.new_edges = [
          ...currentReactFlowdata.new_edges,
          action.payload.new_edges,
        ];
        if (state.is_download) {
          currentReactFlowdata.initial_edges = [
            ...currentReactFlowdata.new_edges,
            action.payload.new_edges,
          ];
        }
      } else if (type === "updateEdge") {
        currentReactFlowdata.new_edges = action.payload.new_edges;
        if (state.is_download) {
          currentReactFlowdata.initial_edges = action.payload.new_edges;
        }
      } else if (type === "addNode") {
        currentReactFlowdata.new_nodes = [
          ...currentReactFlowdata.new_nodes,
          action.payload.new_nodes,
        ];
        state.import_action_list.push({
          action: "add",
          payload: [
            {
              name: action.payload.new_nodes?.data[0]?.value,
              path: action.payload.new_nodes?.data[0]?.value,
            },
          ],
        });
        currentReactFlowdata.available_nodes = [
          ...currentReactFlowdata.new_nodes,
          ...currentReactFlowdata.initial_nodes,
        ];
        if (state.is_download) {
          let available_nodes = JSON.parse(
            JSON.stringify(action.payload.available_nodes)
          ).filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.id === value.id)
          );
          currentReactFlowdata.available_nodes = available_nodes;
        }

        state.new_node_name = "";
        state.last_node_id = action.payload.last_node_id;
      } else if (type === "deleteNode") {
        currentReactFlowdata.available_nodes = action.payload.available_nodes;
        currentReactFlowdata.removed_nodes = [
          action.payload.removed_node,
          ...currentReactFlowdata.removed_nodes,
        ];
        state.import_action_list.push({
          action: "remove",
          payload: [
            {
              name: action.payload.removed_node?.value,
              path: action.payload.removed_node?.value,
            },
          ],
        });
        currentReactFlowdata.new_nodes = action.payload.new_nodes;
        state.node_deleted = true;
        if (state.is_download) {
          currentReactFlowdata.initial_nodes = action.payload.available_nodes;
        }
      } else if (type === "updateNode") {
        currentReactFlowdata.available_nodes = action.payload.available_nodes;
        state.node_deleted = false;
      } else if (type === "setPayload") {
        state.is_save_btn_clicked = true;
        currentReactFlowdata.payload = action.payload.payload;
      }
      existingData = {
        ...existingData,
        react_flow_data: currentReactFlowdata,
      };
      state.current_bp_State = { ...existingData };
    },
    onChangeResetBtnFlag: (state, action) => {
      state.resetBtnClcked = action.payload;
      state.node_deleted = action.payload;
    },
    setZipLinkDownloadStatus: (state, action) => {
      state.loading_blueprint = true;
      let progressCount = 10;
      action.payload?.data?.progress &&
        (progressCount = action.payload.data.progress);
      if (
        action.payload?.data?.message &&
        action.payload?.data?.status !== "failed"
      ) {
        state.zipLinkDownloadStatus = action.payload?.data?.message + "...";
      }
      if (action.payload?.data?.status === "failed") {
        state.popup_msg = {
          open: true,
          message: "Download Failed...",
          severity: "error",
        };
      }
      state.zipLinkDownloadProgressCount = progressCount;
      if (progressCount == 100) {
        const saas_link = action.payload?.data?.sas_link;
        if (saas_link) {
          window.location.href = saas_link.toString();
          state.popup_msg = {
            open: true,
            message: "Successfully Downloaded.",
            severity: "success",
          };
          state.loading_sb_download = false;
          const updatedAllTreeviewNodes = JSON.parse(
            JSON.stringify(state.all_treeview_nodes)
          );
          selectAllUpdateCheckedNodes(updatedAllTreeviewNodes, false);
          state.all_treeview_nodes = updatedAllTreeviewNodes;
        } else {
          state.popup_msg = {
            open: true,
            message: "Download Failed...",
            severity: "error",
          };
        }
      }
    },
    setIsDownload: (state, actions) => {
      state.is_download = actions.payload;
    },
    onClearCurrentBpState: (state) => {
      state.import_action_list = [];
      state.current_bp_State = {
        tree_view_data: {
          dir_tree: [],
        },
        react_flow_data: {
          initial_nodes: [],
          available_nodes: [],
          available_node_ids: [],
          new_nodes: [],
          removed_nodes: [],
          initial_edges: [],
          available_edges: [],
          new_edges: [],
          removed_edges: [],
        },
      };
    },
    setEnableDownload: (state, action) => {
      state.enableDownload = action.payload.check;
    },
    setShowPreview: (state, action) => {
      state.showPreview = action.payload.show;
      action.payload.show && (state.collapse_browse_bp_file_preview = false);
    },
    setCollapseBrowseBpFilePreview: (state, action) => {
      state.collapse_browse_bp_file_preview = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDirectoryTree.pending, (state) => {
        state.loading_blueprint = true;
        state.set_disable = true;
        state.set_disable_saveBtn = true;
        state.loading_blueprint_msg = "Loading...";
      })
      .addCase(getDirectoryTree.fulfilled, (state, action) => {
        const treeViewData =
          action.payload?.data?.dir_tree || action.payload?.data || [];
        state.fileShare = action.payload?.data?.file_share_name;
        state.filePrefix = action.payload?.data?.file_prefix;
        state.loading_blueprint = false;
        state.all_treeview_nodes = treeViewData?.data;
        state.directories_list = treeViewData?.data?.map((item) => {
          return {
            name: item.name,
            id: item.nodeId,
            status: item.status || "Not Verified",
          };
        });
        if (treeViewData?.data?.length > 0) {
          state.treeviewNodes = [treeViewData.data[0]];
        }
        state.set_disable = false;
        state.set_disable_saveBtn = false;
        state.treeview_checked_nodes = [];
        state.showPreview = false;
        state.enableEditBlueprint = {
          enable: false,
        };
      })
      .addCase(getDirectoryTree.rejected, (state) => {
        state.loading_blueprint = false;
        state.set_disable = false;
        state.set_disable_saveBtn = true;
        state.showPreview = false;
        state.popup_msg = {
          open: true,
          message: "Failed to fetch blueprints...",
          severity: "error",
        };
        state.enableEditBlueprint = {
          enable: false,
        };
      })
      .addCase(importBluePrints.pending, (state) => {
        state.set_disable = true;
        state.set_disable_saveBtn = true;
      })
      .addCase(importBluePrints.fulfilled, (state, action) => {
        state.show_browse_blueprint = false;
        state.on_loading = false;
        state.set_disable_saveBtn = false;
        state.set_disable = false;
        if (
          action.payload?.data?.status === "success" &&
          action.payload?.data?.data === null
        ) {
          state.popup_msg = {
            open: true,
            message: state.show_default_blueprint
              ? "Unable to save same directory..."
              : "Unable to import same directory...",
            severity: "warning",
          };
        } else if (action.payload?.data?.status === "failed") {
          state.popup_msg = {
            open: true,
            message: "Failed to import try again...",
            severity: "warning",
          };
        } else {
          state.popup_msg = {
            open: true,
            message: state.show_default_blueprint
              ? "Successfully Saved."
              : "Successfully Imported.",
            severity: "success",
          };
          if (action.payload?.data?.current_state?.length > 0) {
            onLoadCompleted(state, action.payload.data.current_state, true);
          }
          if (action.payload?.data?.import_action_list?.length > 0) {
            state.import_action_list.push(
              ...action.payload.data.import_action_list
            );
          }
        }
      })
      .addCase(importBluePrints.rejected, (state) => {
        state.show_browse_blueprint = false;
        state.on_loading = false;
        state.set_disable = false;
        state.set_disable_saveBtn = false;
        state.popup_msg = {
          open: true,
          message: state.show_default_blueprint
            ? "Failed to save..."
            : "Failed to Import...",
          severity: "error",
        };
      })
      .addCase(getSaasZipLink.pending, (state) => {
        state.loading_sb_download = true;
        state.loading_blueprint_msg = state.zipLinkDownloadStatus;
      })
      .addCase(getSaasZipLink.fulfilled, (state) => {
        state.on_loading = false;
        state.loading_sb_download = false;
        state.zipLinkDownloadProgressCount = 10;
        state.zipLinkDownloadStatus = "Files copied, creating zip file...";
      })
      .addCase(getSaasZipLink.rejected, (state) => {
        state.on_loading = false;
        state.loading_sb_download = false;
        state.popup_msg = {
          open: true,
          message: "Failed to get Saas link...",
          severity: "error",
        };
      })
      .addCase(downloadAsPng.pending, (state) => {
        state.loading_sb_download = true;
        state.loading_blueprint_msg = "Downloading..";
        state.zipLinkDownloadStatus = "Download Started.";
      })
      .addCase(downloadAsPng.fulfilled, (state, action) => {
        state.on_loading = false;
        state.loading_sb_download = false;
        if (action.payload?.data?.status_code === 200) {
          setTimeout(() => {
            startDownloadAsPng();
            state.popup_msg = {
              open: true,
              message: "Download Initiated successfully.",
              severity: "success",
            };
          }, 500);
        } else {
          state.popup_msg = {
            open: true,
            message: "Failed to Download...",
            severity: "error",
          };
        }
      })
      .addCase(downloadAsPng.rejected, (state) => {
        state.on_loading = false;
        state.loading_sb_download = false;
        state.popup_msg = {
          open: true,
          message: "Failed to Download...",
          severity: "error",
        };
      })
      .addCase(editBlueprint.pending, (state) => {
        state.loading_blueprint = true;
      })
      .addCase(editBlueprint.fulfilled, (state, action) => {
        state.loading_blueprint = false;
        if (action?.payload?.data?.status?.toLowerCase() === "failed") {
          state.popup_msg = {
            open: true,
            message: "Failed to Load Solution Blueprint...!",
            severity: "error",
          };
        } else {
          state.addBlueprint = {
            ...state.addBlueprint,
            show: false,
            showReactFlow: true,
          };
          const dir_tree = action?.payload?.data?.dir_tree?.data || null;
          if (!dir_tree) {
            state.popup_msg = {
              open: true,
              message: "Your Blueprint is Empty...!",
              severity: "warning",
            };
          } else {
            onLoadCompleted(state, action);
          }
        }
      })
      .addCase(editBlueprint.rejected, (state) => {
        state.loading_blueprint = false;
        state.popup_msg = {
          open: true,
          message: "Failed to fetch blueprints...",
          severity: "error",
        };
      })
      .addCase(createBlueprint.pending, (state) => {
        state.loading_blueprint = true;
        state.loading_blueprint_msg = "Loading...";
      })
      .addCase(createBlueprint.fulfilled, (state) => {
        state.loading_blueprint = false;
        state.addBlueprint = {
          ...state.addBlueprint,
          show: false,
          showReactFlow: true,
        };
        state.popup_msg = {
          open: true,
          message: "New Blueprint Created...!",
          severity: "success",
        };
      })
      .addCase(createBlueprint.rejected, (state) => {
        state.loading_blueprint = false;
        state.popup_msg = {
          open: true,
          message: "Failed to create new blueprint...!",
          severity: "error",
        };
      })
      .addCase(saveSolutionBlueprint.pending, (state) => {
        state.saving_blueprint = true;
        state.loading_blueprint_msg = "Saving...";
      })
      .addCase(saveSolutionBlueprint.fulfilled, (state, action) => {
        state.saving_blueprint = false;
        state.import_action_list = [];
        if (action.payload.data.status === "success") {
          state.popup_msg = {
            open: true,
            message: "Successfully Saved.",
            severity: "success",
          };
          const dir_tree = action?.payload?.data?.dir_tree?.data || null;
          if (!dir_tree) {
            state.popup_msg = {
              open: true,
              message: "Your Blueprint is Empty...!",
              severity: "warning",
            };
          } else {
            onLoadCompleted(state, action);
          }
        } else if (action.payload.data.status === "failed") {
          state.popup_msg = {
            open: true,
            message:
              action.payload?.data?.message || "Failed to save blueprints...",
            severity: "error",
          };
        }
      })
      .addCase(saveSolutionBlueprint.rejected, (state) => {
        state.saving_blueprint = false;
        state.popup_msg = {
          open: true,
          message: "Failed to save blueprints...",
          severity: "error",
        };
      })
      .addCase(uploadFiles.pending, (state) => {
        state.startUpload = true;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.startUpload = false;
        state.showFilesUpload = false;
        state.popup_msg = {
          open: true,
          message: "Files Uploaded...!",
          severity: "success",
        };
        const dir_tree = action.payload?.dir_tree?.data || [];
        let new_nodes = [];
        const available_nodes = [];
        const buildNewNodesFn = action.payload?.buildNewNodes;
        if (action.payload?.solutionBlueprintFiles && buildNewNodesFn) {
          if (dir_tree) {
            dir_tree.forEach((item, index) => {
              const { availableNodes } = buildNewNodesFn(
                item.name,
                item.nodeId
              );
              available_nodes.push(...availableNodes);
              new_nodes.push({
                id: item.nodeId.toString(),
                position: {
                  x: 220 * index,
                  y: 100,
                },
                sourcePosition: "right",
                targetPosition: "left",
                type: "DynamicCustomNodeComponent",
                deletable: true,
                selectable: true,
                data: [
                  {
                    value: item.name,
                    treeNode: [item],
                    id: item.nodeId.toString(),
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
              });
            });
          }
          const updatedNode = [...available_nodes, ...new_nodes].filter(
            (node, index, self) =>
              index ===
              self.findIndex((n) => n.data[0].value === node.data[0].value)
          );
          let existingData = { ...state.current_bp_State };
          let currentReactFlowdata = { ...existingData.react_flow_data };
          currentReactFlowdata.new_nodes = new_nodes;
          currentReactFlowdata.available_nodes = updatedNode;
          currentReactFlowdata.initial_nodes = updatedNode;
          existingData = {
            ...existingData,
            react_flow_data: currentReactFlowdata,
          };
          state.current_bp_State = { ...existingData };
        }
      })
      .addCase(uploadFiles.rejected, (state) => {
        state.startUpload = false;
        state.popup_msg = {
          open: true,
          message: "Failed to Upload Files...!",
          severity: "error",
        };
      });
  },
});

export const {
  setProjectId,
  addFolder,
  browseBlueprints,
  defaultBlueprint,
  onCloseBrowseBlueprint,
  setCollapseBrowseBlueprintScreen,
  setTreeviewChecked,
  setTreeviewNodeIds,
  setSelectAll,
  updateTreeViewNodes,
  updateAllTreeViewNodes,
  updateTreeView,
  onImportBtnClick,
  setPopUp,
  onResetBtnClick,
  setShowFolderDetails,
  onAddNode,
  onNewNodeFieldChange,
  setSelectedNode,
  setBpState,
  onChangeResetBtnFlag,
  setZipLinkDownloadStatus,
  setIsDownload,
  onClearCurrentBpState,
  setEnableDownload,
  setShowFilesUpload,
  setEnableEditBlueprint,
  setAddBlueprint,
  setShowPreview,
  setCollapseBrowseBpFilePreview,
} = solutionBluePrintSlice.actions;

export default solutionBluePrintSlice.reducer;
