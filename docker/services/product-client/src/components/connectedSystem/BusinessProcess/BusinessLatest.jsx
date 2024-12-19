import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { animated } from '@react-spring/web';
import BusinessProcessLatest from './BusinessProcessLatest';
import SolutionsNew from 'components/connectedSystem/BusinessProcess/Solutions';
import BusinessPricing from 'components/connectedSystem/BusinessProcess/BusinessPricing';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as SelectDriverImage } from 'assets/img/SelectDriver.svg';
import businessProcessStyles from './BusinessProcessStyles';
import MinervaChatbot from 'components/minerva/MinervaChatbot';
import clsx from 'clsx';

const BusinessLatest = (props) => {
    // classes is default parameter while using withStyles
    const classes = { ...props.classes, ...props.classList };
    const [driverOpen, setDriverOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const handleDriverSelection = (obj) => {
        setSelectedDriver(obj);
    };

    return (
        <React.Fragment>
            <div className={clsx(classes.connSystemGridMiddle, classes.gridMiddle)}>
                <div
                    className={classes.connSystemBusinessProcess}
                    style={{ '--section-width': '32rem' }}
                >
                    <BusinessProcessLatest
                        classList={classes}
                        nodes={props.nodes}
                        onNodeClick={props.onNodeClick}
                        label="DRIVERS"
                        selectedDriver={selectedDriver}
                        handleDriverSelection={handleDriverSelection}
                        setDriverOpen={setDriverOpen}
                        startNodeAnimation={props.startNodeAnimation}
                    />
                </div>
                {!driverOpen && (
                    <animated.div
                        className={classes.initialFlowContainer}
                        style={{ ...props.driverSprings }}
                    >
                        <SelectDriverImage className={classes.selectDriverIcon} />
                        <Typography className={classes.initialFlowHeading}>
                            Select a Driver to view the Business process
                        </Typography>
                    </animated.div>
                )}
                {driverOpen && (
                    <BusinessPricing
                        key={selectedDriver.name}
                        nodes={props.nodes}
                        onNodeClick={props.onNodeClick}
                        startNodeAnimation={props.startNodeAnimation}
                        selectedDriver={selectedDriver}
                        stakeHolders={props.stakeHolders}
                        dashboardCode={props.dashboardCode}
                        problemArea={props.problemArea}
                        handleRedirection={props.handleRedirection} //Nested Props
                    />
                )}
            </div>
            <div className={classes.connSystemBusinessGridBottom}>
                <div className={classes.minervaIcon}>
                    <MinervaChatbot />
                </div>
                <SolutionsNew
                    solutions={props.solutions}
                    width={'100%'}
                    border={true}
                    driverSprings={props.driverSprings}
                />
            </div>
        </React.Fragment>
    );
};

export default withStyles(businessProcessStyles, { withTheme: true })(BusinessLatest);
