import React, { useState } from 'react';
import businessProcessStyles from './BusinessProcessStyles';
import { Grid, Typography, withStyles } from '@material-ui/core';
import HorizontalScroll from 'components/connectedSystem/HorizontalScroll';
import SolutionsCard from 'components/connectedSystem/SolutionsCard';
import SolutionPopup from 'components/connectedSystem/SolutionPopup';
import clsx from 'clsx';
const Solutions = (props) => {
    const classes = props.classes;
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ bottom: 0, left: 0 });
    const [popupState, setpopupState] = useState(null);
    const [popupSolution, setPopupsolution] = useState({});
    return (
        <Grid container className={classes.solutionContainer}>
            <Typography className={clsx(classes.pricingAccordionHeading, classes.solutionsHolder)}>
                Solutions
            </Typography>
            <HorizontalScroll disableScroll={false}>
                {props.solutions.map((solution_item, index) => (
                    <SolutionsCard
                        key={`solution-card-${solution_item.label}-${index}`}
                        solution={solution_item}
                        setPopupOpen={setPopupOpen}
                        setPopupPosition={setPopupPosition}
                        popupOpen={popupOpen}
                        setpopupState={setpopupState}
                        setPopupsolution={setPopupsolution}
                        border={props?.solutionBorder}
                    />
                ))}
            </HorizontalScroll>
            <SolutionPopup
                popupOpen={popupOpen}
                setPopupOpen={setPopupOpen}
                popupPosition={popupPosition}
                popupState={popupState}
                solutionItem={popupSolution}
            />
        </Grid>
    );
};

export default withStyles(businessProcessStyles, { withTheme: true })(Solutions);
