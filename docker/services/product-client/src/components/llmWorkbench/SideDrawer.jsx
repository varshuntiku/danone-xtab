import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, Link, ListItem, withStyles, Typography, Divider } from '@material-ui/core';
import sideDrawerStyle from 'assets/jss/llmWorkbench/sideDrawerStyle';
import appStyle from 'assets/jss/appStyle.jsx';
import breadcrumbStyle from 'assets/jss/breadcrumbStyle.jsx';
import sidebarStyle from 'assets/jss/sidebarStyle';
import codxNewLogo from '../../../public/codxNewLogo.svg';

const CustomListLink = (props) => (
    <Link {...props} variant="h5" component={NavLink} style={{ textDecoration: 'none' }} />
);

const pages = [
    {
        title: 'Add and validate data',
        // link: '/app/1312/configure-data-quality-check/select-llm'
        link: '#'
    },
    {
        title: 'Finetune for usecase',
        link: '/llmworkbench/finetunedmodels'
    },
    {
        title: 'Deploy base models',
        link: '/llmworkbench/models'
    },
    {
        title: 'View deployed models',
        link: '/llmworkbench/deployments'
    },
    {
        title: 'Approval Requests',
        link: '/llmworkbench/approvals'
    }
];

const SideDrawer = ({ classes }) => {
    // const isJobUrl = window.location.href.includes('job');
    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={true}
            className={classes.drawer}
            classes={{ paper: classes.drawerPaper }}
        >
            <List
                className={`${classes.sidebarLinksContainer} ${classes.paddingTop} ${classes.listLink}`}
            >
                <div className={classes.appScreenContainer}>
                    {pages.map((page) => (
                        <ListItem
                            key={page.title}
                            button
                            component={CustomListLink}
                            exact
                            to={page.link}
                            className={classes.sideDrawerText}
                        >
                            {page.title}
                        </ListItem>
                    ))}
                </div>
                <div>
                    <Divider className={classes.siderbarDivider} />
                    <div className={classes.footer}>
                        <div className={classes.footer_first}>
                            <div className={classes.footer_logo}>
                                <img src={codxNewLogo} alt="Mathco-logo" />
                            </div>
                            <Typography className={classes.footer_text}>MathCo</Typography>
                        </div>
                        <Typography className={classes.footer_version}>
                            {import.meta.env['REACT_APP_VERSION']}
                        </Typography>
                    </div>
                </div>
            </List>
        </Drawer>
    );
};
export default withStyles(
    (theme) => ({
        ...appStyle(theme),
        ...breadcrumbStyle(theme),
        ...sidebarStyle(theme),
        ...sideDrawerStyle(theme),
        configureButton: {
            margin: '0rem 1rem'
        }
    }),
    { withTheme: true }
)(SideDrawer);
