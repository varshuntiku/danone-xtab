import React, { useContext, useState } from 'react';
import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import { CssBaseline, Grid, makeStyles } from '@material-ui/core';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Functions from 'components/Utils/Functions';
import Industry from 'components/Utils/Industry';
import Applications from 'components/Utils/Applications';
import RoleManagement from 'pages/platform-utils/role-management/role-management-page';
import Dashboards from 'components/Utils/Dashboards';
import ConnectedSystems from 'components/Utils/ConnectedSystems';
import UserManagement from './UserManagement';
import MinervaUtils from './minerva/MinervaUtils';
import MinervaConsumerUtils from './minerva/consumer/MinervaConsumer';
import PAT from 'components/Utils/PAT';
import LoginConfig from 'components/Utils/LoginConfig';
import { UserInfoContext } from 'context/userInfoContent';
import FormatPaintIcon from '@material-ui/icons/FormatPaint';
import ColorThemeUtil from './ColorThemeUtil';
import ExecEnv from 'components/Utils/ExecutionEnvironmentsUtils';
import CopilotUtil from './copilot/CopilotUtil';
import LLMWorkbench from 'pages/llm-workbench/llm-workbench';
import NucliosBox from '../NucliosBox';
import { ReactComponent as MinervaAvatarIcon } from 'assets/img/MinervaAvatarIcon.svg';
import platformUtilsStyle from 'assets/jss/platformUtilsStyle';
import { ReactComponent as IndustriesIcon } from 'assets/img/utils_industries.svg';
import { ReactComponent as FunctionsIcon } from 'assets/img/utils_functions.svg';
import { ReactComponent as DashboardsIcon } from 'assets/img/utils_dashboards.svg';
import { ReactComponent as ApplicationsIcon } from 'assets/img/utils_applications.svg';
import { ReactComponent as ExecutionEnvIcon } from 'assets/img/utils_execution_env.svg';
import { ReactComponent as UsersIcon } from 'assets/img/utils_users.svg';
import { ReactComponent as SolutionWorkbenchRolesIcon } from 'assets/img/utils_nac_roles.svg';
import { ReactComponent as Generate_PAT } from 'assets/img/generate_token.svg';
import { ReactComponent as LockIcon } from '../../assets/img/InfoLock.svg';
import CreateCopilotApplication from './copilot/CreateCopilotApplication';
// import EditCopilotApplication from './copilot/EditCopilotApplication';
import CopilotAppPreview from './copilot/CopilotAppPreview';
import CopilotPreview from './copilot/CopilotPreview';
import AllServicesStatus from './AllServicesStatus';
import { ReactComponent as LLM_Workbench } from 'assets/img/llm_workbench.svg';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

import { ExecutionEnvironmentContextProvider } from 'components/ExecutionEnvironment/context/ExecutionEnvironmentContext';
import SolutionBlueprint from 'components/solutionBlueprint/SolutionBlueprint';
import ExecutionEnvironmentsApprovals from 'components/Utils/ExecutionEnvironmentsApprovals';

