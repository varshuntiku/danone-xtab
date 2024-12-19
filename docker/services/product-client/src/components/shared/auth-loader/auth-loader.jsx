import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Nuclios from 'components/Nuclios/assets/Nuclios';
import authLoaderStyles from './styles';

const AuthLoader = ({ classes }) => {
    const [stepCount] = useState(20);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            let nextActiveStep = activeStep < stepCount ? activeStep + 1 : 0;

            setActiveStep(nextActiveStep);
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    });

    return (
        <div className={classes.container}>
            <div className={classes.logoContainer}>
                <Nuclios alt="Logo" />
            </div>
            <div className={classes.loaderContainer}>
                {[...Array(stepCount).keys()].map((step, index) => (
                    <div
                        key={'loaderStep' + index}
                        className={`${classes.step} ${step === activeStep && classes.activeStep}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default withStyles(authLoaderStyles, { withTheme: true })(AuthLoader);
