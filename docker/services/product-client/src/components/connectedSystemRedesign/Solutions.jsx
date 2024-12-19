import { animated, useSpring } from '@react-spring/web';
import { Typography, makeStyles } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import HorizontalScroll from 'components/connectedSystem/HorizontalScroll';
import SolutionsCard from 'components/connectedSystem/SolutionsCard';
import SolutionPopup from 'components/connectedSystem/SolutionPopup';
import connectedSystemSolutionsStyle from 'assets/jss/connectedSystemSolutionsStyle';
import { springConfig } from 'util/spring-config';

import * as _ from 'underscore';

const useStyles = makeStyles((theme, props) => ({
    ...connectedSystemSolutionsStyle(theme, props)
}));

const Solutions = (props) => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ bottom: 0, left: 0 });
    const [popupState, setpopupState] = useState(null);
    const [popupSolution, setPopupsolution] = useState({});
    const classes = useStyles(props);
    const solContainer = useRef();
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
    const cardWidth = Math.floor(solContainer?.current?.clientWidth / props.cardCol - 9);
    return (
        <div className={classes.container}>
            <AnimatedTypography className={classes.solutionsHeader} style={typographySprings}>
                {props?.title ? props.title : 'Solutions'}
            </AnimatedTypography>
            <animated.div
                className={`${classes.solutionsContainer} ${
                    popupOpen && classes.solutionsContainerDisabled
                }`}
                style={contentSprings}
                onClick={() => popupOpen && setPopupOpen(false)}
                ref={solContainer}
            >
                <HorizontalScroll disableScroll={popupOpen}>
                    {_.map(props.solutions, function (solution_item) {
                        return (
                            <SolutionsCard
                                key={'solution-card-' + solution_item.label}
                                solution={solution_item}
                                setPopupOpen={setPopupOpen}
                                setPopupPosition={setPopupPosition}
                                popupOpen={popupOpen}
                                setpopupState={setpopupState}
                                setPopupsolution={setPopupsolution}
                                border={props?.solutionBorder}
                                cardWidth={cardWidth}
                                insightMinWidth={props.insightMinWidth}
                                fitContent={props.fitContent}
                            />
                        );
                    })}
                </HorizontalScroll>
            </animated.div>
            <SolutionPopup
                popupOpen={popupOpen}
                setPopupOpen={setPopupOpen}
                popupPosition={popupPosition}
                popupState={popupState}
                solutionItem={popupSolution}
            />
        </div>
    );
};

export default Solutions;
