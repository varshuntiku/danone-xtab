import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core';
import BulkUserCreation from './BulkUserCreation';
import UserGroups from './UserGroups';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import ControlUsers from './ControlUsers';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        paddingBottom: 0,
        '& + div': {
            paddingTop: 0,
            maxHeight: '75%'
        }
    },
    tabContainer: {
        background: theme.palette.primary.dark,
        borderRadius: theme.spacing(1),
        boxSizing: 'border-box',
        display: 'flex',
        color: theme.palette.text.default
    },
    tab: {
        borderRadius: theme.spacing(1) + ' ' + theme.spacing(1) + ' 0 0',
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        fontSize: theme.spacing(2),
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: '0.5s',
        borderBottom: `2px solid transparent`,
        '&:hover': {
            background: alpha(theme.palette.primary.light, 0.5),
            borderBottom: `2px solid ${theme.palette.primary.contrastText}`
        }
    },
    activeTab: {
        borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
        background: theme.palette.primary.light
    }
}));

export default function UserManagement(props) {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState('Users');
    const [actionButtons, setActionButtons] = useState(<></>);

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title={activeTab}
                actionButtons={actionButtons}
            />
            <div className={classes.container}>
                <div className={classes.tabContainer}>
                    <div
                        className={`${classes.tab} ${activeTab == 'Users' && classes.activeTab}`}
                        onClick={() => setActiveTab('Users')}
                    >
                        Users
                    </div>
                    <div
                        className={`${classes.tab} ${
                            activeTab == 'User Groups' && classes.activeTab
                        }`}
                        onClick={() => setActiveTab('User Groups')}
                    >
                        User Groups
                    </div>
                    <div
                        className={`${classes.tab} ${
                            activeTab == 'Control Users' && classes.activeTab
                        }`}
                        onClick={() => setActiveTab('Control Users')}
                    >
                        Control Users
                    </div>
                </div>
            </div>
            {activeTab == 'Users' && <BulkUserCreation setActionButtons={setActionButtons} />}
            {activeTab == 'User Groups' && (
                <UserGroups
                    userPermissions={props?.user_permissions}
                    setActionButtons={setActionButtons}
                />
            )}
            {activeTab == 'Control Users' && (
                <ControlUsers
                    userPermissions={props?.user_permissions}
                    setActionButtons={setActionButtons}
                />
            )}
        </>
    );
}
