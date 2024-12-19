import React from 'react';
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

const handleStyle = { opacity: 0 };
const deleteBtnStyle = {
    position: 'absolute',
    top: '-10px',
    right: '0px',
    background: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer'
};

function useShape({ type, width, height, color = '#9ca8b3', strokeColor, selected }) {
    const styles = { fill: color, strokeWidth: selected ? 2 : 1, stroke: strokeColor };

    switch (type) {
        case 'circle':
            return (
                <ellipse
                    cx={width / 2}
                    cy={height / 2}
                    rx={width / 2}
                    ry={height / 2}
                    {...styles}
                />
            );
        case 'round-rect':
            return <rect x={0} y={0} rx={20} width={width} height={height} {...styles} />;
        case 'hexagon':
            return (
                <path
                    d={`M10,0 L${width - 10},0  L${width},${height / 2} L${
                        width - 10
                    },${height} L10,${height} L0,${height / 2} z`}
                    {...styles}
                />
            );
        case 'diamond':
            return (
                <path
                    d={`M0,${height / 2} L${width / 2},0 L${width},${height / 2} L${
                        width / 2
                    },${height} z`}
                    {...styles}
                />
            );
        case 'arrow-rect':
            return (
                <path
                    d={`M0,0 L${width - 10},0  L${width},${height / 2} L${
                        width - 10
                    },${height} L0,${height} z`}
                    fillOpacity="0.12"
                    strokeOpacity="0.8"
                    {...styles}
                />
            );
        case 'database':
            return (
                <path
                    d={`M0,${height * 0.125}  L 0,${height - height * 0.125} A ${width / 2} ${
                        height * 0.125
                    } 0 1 0 ${width} ${height - height * 0.125} L ${width},${height * 0.125} A ${
                        width / 2
                    } ${height * 0.125} 0 1 1 0 ${height * 0.125} A ${width / 2} ${
                        height * 0.125
                    } 0 1 1 ${width} ${height * 0.125} A ${width / 2} ${height * 0.125} 0 1 1 0 ${
                        height * 0.125
                    } z`}
                    {...styles}
                    strokeWidth={selected ? styles.strokeWidth : 1}
                />
            );
        case 'triangle':
            return <path d={`M0,${height} L${width / 2},0 L${width},${height} z`} {...styles} />;
        case 'parallelogram':
            return (
                <path
                    d={`M0,${height} L${width * 0.25},0 L${width},0 L${
                        width - width * 0.25
                    },${height} z`}
                    {...styles}
                />
            );
        case 'down-arrow-rect':
            return (
                <path
                    d="M0 6C0 2.68629 2.68629 0 6 0H200C203.314 0 206 2.68629 206 6V54.8248C206 57.6968 203.965 60.166 201.146 60.7144L103.157 79.775C102.393 79.9236 101.607 79.9221 100.844 79.7707L4.83274 60.7286C2.02375 60.1715 0 57.7069 0 54.8432V6Z"
                    fillOpacity="0.12"
                    strokeOpacity="0.8"
                    {...styles}
                />
            );
        default:
            return null;
    }
}

function ShapeNode({ data, selected }) {
    const width = data?.width || 80;
    const height = data?.height || 80;
    const shape = useShape({
        type: data?.shape,
        width,
        height,
        color: data?.color,
        strokeColor: data?.strokeColor,
        selected
    });

    return (
        <div style={{ position: 'relative' }}>
            <Handle id="top" style={handleStyle} position={Position.Top} type="source" />
            <Handle id="right" style={handleStyle} position={Position.Right} type="source" />
            <Handle id="bottom" style={handleStyle} position={Position.Bottom} type="source" />
            <Handle id="left" style={handleStyle} position={Position.Left} type="source" />
            <svg style={{ display: 'block', overflow: 'visible' }} width={width} height={height}>
                {shape}
            </svg>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }}
            >
                <div>{data?.label}</div>
            </div>
            {data?.isNodeDeletable && (
                <>
                    <button onClick={data?.onDelete} style={deleteBtnStyle}>
                        ✖
                    </button>
                </>
            )}
        </div>
    );
}

export default ShapeNode;