const utils = [
    {
        id: 1,
        name: 'Industries',
        path: '/industry',
        icon: (className) => <IndustriesIcon className={className} />,
        component: (props) => <Industry {...props} />
    },
    {
        id: 2,
        name: 'Functions',
        path: '/function',
        icon: (className) => <FunctionsIcon className={className} />,
        component: (props) => <Functions {...props} />
    },
    {
        id: 3,
        name: 'Applications',
        path: '/applications',
        icon: (className) => <ApplicationsIcon className={className} />,
        component: (props) => <Applications {...props} />
    },
    {
        id: 4,
        name: 'Users',
        path: '/users',
        icon: (className) => <UsersIcon className={className} />,
        component: (props) => <UserManagement {...props} />
    },
    {
        id: 5,
        name: 'Dashboards',
        path: '/dashboards',
        icon: (className) => <DashboardsIcon className={className} />,
        component: (props) => <Dashboards {...props} />
    },
    {
        id: 6,
        name: 'UIaC Execution Environment',
        path: '/exec-env',
        icon: (className) => <ExecutionEnvIcon className={className} />,
        component: (props) => (
            <ExecutionEnvironmentContextProvider>
                {' '}
                <ExecEnv showExecEnvListOnly={false} {...props} allowEnvCreation={false} />{' '}
            </ExecutionEnvironmentContextProvider>
        )
    },
    {
        id: 7,
        name: "Exec Env's",
        path: '/exec-env-approvals',
        icon: (className) => <ExecutionEnvIcon className={className} />,
        component: (props) => <ExecutionEnvironmentsApprovals {...props} />
    },
    {
        id: 8,
        name: 'Minerva',
        path: '/ask-nuclios',
        icon: (className) => <MinervaAvatarIcon className={className} />,
        component: (props) => <MinervaUtils {...props} />
    },
    {
        id: 9,
        name: 'Ask NucliOS Consumers',
        path: '/ask-nuclios-consumer',
        icon: (className) => <MinervaAvatarIcon className={className} />,
        component: (props) => <MinervaConsumerUtils {...props} />
    },
    {
        id: 10,
        name: 'Ask NucliOS',
        path: '/copilot',
        icon: (className) => <MinervaAvatarIcon className={className} />,
        component: (props) => <CopilotUtil {...props} />
    },
    {
        id: 11,
        name: 'Solution Workbench Roles',
        path: '/role-management',
        icon: (className) => <SolutionWorkbenchRolesIcon className={className} />,
        component: (props) => <RoleManagement {...props} />
    },
    {
        id: 12,
        name: 'Solution Blueprint',
        path: '/solution-blueprint',
        icon: (className) => <AccountTreeIcon className={className} />,
        component: (props) => <SolutionBlueprint {...props} />
    },
    {
        id: 13,
        name: 'Generate PAT',
        path: '/PAT',
        icon: (className) => <Generate_PAT className={className} />,
        component: (props) => <PAT {...props} />
    },
    {
        id: 14,
        name: 'LLM Workbench',
        path: '/llmworkbench',
        icon: (className) => <LLM_Workbench className={className} />,
        component: (props) => <LLMWorkbench {...props} />,
        visible: false
    },
    (import.meta.env['REACT_APP_ENV'] !== 'uat' || import.meta.env['REACT_APP_ENV'] !== 'prod') && {
        id: 15,
        name: 'Color Theme Setting',
        path: '/color-theme',
        icon: (className) => <FormatPaintIcon className={className} />,
        component: (props) => <ColorThemeUtil {...props} />
    },
    {
        id: 16,
        name: 'Connected System',
        path: '/connected-systems',
        icon: (className) => <DashboardsIcon className={className} />,
        component: (props) => <ConnectedSystems {...props} />
    },
    {
        id: 17,
        name: 'Login Configuration',
        path: '/login-config',
        icon: (className) => <UsersIcon className={className} />,
        component: (props) => <LoginConfig {...props} />
    }
];

