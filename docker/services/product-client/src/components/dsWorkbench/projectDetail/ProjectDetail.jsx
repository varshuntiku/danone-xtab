import { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import SideNav from '../SideNav';
import ProjectOverview from './ProjectOverview';
import ProblemDefinition from './ProblemDefinition';
import ConfigureDevelop from './ConfigureDevelop';
import Presentation from './Presentation';
import ExecEnv from 'components/Utils/ExecutionEnvironmentsUtils';
import { UserInfoContext } from 'context/userInfoContent';
import { execEnvTitle } from 'constants/execution-workbench';
import SolutionBluePrint from './SolutionBluePrint';
import { ExecutionEnvironmentContextProvider } from 'components/ExecutionEnvironment/context/ExecutionEnvironmentContext';
import DSApplications from './DSApplications';
import PipeLine from '../projectDetail/PipeLine';
import { dswAppRoutes } from '../dswConstants';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        height: '100%',
        overflow: 'hidden'
    },
    main: {
        flex: '1',
        height: '100%',
        overflow: 'auto',
        position: 'relative'
    }
}));

let Screens = [
    {
        title: 'Setup',
        path: '/ds-workbench/project/:projectId/setup/',
        level: 0,
        selected: false,
        expandable: true,
        expanded: false,
        hidden: false,
        disabled: false
    },
    {
        title: 'Project Overview',
        path: '/ds-workbench/project/:projectId/setup/project-overview',
        level: 1,
        selected: false,
        expandable: false,
        expanded: false,
        hidden: true,
        disabled: false
    },
    {
        title: 'Problem Definition',
        path: '/ds-workbench/project/:projectId/setup/problem-definition',
        level: 1,
        selected: false,
        expandable: false,
        expanded: false,
        hidden: true,
        disabled: true
    },
    {
        title: 'Configure/Develop',
        path: '/ds-workbench/project/:projectId/configure-develop/',
        level: 0,
        selected: false,
        expandable: true,
        expanded: false,
        hidden: false,
        disabled: true
    },
    {
        title: 'Execution Environments',
        path: '/ds-workbench/project/:projectId/configure-develop/execution-environments',
        level: 1,
        selected: false,
        expandable: false,
        expanded: false,
        hidden: true,
        disabled: true
    },
    {
        title: 'Solution Blueprint',
        path: '/ds-workbench/project/:projectId/configure-develop/solution-blueprint',
        level: 1,
        selected: false,
        expandable: false,
        expanded: false,
        hidden: true,
        disabled: true
    },
    {
        title: 'Notebooks',
        path: '/ds-workbench/project/:projectId/configure-develop/notebooks',
        level: 1,
        selected: false,
        expandable: false,
        expanded: false,
        hidden: true,
        disabled: false
    },

    {
        title: 'Deploy',
        path: '/ds-workbench/project/:projectId/deploy/',
        level: 0,
        selected: false,
        expandable: true,
        expanded: false,
        hidden: false,
        disabled: true
    },
    {
        title: 'Applications',
        path: '/ds-workbench/project/:projectId/deploy/applications',
        level: 1,
        selected: false,
        expandable: false,
        expanded: false,
        hidden: true,
        disabled: false
    }
    // {
    //     title: 'PipeLine',
    //     path: '/ds-workbench/project/:projectId/deploy/pipeline',
    //     level: 1,
    //     selected: false,
    //     expandable: false,
    //     expanded: false,
    //     hidden: true,
    //     disabled: false
    // },
    // {
    //     title: 'Presentation',
    //     path: '/ds-workbench/project/:projectId/presentation/',
    //     level: 0,
    //     selected: false,
    //     expandable: false,
    //     expanded: false,
    //     hidden: false,
    //     disabled: true
    // }
];

