import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "@xyflow/react";
import { withStyles, alpha } from "@material-ui/core";
import { solutionBluePrintStyles } from "src/components/style/solutionBluePrintStyles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Collapse from "@material-ui/core/Collapse";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSpring, animated } from "@react-spring/web";
import { Typography } from "@material-ui/core";
import RenderTreeViewIcons from "src/components/RenderTreeViewIcons";
import ExpandableBox from "src/components/ExpandableBox";
import Checkbox from "@material-ui/core/Checkbox";
import {
  setShowPreview,
  setTreeviewChecked,
  updateTreeViewNodes,
  updateAllTreeViewNodes,
} from "store";
import { updateCheckedNodes } from "src/components/utils/utils";
import PropTypes from "prop-types";

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
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
));

function VisualGraphCustomNode({ data, classes }) {
  const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
  const dispatch = useDispatch();
  const { treeview_checked_nodes, treeviewNodes, all_treeview_nodes } =
    solutionBluePrintData;
  const onClickPreview = data[0]?.onClickPreviewFn || function () {};

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

  const handleCheckToggle = (e, node) => {
    const isChecked = treeview_checked_nodes.includes(node.nodeId);
    dynamicCheckBoxClick(node, !isChecked);
    if (node.icon !== "folder") {
      dispatch(
        setShowPreview({
          show: !isChecked,
        })
      );
    }
  };

  function createTree(data) {
    const treeItems = [];
    data.forEach((node) => {
      treeItems.push(
        <StyledTreeItem
          key={node.nodeId}
          nodeId={node.nodeId?.toString()}
          onLabelClick={(e) => (e.preventDefault(), onClickPreview(e, node))}
          label={
            <Typography variant="h3">
              <Checkbox
                checked={treeview_checked_nodes.includes(node.nodeId)}
                onClick={(e) => handleCheckToggle(e, node)}
                size="large"
              />
              {node.icon ? (
                <RenderTreeViewIcons classes={classes} node={node} />
              ) : (
                node.name
              )}
            </Typography>
          }
        >
          {node.child && node.child.length > 0 && createTree(node.child)}
        </StyledTreeItem>
      );
    });

    return treeItems;
  }

  const getRenderedItems = () => {
    const renderedItems = [];
    data.forEach((item) => {
      renderedItems.push(
        <>
          {item.handles &&
            item.handles.forEach((handleItem, index) => {
              renderedItems.push(
                <Handle
                  key={index}
                  type={handleItem.type}
                  position={Position[handleItem.position]}
                />
              );
            })}
          <ExpandableBox
            boxHeader={item.value}
            item={item}
            boxData={
              <TreeView
                className={classes.treeViewRoot}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
              >
                {data[0]?.treeNode && createTree(data[0]?.treeNode)}
              </TreeView>
            }
            classes={classes}
          />
        </>
      );
    });

    return renderedItems;
  };

  return <>{getRenderedItems()}</>;
}

VisualGraphCustomNode.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.any,
};

export default withStyles(
  (theme) => ({
    ...solutionBluePrintStyles(theme),
  }),
  { withTheme: true }
)(VisualGraphCustomNode);
