import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { alpha, withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Collapse from "@material-ui/core/Collapse";
import { useSpring, animated } from "@react-spring/web";
import Checkbox from "@material-ui/core/Checkbox";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCheckedNodes,
  getPathFromNode,
} from "src/components/utils/utils";
import RenderTreeViewIcons from "src/components/RenderTreeViewIcons";
import PreviewComponent from "src/components/PreviewFiles";
import {
  setTreeviewChecked,
  setTreeviewNodeIds,
  updateTreeViewNodes,
  updateAllTreeViewNodes,
} from "store";

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

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    "& .close": {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px solid ${alpha(theme.palette.text.titleText, 0.4)}`,
  },
}))((props) => (
  <TreeItem
    {...props}
    TransitionComponent={TransitionComponent}
    className="treeItem"
  />
));

export default function BrowseBluePrintTreeView({ classes }) {
  const dispatch = useDispatch();
  const {
    treeview_checked_nodes,
    treeviewNodes,
    treeview_node_ids,
    all_treeview_nodes,
    fileShare,
    filePrefix,
  } = useSelector((state) => state.solutionBluePrint);
  const [showPreview, setShowPreview] = useState(false);
  // const [fileShare, setFileShare] = useState('');
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
      setShowPreview(true);
      const file_path = `${getPathFromNode(treeviewNodes, node.nodeId)}`;
      setFilePath(file_path);
    }
  };

  const handleCheckToggle = (e, node) => {
    const isChecked = treeview_checked_nodes.includes(node.nodeId);
    dynamicCheckBoxClick(node, !isChecked);
    if (node.icon !== "folder") {
      setShowPreview(!isChecked);
      const file_path = `${getPathFromNode(treeviewNodes, node.nodeId)}`;
      setFilePath(file_path);
      // setFileShare('exec-env-repository');
    }
  };

  const dynamicCheckBoxClick = (node, isChecked) => {
    let nodeList = [];
    let tempNodeList = [];
    if (isChecked && node.child) {
      tempNodeList.push(node.nodeId);
      checkNode(node.child, tempNodeList);
      nodeList = nodeList.concat(treeview_checked_nodes, tempNodeList);
    } else if (!isChecked && node.child) {
      tempNodeList.push(node.nodeId);
      checkNode(node.child, tempNodeList);
      nodeList = treeview_checked_nodes.filter(
        (item) => !tempNodeList.includes(item)
      );
    } else {
      if (isChecked) {
        nodeList = nodeList.concat(treeview_checked_nodes, [node.nodeId]);
      } else {
        nodeList = treeview_checked_nodes.filter(
          (item) => item !== node.nodeId
        );
      }
    }
    function checkNode(node, nodeList) {
      node.forEach((childNode) => {
        nodeList.push(childNode.nodeId);
        childNode.child && checkNode(childNode.child, nodeList);
      });
    }

    dispatch(setTreeviewChecked({ nodeList }));
    const updatedTreeviewNodes = JSON.parse(
      JSON.stringify([].concat(treeviewNodes))
    );
    const updatedAllTreeviewNodes = JSON.parse(
      JSON.stringify([].concat(all_treeview_nodes))
    );

    updateCheckedNodes(nodeList, updatedTreeviewNodes);
    updateCheckedNodes(nodeList, updatedAllTreeviewNodes);

    dispatch(updateTreeViewNodes({ updatedTreeviewNodes }));
    dispatch(updateAllTreeViewNodes({ updatedAllTreeviewNodes }));
  };

  function createTree(
    data,
    treeview_checked_nodes,
    onCheckToggle,
    onClickPreview
  ) {
    return data.map((node) => {
      return (
        <StyledTreeItem
          key={node.nodeId}
          nodeId={node.nodeId?.toString()}
          onLabelClick={(e) => (e.preventDefault(), onClickPreview(e, node))}
          label={
            <Typography variant="h3" className="treeItemLabel">
              <Checkbox
                checked={treeview_checked_nodes.includes(node.nodeId)}
                onClick={(e) => onCheckToggle(e, node)}
                size="large"
                className="checkBox"
              />
              {node.icon ? (
                <RenderTreeViewIcons classes={classes} node={node} />
              ) : (
                node.name
              )}
            </Typography>
          }
        >
          {node.child &&
            node.child.length > 0 &&
            createTree(
              node.child,
              treeview_checked_nodes,
              onCheckToggle,
              onClickPreview
            )}
        </StyledTreeItem>
      );
    });
  }

  return (
    <div className={classes.treeViewContainer}>
      <div className="treeView">
        <TreeView
          className={classes.treeViewRoot}
          defaultExpanded={treeview_node_ids}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {createTree(
            treeviewNodes,
            treeview_checked_nodes,
            handleCheckToggle,
            onClickPreview
          )}
        </TreeView>
      </div>
      {showPreview && (
        <div className="preview">
          {<label className={classes.previewLabel}>Preview: {filePath}</label>}
          <div className="previewContent">
            <PreviewComponent
              fileShare={fileShare}
              filePath={(filePrefix && filePrefix + "/") + filePath}
            />
          </div>
        </div>
      )}
    </div>
  );
}

BrowseBluePrintTreeView.propTypes = {
  classes: PropTypes.object,
};