const NavigationComponent = ({ classes }) => {
    const userContext = useContext(UserInfoContext);
    const [hovered, setHovered] = useState('');
    const envProd = import.meta.env['REACT_APP_ENV'] === 'prod';
    const superUser = userContext?.feature_access?.super_user;

    let edit_production_app = userContext
        ? userContext.nac_roles?.[0]?.permissions.find(
              (permission) => permission.name === 'EDIT_PRODUCTION_APP'
          )
        : false;
    let create_preview_app = userContext
        ? userContext.nac_roles?.[0]?.permissions.find(
              (permission) => permission.name === 'CREATE_PREVIEW_APP'
          )
        : false;
    const hideBorders = (index) => {
        let borders_to_hide = [];
        if (index > 4) borders_to_hide.push('top');
        if (index % 4 !== 1) borders_to_hide.push('left');
        return borders_to_hide;
    };
    function generateConsistenUtilsBox() {
        const filteredUtils = utils.filter((ele) => {
            switch (ele.name) {
                case 'Copilot':
                    return import.meta.env['REACT_APP_ENABLE_COPILOT'];
                case 'LLM Workbench':
                    return import.meta.env['REACT_APP_ENABLE_LLMWORKBENCH'];
                default:
                    return true;
            }
        });
        let numberOfEmptyBox = filteredUtils.length % 4 != 0 ? 4 - (filteredUtils.length % 4) : 0;
        return [...utils, ...Array(numberOfEmptyBox).fill({})];
    }
    //check if a specific util has to be locked for the user
    //with this change, in prod only, users outside of super-user group can't access functions and industries and applications utils
    const checkLocked = (name) => {
        if (
            envProd &&
            ['industries', 'functions', 'applications'].includes(name?.trim()?.toLowerCase()) &&
            !superUser
        ) {
            return true;
        }
        return false;
    };
    return (
        <>
            {import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT'] ? null : (
                <UtilsNavigation path="/dashboard" backTo="Dashboard" title="Platform Utils" />
            )}
            <Grid container spacing={2} xs={12} alignItems="stretch" className={classes.utils}>
                {generateConsistenUtilsBox()
                    .filter((util) => {
                        switch (util.path) {
                            case '/ask-nuclios':
                                return import.meta.env['REACT_APP_ENABLE_MINERVA'];
                            case '/copilot':
                                return import.meta.env['REACT_APP_ENABLE_COPILOT'];
                            case '/exec-env':
                                return (
                                    import.meta.env['REACT_APP_DEE_ENV_ENABLED'] &&
                                    userContext?.feature_access?.environments
                                );
                            case '/ask-nuclios-consumer':
                                return (
                                    import.meta.env['REACT_APP_ENABLE_MINERVA'] ||
                                    import.meta.env['REACT_APP_ENABLE_COPILOT']
                                );
                            case '/llmworkbench':
                                return (
                                    import.meta.env?.['REACT_APP_ENABLE_LLMWORKBENCH'] &&
                                    userContext?.feature_access?.admin
                                );
                            default:
                                if (import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT']) {
                                    return false;
                                }
                                return true;
                        }
                    })
                    .map((util, i) => {
                        if (util.path === '/PAT') {
                            if (edit_production_app || create_preview_app) {
                                return (
                                    <Grid item xs={3} key={util.id} className={classes.gridItem}>
                                        <NucliosBox
                                            key={util.id}
                                            hideBorder={hideBorders(i + 1)}
                                            wrapperClasses={classes.utilCardWrapper}
                                        >
                                            <Link
                                                title={util.name}
                                                to={'/platform-utils' + util.path}
                                                className={classes.utilCard}
                                                key={util.id}
                                            >
                                                <span className={classes.iconWrapper}>
                                                    {util.icon(classes.icons)}
                                                </span>
                                                <span className={classes.utilName}>
                                                    {util.name}
                                                </span>
                                            </Link>
                                        </NucliosBox>
                                    </Grid>
                                );
                            }
                        } else if (util.path === '/llmworkbench') {
                            return (
                                <Grid key={util.id} item xs={3} className={classes.gridItem}>
                                    <NucliosBox
                                        key={util.id}
                                        hideBorder={hideBorders(i + 1)}
                                        wrapperClasses={classes.utilCardWrapper}
                                    >
                                        <Link
                                            title={util.name}
                                            to={util.path}
                                            className={classes.utilCard}
                                            key={util.id}
                                        >
                                            <span className={classes.iconWrapper}>
                                                {util.icon(classes.icons)}
                                            </span>
                                            <span className={classes.utilName}>
                                                {util.name}
                                                <sup>α</sup>
                                            </span>
                                        </Link>
                                    </NucliosBox>
                                </Grid>
                            );
                        } else {
                            let locked = checkLocked(util?.name);
                            return (
                                <Grid key={util.id} item xs={3} className={classes.gridItem}>
                                    <NucliosBox
                                        hideBorder={hideBorders(i + 1)}
                                        wrapperClasses={classes.utilCardWrapper}
                                    >
                                        {!locked ? (
                                            <Link
                                                title={util.name}
                                                to={'/platform-utils' + util.path}
                                                className={`${classes.utilCard} ${
                                                    util.id ? '' : classes.blankUtilCard
                                                }`}
                                                key={util.id}
                                            >
                                                <span className={classes.iconWrapper}>
                                                    {util?.icon
                                                        ? util.icon(
                                                              util.name === 'Minerva' ||
                                                                  util.name ===
                                                                      'Ask NucliOS Consumers' ||
                                                                  util.name === 'Ask NucliOS'
                                                                  ? classes.nucliosIconWrapper
                                                                  : classes.icons
                                                          )
                                                        : null}
                                                </span>
                                                <span className={classes.utilName}>
                                                    {util.name}
                                                </span>
                                            </Link>
                                        ) : (
                                            <div
                                                className={
                                                    hovered === util?.name
                                                        ? classes.utilCardVisible
                                                        : classes.utilCardLocked
                                                }
                                                onMouseEnter={(e) => {
                                                    e.stopPropagation();
                                                    setHovered(util?.name);
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.stopPropagation();
                                                    setHovered('');
                                                }}
                                            >
                                                {hovered === util?.name ? (
                                                    <span className={classes.utilCardLockedInfo}>
                                                        <span
                                                            className={classes.lockButton}
                                                            size="medium"
                                                        >
                                                            {' '}
                                                            <LockIcon fontSize="large" />
                                                        </span>
                                                        <span>
                                                            You don&apos;t have permission to access
                                                            this module. Please request access by
                                                            clicking on the &apos;?&apos; help icon
                                                            in the top navigation bar.
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className={classes.iconWrapper}>
                                                            {util?.icon
                                                                ? util.icon(classes.icons)
                                                                : null}
                                                        </span>
                                                        <span className={classes.utilName}>
                                                            {util.name}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </NucliosBox>
                                </Grid>
                            );
                        }
                    })}
            </Grid>
        </>
    );
};

const getRoutes = (props, classes) => {
    return (
        <Switch>
            <Route
                exact
                path="/platform-utils"
                component={() => <NavigationComponent classes={classes} />}
            />
            <Route
                exact
                path="/platform-utils/copilot/create"
                render={(props) => <CreateCopilotApplication {...props} />}
            />
            <Route
                exact
                path="/platform-utils/copilot/edit/:copilot_app_id"
                render={(props) => <CreateCopilotApplication {...props} />}
            />
            <Route
                exact
                path="/platform-utils/copilot/preview/:copilot_app_id"
                render={() => <CopilotAppPreview />}
            />
            <Route
                exact
                path="/platform-utils/copilot/:copilot_app_id"
                render={() => <CopilotPreview />}
            />
            <Route exact path="/platform-utils/status" render={() => <AllServicesStatus />} />
            {utils.map((util) => (
                <Route
                    exact
                    path={'/platform-utils' + util.path}
                    render={() => util.component(props)}
                    key={util.id}
                />
            ))}
        </Switch>
    );
};

const useStyles = makeStyles(platformUtilsStyle);

function UtilsDashboard(props) {
    const classes = useStyles();
    const routes = getRoutes(props, classes);
    return (
        <div className={classes.container}>
            <CssBaseline />
            <NavBar {...props}></NavBar>
            <div className={classes.platformUtilBody}>
                <NucliosBox wrapperClasses={classes.nucliosBox}>{routes}</NucliosBox>
            </div>
            <div className={classes.footerHolder}>
                <Footer key={'footer'} extraClasses={{ container: classes.footerContainer }} />
            </div>
        </div>
    );
}

export default withRouter(UtilsDashboard);
