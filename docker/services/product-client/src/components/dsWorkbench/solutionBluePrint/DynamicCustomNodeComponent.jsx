import { Handle, Position } from '@xyflow/react';
import { withStyles, alpha } from '@material-ui/core';
import { solutionBluePrintStyles } from './style/solutionBluePrintStyles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSpring, animated } from '@react-spring/web';
import { Typography } from '@material-ui/core';
import RenderTreeViewIcons from './RenderTreeViewIcons';
import ExpandableBox from './ExpandableBox';

function TransitionComponent(props) {
    const style = useSpring({
        from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` }
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

const StyledTreeItem = withStyles((theme) => ({
    iconContainer: {
        '& .close': {
            opacity: 0.3
        }
    },
    group: {
        marginLeft: 7,
        paddingLeft: 18,
        borderLeft: `1px solid ${alpha(theme.palette.text.titleText, 0.4)}`
    }
}))((props) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

function DynamicCustomNodeComponent({ data, classes }) {
    const skipCheck = ['.', '_'];
    function createTree(data) {
        const treeItems = [];
        data.forEach((node) => {
            if (!skipCheck.includes(node.name?.[0])) {
                treeItems.push(
                    <StyledTreeItem
                        key={node.nodeId}
                        nodeId={node.nodeId?.toString()}
                        onLabelClick={(e) => e.preventDefault()}
                        label={
                            <Typography variant="h3">
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
            }
        });

        return treeItems;
    }

    const getRenderedItems = () => {
        const renderedItems = [];
        data.forEach((item) => {
            if (!skipCheck.includes(item.value?.[0])) {
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
            }
        });

        return renderedItems;
    };

    return <>{getRenderedItems()}</>;
}

export default withStyles(
    (theme) => ({
        ...solutionBluePrintStyles(theme)
    }),
    { withTheme: true }
)(DynamicCustomNodeComponent);
