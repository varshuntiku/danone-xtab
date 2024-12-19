import React from 'react';
import { Typography } from '@material-ui/core';
import ReactFlow from 'reactflow';

const BusinessProcess = (props) => {
    const classes = props.classes;

    return (
        <div className={classes.connSystemCardSubMainBig}>
            <Typography className={classes.businessProcessHeader}>
                {props.headerText ? props.headerText : 'BUSINESS PROCESSES'}
            </Typography>
            <div className={classes.connSystemCardFlowContainer}>
                <ReactFlow
                    nodes={props.nodes}
                    edges={props.edges}
                    minZoom={1}
                    zoomOnScroll={false}
                    zoomOnDoubleClick={false}
                    onNodeClick={props.onNodeClick}
                    preventScrolling={false}
                    proOptions={{ hideAttribution: true, account: 'paid-pro' }}
                    className={classes.connSystemBusinessProcessContainer}
                />
            </div>
        </div>
    );
};

export default BusinessProcess;
