import React, { Fragment, useState } from 'react';
import { Button, Typography, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import CodxStepper from './CodxStepper';
import CodxPopupDialog from './CodxPoupDialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

/* Codx Stepper */
function getSteps() {
    return ['1', '2', '3', '4', '5', '6', '7', '8'];
}

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '5%'
    },
    heading: {
        color: '#EF8911',
        fontSize: '1.5rem'
    },
    subHeading: {
        fontSize: '1.5rem'
    },
    contentText: {
        color: theme.palette.text.titleText,
        fontSize: '1.5rem'
    },
    hrStyle: {
        border: 'none',
        borderTop: '1px dashed #FFFFFF !important',
        opacity: '0.3'
    },
    btn: {
        margin: '5% 0% 5% 0%',
        borderRadius: '10rem'
    }
}));

const ContentText = (props) => {
    const classes = useStyles();
    return <Typography className={classes.contentText}>{props.content}</Typography>;
};

const ContentHeading = (props) => {
    const classes = useStyles();
    return (
        <Typography className={props.className ? props.className : classes.heading}>
            {props.heading}
        </Typography>
    );
};

const ContentButton = (props) => {
    const classes = useStyles();
    return (
        <Button
            variant="outlined"
            fullWidth
            className={clsx(classes.outlined, classes.btn)}
            aria-label={props.text}
        >
            {props.text}
        </Button>
    );
};

const StepContentOne = () => (
    <ContentText
        content="This is the filter bar, we have prefilled the filter values for your guided walkthrough as follows:
Time - 2021, Division - Europe, Market - UK, Category - Category 1, Segment - All, Brand - All
Please continue with the default filter selection OR change the filter calues to view the guided flow as per your selection
Note: You can not change the filter selections once the flow starts."
    />
);

const StepContentTwo = () => (
    <ContentText content="For us to evaluate the investment performance lets look at profitibility vs brand investment for self brand vs competetiors." />
);

const StepContentThree = () => (
    <ContentText content="This is how your brands have performed in terms of investment vs Profitability." />
);

const StepContentFour = () => (
    <ContentText content="Also here the red line represents the Average Industry Profit." />
);

const StepContentFive = () => (
    <ContentText content="This is how your competetiors have performed." />
);

const StepContentSix = () => (
    <Fragment>
        <ContentHeading heading="Insight 1" />
        <ContentText content="Here is an insight on how have your investments performed as compared to the market standard." />
    </Fragment>
);

const StepContentSeven = () => (
    <Fragment>
        <ContentHeading heading="Insight 2" />
        <ContentText content="Here is an insight on how have your investments performed as compared to the market standard." />
    </Fragment>
);

const StepContentEight = () => {
    const classes = useStyles();
    return (
        <Fragment>
            <ContentHeading heading="Overall Summary" className={classes.subHeading} />
            <ContentText content="Brand 1 has shown the most increase in brand awareness.Brand 5 and Brand 6 has shown decrease in brand penetration from 2019 to 2020" />
            <hr className={classes.hrStyle} />
            <ContentHeading heading="Next:" />
            <ContentHeading heading="Brand Perception" className={classes.subHeading} />
            <ContentText content="Look at how your brands were perceived across market segment" />
            <ContentButton text="View" />
            <ContentHeading heading="You may also want to" />
            <ContentText content="Add you like to add this chart to Data stories to discuss with your stakeholders" />
            <ContentButton text="Add to Stories" />
        </Fragment>
    );
};

