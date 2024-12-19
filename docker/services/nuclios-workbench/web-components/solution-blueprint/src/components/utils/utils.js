import axios from "axios";

export async function previewFile(params, url, baseURL) {
  const axiosClient = axios.create({
    baseURL,
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  try {
    const response = await axiosClient.post(url, {
      file_path: params?.filePath,
      file_share: params?.fileShare,
    });
    return response.data;
  } catch (error) {
    return error;
  }
}

export const updateCheckedNodes = (checkedNodeList, allNodes) => {
  allNodes.forEach((node) => {
    node["selected"] = false;
    if (checkedNodeList.includes(node.nodeId)) {
      node["selected"] = true;
    }
    if (node.child) {
      updateCheckedNodes(checkedNodeList, node.child);
    }
  });
};

export const selectAllUpdateCheckedNodes = (allNodes, checked) => {
  allNodes.forEach((node) => {
    node["selected"] = checked;
    if (node.child) {
      selectAllUpdateCheckedNodes(node.child, checked);
    }
  });
};

export const getParsedData = (data) => {
  return JSON.parse(JSON.stringify(data));
};

export const getEdges = (initial_nodes, edges) => {
  const tempEdges = [];
  const nodeIds = initial_nodes.map((node) => node.id);
  edges.forEach((edge) => {
    if (nodeIds.includes(edge.source) && nodeIds.includes(edge.target)) {
      tempEdges.push(edge);
    }
  });
  return tempEdges;
};

export const getPayloadActions = (
  react_flow_data,
  blueprint_name,
  edges,
  import_action_list
) => {
  return {
    bp_name: blueprint_name,
    visual_graph: [
      {
        nodes: react_flow_data.available_nodes,
        edges,
      },
    ],
    actions: import_action_list,
  };
};

function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.nodeId === id) {
      return node;
    }
    if (node.child) {
      const found = findNodeById(node.child, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export function getPathFromNode(nodes, targetId) {
  let path = [];

  function traverse(nodeId) {
    const node = findNodeById(nodes, nodeId);
    if (!node) return;

    path.unshift(node.name);

    if (node.parentNodeId !== null) {
      traverse(node.parentNodeId);
    }
  }

  traverse(targetId);
  return path.join("/");
}
