import React from 'react';
import { Handle, Position } from 'reactflow';

export default function CustomNode(props) {
    return (
        <div className="customNode" style={{ padding: '10px' }}>
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                style={{ top: 10, bottom: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="e"
                style={{ bottom: 10, top: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{ visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="c"
                style={{ visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="f"
                style={{ right: 40, left: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Top}
                id="d"
                style={{ visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Left}
                id="g"
                style={{ visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Left}
                id="h"
                style={{ bottom: 10, top: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Right}
                id="i"
                style={{ bottom: 10, top: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="j"
                style={{ right: 'auto', left: 30, visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Top}
                id="k"
                style={{ visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Top}
                id="l"
                style={{ right: 'auto', left: 30, visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Top}
                id="m"
                style={{ right: 'auto', left: 30, visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Bottom}
                id="n"
                style={{ right: 'auto', left: 30, visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="o"
                style={{ top: 10, left: 40, right: 'auto', bottom: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Bottom}
                id="p"
                style={{ visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="q"
                style={{ top: 25, bottom: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Right}
                id="r"
                style={{ top: 15, bottom: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="s"
                style={{ right: 60, left: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Left}
                id="t"
                style={{ top: 10, bottom: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Left}
                id="u"
                style={{ bottom: 0, top: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Top}
                id="v"
                style={{ right: 30, left: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Left}
                id="w"
                style={{ visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Left}
                id="x"
                style={{ top: 10, bottom: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Left}
                id="y"
                style={{ bottom: 10, top: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Top}
                id="z"
                style={{ left: 70, right: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Top}
                id="aa"
                style={{ right: 50, left: 'auto', visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="target"
                position={Position.Right}
                id="ab"
                style={{ visibility: 'hidden' }}
                isConnectable={props.isConnectable}
            />
            <div className="customNodeBody">{props.data.label}</div>
        </div>
    );
}
