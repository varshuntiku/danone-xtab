import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import HorizontalScroll from 'components/connectedSystem/HorizontalScroll';
import * as _ from 'underscore';
import { animated, useSpring } from '@react-spring/web';
import connectedSystemInitiativesStyle from 'assets/jss/connectedSystemInitiativesStyle';
import { springConfig } from 'util/spring-config';
import InitiativesCard from './InitiativesCard';

const useStyles = makeStyles((theme) => ({
    ...connectedSystemInitiativesStyle(theme)
}));

const Initiatives = (props) => {
    const classes = useStyles();
    const [typographySprings] = useSpring(() => ({
        from: { y: -50 },
        to: { y: 0 },
        config: springConfig
    }));
    const [contentSprings] = useSpring(() => ({
        from: { x: 400, opacity: 0 },
        to: { x: 0, opacity: 1 },
        config: springConfig
    }));

    const AnimatedTypography = animated(Typography);
    return (
        <div className={classes.container}>
            <AnimatedTypography className={classes.initiativesHeader} style={typographySprings}>
                INITIATIVES
            </AnimatedTypography>
            <animated.div className={classes.initiativesContainer} style={contentSprings}>
                {props.initiatives.length > 0 && (
                    <HorizontalScroll intiatives={true}>
                        {_.map(props.initiatives, (initiative_item, key) => {
                            return (
                                <InitiativesCard
                                    initiative_item={initiative_item}
                                    classes={classes}
                                    key={key}
                                />
                            );
                        })}
                    </HorizontalScroll>
                )}
            </animated.div>
        </div>
    );
};

export default Initiatives;
