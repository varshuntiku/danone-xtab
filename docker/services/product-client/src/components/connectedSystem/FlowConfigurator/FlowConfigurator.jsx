import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import NavBar from 'components/NavBar.jsx';
import Footer from 'components/Footer.jsx';
import flowConfiguratorStyle from 'assets/jss/flowConfiguratorStyle.jsx';
import FlowGenerator from './FlowGenerator';

const useStyles = makeStyles((theme) => ({
    ...flowConfiguratorStyle(theme)
}));

const FlowConfigurator = (props) => {
    const [selectedTab, setSelectedTab] = useState('summary');
    const classes = useStyles();

    const propData = {
        selectedTab,
        setSelectedTab
    };

    return (
        <div className={classes.pageWrapper}>
            <NavBar {...props} />
            <FlowGenerator classStyles={classes} {...propData} />
            <div className={classes.footerWrapper}>
                <Footer />
            </div>
        </div>
    );
};

export default withTheme(FlowConfigurator);
