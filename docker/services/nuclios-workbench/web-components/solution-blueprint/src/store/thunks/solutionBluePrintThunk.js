import { createAsyncThunk } from "@reduxjs/toolkit";
// import httpClient from "src/services/httpClient";
import { toPng } from "html-to-image";
import { setPopUp } from "store";

export const getDirectoryTree = createAsyncThunk(
  "solutionBluePrint/getDirectoryTree",
  async ({ isGetBp, rejectWithValue }) => {
    const { default: httpClient } = await import("src/services/httpClient");
    const baseURL =
      window?.envConfig?.solution_blueprint?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
      import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
    let url = `${baseURL}/solution-bp/get-golden-bp`;
    if (isGetBp) {
      const baseURL =
        window?.envConfig?.solution_blueprint
          ?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
        import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
      url = `${baseURL}/solution-bp/get-solution-bp`;
    }
    try {
      return await httpClient.get(url, {});
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const importBluePrints = createAsyncThunk(
  "solutionBluePrint/importBluePrints",
  async ({ payload, rejectWithValue }) => {
    const baseURL =
      window?.envConfig?.solution_blueprint
        ?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
      import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
    const url = `${baseURL}/solution-bp/import`;
    try {
      const { default: httpClient } = await import("src/services/httpClient");
      return await httpClient.post(url, payload);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getSaasZipLink = createAsyncThunk(
  "solutionBluePrint/getSaasZipLink",
  async ({ payload, callback, rejectWithValue }) => {
    try {
      const baseURL =
        window?.envConfig?.solution_blueprint
          ?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
        import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
      const { default: httpClient } = await import("src/services/httpClient");
      await httpClient.post(`${baseURL}/solution-bp/sas-zip-link`, payload, {
        headers: {
          Accept: "text/event-stream",
        },
        onDownloadProgress: (evt) => {
          let data = evt?.target?.responseText;
          const dataSplit = data?.split("\n").filter((item) => item !== "");
          const recentData = dataSplit?.[dataSplit?.length - 1];
          data = JSON.parse(recentData?.substring(5));
          callback({ data });
        },
      });
      return true;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const downloadAsZip = (callback) => async (dispatch, getState) => {
  const state = getState().solutionBluePrint;
  const element = document.querySelector(".react-flow");
  element.classList.add("download-mode");
  let visual_graph = {
    nodes: [...state.current_bp_State.react_flow_data.available_nodes],
    edges: [...state.current_bp_State.react_flow_data.initial_edges],
  };
  visual_graph = JSON.stringify(visual_graph);
  const nodes = JSON.stringify(state.import_action_list);

  try {
    const dataUrl = await toPng(element, {
      backgroundColor:
        localStorage.getItem("codx-products-theme") === "light"
          ? "white"
          : "black",
    });

    element.classList.remove("download-mode");

    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("image", blob, "solution_blueprint_image.png");
    formData.append("nodes", nodes);
    formData.append("visual_graph", visual_graph);
    if (callback) callback(formData);
  } catch (error) {
    console.log("Error", error);
    dispatch(
      setPopUp({
        open: true,
        message: "Failed to Export...!",
        severity: "error",
      })
    );
  }
};

export const downloadAsPng = createAsyncThunk(
  "solutionBluePrint/downloadAsPng",
  async ({ payload, rejectWithValue }) => {
    const baseURL =
      window?.envConfig?.solution_blueprint
        ?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
      import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
    try {
      const { default: httpClient } = await import("src/services/httpClient");
      return await httpClient.post(
        `${baseURL}/solution-bp/sas-zip-link`,
        payload
      );
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const onSaveBlueprints = createAsyncThunk(
  "solutionBluePrint/onSaveBlueprints",
  async ({ payload, rejectWithValue }) => {
    const baseURL =
      window?.envConfig?.solution_blueprint
        ?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
      import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
    try {
      const { default: httpClient } = await import("src/services/httpClient");
      return await httpClient.post(`${baseURL}/solution-bp/save`, payload);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editBlueprint = createAsyncThunk(
  "solutionBluePrint/editBlueprint",
  async ({ bpName, rejectWithValue }) => {
    const baseURL =
      window?.envConfig?.solution_blueprint
        ?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
      import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
    let url = `${baseURL}/solution-bp/on-load/${bpName}`;
    try {
      const { default: httpClient } = await import("src/services/httpClient");
      return await httpClient.get(url, {});
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createBlueprint = createAsyncThunk(
  "solutionBluePrint/createBlueprint",
  async ({ payload, rejectWithValue }) => {
    const baseURL =
      window?.envConfig?.solution_blueprint
        ?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
      import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
    try {
      const { default: httpClient } = await import("src/services/httpClient");
      return await httpClient.post(
        `${baseURL}/solution-bp/create?name=${payload.name}`
      );
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const saveSolutionBlueprint = createAsyncThunk(
  "solutionBluePrint/saveSolutionBlueprint",
  async ({ payload, rejectWithValue }) => {
    const baseURL =
      window?.envConfig?.solution_blueprint
        ?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
      import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
    try {
      const { default: httpClient } = await import("src/services/httpClient");
      return await httpClient.post(`${baseURL}/solution-bp/save`, payload);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const uploadFiles = createAsyncThunk(
  "solutionBluePrint/uploadFiles",
  async ({
    formData,
    solutionBlueprintFiles,
    buildNewNodes,
    rejectWithValue,
  }) => {
    const baseURL =
      window?.envConfig?.solution_blueprint
        ?.VITE_APP_SOLUTION_BP_ENV_BASE_URL ||
      import.meta.env["VITE_APP_DEE_ENV_BASE_URL"];
    try {
      const { default: httpClient } = await import("src/services/httpClient");
      const response = await httpClient.post(
        `${baseURL}/solution-bp/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      let resData = response.data;
      resData["solutionBlueprintFiles"] = solutionBlueprintFiles;
      resData["buildNewNodes"] = buildNewNodes;
      return resData;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
