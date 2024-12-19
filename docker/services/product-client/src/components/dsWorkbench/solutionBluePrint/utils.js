export const updateCheckedNodes = (checkedNodeList, allNodes) => {
    allNodes.forEach((node) => {
        node['selected'] = false;
        if (checkedNodeList.includes(node.nodeId)) {
            node['selected'] = true;
        }
        if (node.child) {
            updateCheckedNodes(checkedNodeList, node.child);
        }
    });
};

export const selectAllUpdateCheckedNodes = (allNodes, checked) => {
    allNodes.forEach((node) => {
        node['selected'] = checked;
        if (node.child) {
            selectAllUpdateCheckedNodes(node.child, checked);
        }
    });
};

export const buildDirPath = (new_nodes, new_edges) => {
    const graph = {};
    const nodeLabels = {};

    new_nodes.forEach((node) => {
        nodeLabels[node.id] = node.data.label;
        graph[node.id] = [];
    });

    new_edges.forEach((edge) => {
        graph[edge.source].push(edge.target);
    });

    const incomingEdges = new Set();
    new_edges.forEach((edge) => incomingEdges.add(edge.target));

    const rootNodes = Object.keys(nodeLabels).filter((nodeId) => !incomingEdges.has(nodeId));

    const generatePaths = (nodeId, path) => {
        const currentPath = [...path, nodeLabels[nodeId]];
        const children = graph[nodeId];

        if (children.length === 0) {
            return [currentPath.join('/')];
        }

        let paths = [];
        children.forEach((child) => {
            paths = paths.concat(generatePaths(child, currentPath));
        });

        return paths;
    };

    const allPaths = rootNodes.flatMap((root) => generatePaths(root, []));

    return allPaths;
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

export const getPayloadActions = (react_flow_data, projectId, edges, import_action_list) => {
    // const sourceBpPathPrefix = 'custom-bps';
    // const goldenBpPathPrefix = 'golden-bps';
    // const removedNodesSet = new Set();

    // let addAction = {
    //     action: 'add',
    //     payload: []
    // };
    // let removeAction = {
    //     action: 'remove',
    //     payload: []
    // };
    // let copyAction = {
    //     action: 'copy',
    //     payload: []
    // };
    // react_flow_data.new_nodes.forEach((nNode) => {
    //     const name = nNode.data[0].value;
    //     addAction.payload.push({
    //         name,
    //         path: `${sourceBpPathPrefix}/${projectId}`
    //     });
    // });

    // react_flow_data.removed_nodes.forEach((rNode) => {
    //     removedNodesSet.add(rNode.id);
    //     const name = rNode.value;
    //     removeAction.payload.push({
    //         name,
    //         path: `${sourceBpPathPrefix}/${projectId}/${name}`
    //     });
    // });

    // react_flow_data.initial_nodes.forEach((cNode) => {
    //     const name = cNode.data[0].value;
    //     if (!removedNodesSet.has(cNode.id)) {
    //         copyAction.payload.push({
    //             name,
    //             source: `${goldenBpPathPrefix}/${name}`,
    //             path: `${sourceBpPathPrefix}/${projectId}`
    //         });
    //     }
    // });

    // let actions = [addAction, removeAction, copyAction]

    // if (import_action_list.length > 0 && import_action_list) {
    //     // copyAction.payload = [...copyAction.payload, ...import_action_list];
    //     actions.push(...import_action_list)
    // }

    return {
        project_id: projectId,
        visual_graph: [
            {
                nodes: react_flow_data.available_nodes,
                edges
            }
        ],
        actions: import_action_list
    };
};

export const getDefaultPayloadActions = (
    react_flow_data,
    projectId,
    edges,
    is_save_btn_clicked
) => {
    return {
        project_id: projectId,
        bp_name: '',
        visual_graph: [
            {
                nodes: is_save_btn_clicked
                    ? react_flow_data.initial_nodes
                    : react_flow_data.available_nodes,
                edges
            }
        ],
        dir_tree: []
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
    return path.join('/');
}
