import React from 'react';

const generateSmoothStepPath = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    spacing = 32
}) => {
    const getDirection = (position) => {
        switch (position) {
            case 'left':
                return [-1, 0];
            case 'right':
                return [1, 0];
            case 'top':
                return [0, -1];
            case 'bottom':
                return [0, 1];
            default:
                return [0, 0];
        }
    };

    const getDiffX = (sourceX, targetX) => {
        const absDiffX = Math.abs(targetX - sourceX);
        let sourceDiffX = 0,
            targetDiffX = 0;
        if (sourceX < targetX) sourceDiffX = absDiffX;
        else if (sourceX > targetX) targetDiffX = absDiffX;
        return [sourceDiffX, absDiffX, targetDiffX];
    };

    const [sourceDirectionX, sourceDirectionY] = getDirection(sourcePosition);
    const [targetDirectionX, targetDirectionY] = getDirection(targetPosition);
    const [sourceDiffX, diffXMidPoint, targetDiffX] = getDiffX(sourceX, targetX);

    const midPointX =
        (sourceX +
            (spacing + diffXMidPoint) * sourceDirectionX +
            targetX +
            spacing * targetDirectionX) /
        2;
    const midPointY =
        (sourceY + spacing * sourceDirectionY + targetY + spacing * targetDirectionY) / 2;

    return `
        M ${sourceX},${sourceY}
        L ${sourceX + (spacing + sourceDiffX) * sourceDirectionX},${
            sourceY + spacing * sourceDirectionY
        }
        L ${midPointX},${midPointY}
        L ${targetX + (spacing + targetDiffX) * targetDirectionX},${
            targetY + spacing * targetDirectionY
        }
        L ${targetX},${targetY}
    `;
};

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    sourcePosition,
    targetPosition,
    style,
    data: { spacing }
}) {
    const edgePath = generateSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        spacing
    });

    return (
        <>
            <path id={id} d={edgePath} markerEnd={markerEnd} style={{ fill: 'none', ...style }} />
        </>
    );
}
