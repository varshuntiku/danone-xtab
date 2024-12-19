import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { animated, useSpring } from '@react-spring/web';
import { withStyles } from '@material-ui/core/styles';
import businessProcessStyles from './BusinessProcessStyles';

const BusinessProcessLatest = (props) => {
    // classes is default parameter while using withStyles
    const classes = { ...props.classList, ...props.classes };
    const [businessWorkflowSprings, businessWorkflowApi] = useSpring(() => ({
        from: { x: -200 }
    }));
    const handleClick = (e, node) => {
        props.onNodeClick(e, node);
        if (props?.selectedDriver?.name == node.name) {
            props.setDriverOpen(false);
            props.handleDriverSelection(null);
        } else {
            props.handleDriverSelection(node);
            props.setDriverOpen(true);
        }
    };
    useEffect(() => {
        props.startNodeAnimation(
            businessWorkflowApi,
            { x: [-200, 0] },
            { velocity: 0, tension: 200 }
        );
    }, []);

    return (
        <React.Fragment>
            <div>
                <Typography className={classes.businessProcessDriverHeader}>DRIVERS</Typography>
                <div className={classes.connSystemCardFlowContainer}>
                    {props.nodes.slice(0, 6).map((val, key) => (
                        <animated.div
                            style={{ ...businessWorkflowSprings }}
                            onClick={(e) => handleClick(e, val)}
                            className={`${classes.businessProcessContainer} ${
                                props?.selectedDriver?.name == val.name &&
                                classes.businessProcessSelectedContainer
                            }`}
                            key={`process${key}`}
                        >
                            {val.name}
                        </animated.div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

export default withStyles(businessProcessStyles, { withTheme: true })(BusinessProcessLatest);