const stepContent = [
    <StepContentOne key={'stepContent1'} />,
    <StepContentTwo key={'stepContent2'} />,
    <StepContentThree key={'stepContent3'} />,
    <StepContentFour key={'stepContent4'} />,
    <StepContentFive key={'stepContent5'} />,
    <StepContentSix key={'stepContent6'} />,
    <StepContentSeven key={'stepContent7'} />,
    <StepContentEight key={'stepContent8'} />
];
/*  */
const stepTooltipContent = [
    'This is how your brands have performed in terms of Investment vs Profitability',
    'This is how your brands have performed in terms of Investment vs Profitability',
    'This is how your brands have performed in terms of Investment vs Profitability',
    'This is how your brands have performed in terms of Investment vs Profitability',
    'This is how your brands have performed in terms of Investment vs Profitability',
    'This is how your brands have performed in terms of Investment vs Profitability',
    'This is how your brands have performed in terms of Investment vs Profitability',
    'This is how your brands have performed in terms of Investment vs Profitability'
];
/* end for Codx Stepper */
/* Codx dialog popup */
const styles = makeStyles((theme) => ({
    root: {
        marginTop: '5%'
    },
    dialogTitleRoot: {
        margin: 0,
        width: 'max-content',
        backgroundColor: theme.palette.background.table
    },
    dialogContent: {
        color: theme.palette.text.titleText,
        fontWeight: 300,
        fontSize: '2rem',
        lineHeight: '2.5rem'
    },
    btn: {
        color: theme.palette.text.contrastText,
        fontWeight: 300,
        fontSize: '2rem',
        lineHeight: '2rem'
    },
    closeButton: {
        position: 'absolute',
        right: '1rem',
        top: '1rem',
        padding: 'inherit',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    closeIcon: {
        color: theme.palette.background.default + '!important'
    }
}));

const DialogTitle = (props) => {
    const { onClose, classes, title } = props;
    return (
        <Fragment>
            {title ? <Typography className={classes.dialogTitleRoot}>{title}</Typography> : null}
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon fontSize="large" className={classes.closeIcon} />
                </IconButton>
            ) : null}
        </Fragment>
    );
};

const DialogContent = () => {
    const classes = styles();
    return (
        <Typography className={classes.dialogContent}>
            Lets look at how has the Investment Performed with respect to the market over the last 5
            years for this category
        </Typography>
    );
};

const LinkButton = withRouter((props) => {
    const { history, to, classes } = props;
    const btnClickHandler = (e) => {
        e.preventDefault();
        history.push(to);
    };
    return (
        <Button className={classes.btn} onClick={btnClickHandler} aria-label={props.btnText}>
            {props.children}
        </Button>
    );
});

LinkButton.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

const DialogAction = (props) => {
    const { path, classes, btnText } = props;
    return (
        <LinkButton to={path} classes={classes} btnText={btnText}>
            {btnText}
        </LinkButton>
    );
};
/* end Codx dialog pop-up */

export default function CodxComponentsDemo() {
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
    const maxSteps = steps.length;
    //class for CodxStepper
    const classes1 = useStyles();
    //class for CodxDialogPopup
    const classes = styles();
    //CodxDialogPopup
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    //CodxStepper
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    return (
        <div className={classes1.root}>
            <Grid container spacing={0}>
                {/* <Grid item xs={2}>
                    <CodxStepper
                        category="vertical"
                        steps={steps}
                        activeStep={activeStep}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        stepContent={stepContent}
                        stepTooltipContent={stepTooltipContent}
                        showStepContent={false} />
                </Grid> */}
                <Grid item>
                    <CodxStepper
                        category="mobile"
                        steps={steps}
                        activeStep={activeStep}
                        maxSteps={maxSteps}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        stepContent={stepContent}
                        stepTooltipContent={stepTooltipContent} //
                        position="static"
                        variant="text"
                        header="Finish"
                    />
                </Grid>
            </Grid>
            <div className={classes.root}>
                <Button aria-label="dialog-button" variant="outlined" onClick={handleClickOpen}>
                    Click
                </Button>
                <CodxPopupDialog
                    open={open}
                    setOpen={setOpen}
                    dialogTitle={<DialogTitle classes={classes} onClose={handleClose} title="" />}
                    dialogContent={<DialogContent />}
                    dialogActions={
                        <DialogAction path="/app/26" classes={classes} btnText="Show Me" />
                    }
                />
            </div>
        </div>
    );
}
