import React, { useCallback } from 'react';
import { useStore, getBezierPath } from 'reactflow';
import 'reactflow/dist/style.css';

import { getEdgeParams } from './utils.js';

function FloatingEdge({ id, source, target, markerEnd, style }) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    if (!sourceNode || !targetNode) {
        return null;
    }
    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

    //Check docs for reactflow v11 at https://reactflow.dev/docs/guides/migrate-to-v11/#4-removal-of-getbezieredgecenter-getsimplebezieredgecenter-and-getedgecenter to see new implementation of getBezierPath
    const [edgePath] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty
    });

    return (
        <path
            id={id}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
            style={style}
        />
    );
}

export default FloatingEdge;