function ProjectDetail({ match, ...props }) {
    const userContext = useContext(UserInfoContext);
    const { dsAppConfig, user_permissions } = props;
    useEffect(() => {
        if (
            !import.meta.env['REACT_APP_DEE_ENV_ENABLED'] ||
            (userContext?.feature_access && !userContext?.feature_access?.environments)
        ) {
            setScreens(screens.filter((scn) => scn.title !== execEnvTitle));
        }
    }, [userContext]);

    const classes = useStyles();
    const [screens, setScreens] = useState([...Screens]);
    const projectId = +match.params.projectId;

    useEffect(() => {
        if (projectId) {
            setScreens((s) => [...s].map((el) => ({ ...el, disabled: false })));
            dsAppConfig.setProjectDetailsState((prevState) => ({
                ...prevState,
                showAppAdmin: false,
                projectId,
                app_info: {
                    ...prevState.app_info,
                    id: projectId
                }
            }));
        }
    }, [projectId]);
    return (
        <div className={classes.root}>
            <SideNav
                screens={screens}
                onChange={(v) => setScreens(v)}
                pathParams={match.params}
                dsAppConfig={dsAppConfig}
            />
            <div className={classes.main}>
                <Switch>
                    <Route
                        path="/ds-workbench/project/:projectId/setup/project-overview"
                        render={(p) => <ProjectOverview {...p} />}
                    />
                    {projectId ? (
                        <>
                            <Route
                                path="/ds-workbench/project/:projectId/setup/problem-definition"
                                render={(p) => <ProblemDefinition {...p} />}
                            />
                            <Route
                                path="/ds-workbench/project/:projectId/configure-develop/notebooks"
                                render={(p) => (
                                    <ConfigureDevelop
                                        {...p}
                                        projectId={projectId}
                                        setShowHardReloadBtn={props.setShowHardReloadBtn}
                                        showHardReloadBtn={props.showHardReloadBtn}
                                    />
                                )}
                            />
                            <Route
                                path="/ds-workbench/project/:projectId/configure-develop/execution-environments"
                                render={(p) => (
                                    <ExecutionEnvironmentContextProvider>
                                        {' '}
                                        <ExecEnv
                                            disableBackIcon={true}
                                            showExecEnvListOnly={false}
                                            allowEnvCreation={true}
                                            projectId={projectId}
                                            {...p}
                                        />{' '}
                                    </ExecutionEnvironmentContextProvider>
                                )}
                            />
                            <Route
                                path="/ds-workbench/project/:projectId/presentation"
                                render={(p) => <Presentation {...p} />}
                            />
                            <Route
                                path="/ds-workbench/project/:projectId/configure-develop/solution-blueprint"
                                render={(p) => <SolutionBluePrint {...p} />}
                            />
                            <Route
                                path="/ds-workbench/project/:projectId/deploy/applications"
                                exact
                                render={(p) => (
                                    <DSApplications
                                        user_permissions={user_permissions}
                                        {...p}
                                        projectId={projectId}
                                        dsAppConfig={dsAppConfig}
                                    />
                                )}
                            />
                            {
                                <Route
                                    path={dswAppRoutes[0]}
                                    exact
                                    render={(p) => (
                                        <DSApplications
                                            user_permissions={user_permissions}
                                            {...p}
                                            projectId={projectId}
                                            isAdminRoute={true}
                                            dsAppConfig={dsAppConfig}
                                        />
                                    )}
                                />
                            }
                            {
                                <Route
                                    path={dswAppRoutes[1]}
                                    exact
                                    render={(p) => (
                                        <DSApplications
                                            user_permissions={user_permissions}
                                            {...p}
                                            projectId={projectId}
                                            isAdminRoute={true}
                                            dsAppConfig={dsAppConfig}
                                        />
                                    )}
                                />
                            }
                            {
                                <Route
                                    path={dswAppRoutes[2]}
                                    exact
                                    render={(p) => (
                                        <DSApplications
                                            user_permissions={user_permissions}
                                            {...p}
                                            projectId={projectId}
                                            isAdminRoute={true}
                                            dsAppConfig={dsAppConfig}
                                        />
                                    )}
                                />
                            }
                            {
                                <Route
                                    path={dswAppRoutes[3]}
                                    exact
                                    render={(p) => (
                                        <DSApplications
                                            user_permissions={user_permissions}
                                            {...p}
                                            projectId={projectId}
                                            isAdminRoute={true}
                                            dsAppConfig={dsAppConfig}
                                        />
                                    )}
                                />
                            }
                            {
                                <Route
                                    path={dswAppRoutes[4]}
                                    exact
                                    render={(p) => (
                                        <DSApplications
                                            user_permissions={user_permissions}
                                            {...p}
                                            projectId={projectId}
                                            isAdminRoute={true}
                                            dsAppConfig={dsAppConfig}
                                        />
                                    )}
                                />
                            }

                            {
                                <Route
                                    path={dswAppRoutes[5]}
                                    exact
                                    render={(p) => (
                                        <DSApplications
                                            user_permissions={user_permissions}
                                            {...p}
                                            projectId={projectId}
                                            isAdminRoute={true}
                                            dsAppConfig={dsAppConfig}
                                        />
                                    )}
                                />
                            }

                            <Route
                                path="/ds-workbench/project/:projectId/deploy/pipeline"
                                render={(p) => <PipeLine {...p} />}
                            />
                        </>
                    ) : null}
                    <Redirect to={'/ds-workbench/project/0/setup/project-overview'} />
                </Switch>
            </div>
        </div>
    );
}

export default withRouter(ProjectDetail);
