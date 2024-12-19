import { CssBaseline, makeStyles } from '@material-ui/core';
import Footer from 'components/Footer';
import { Redirect, Route, Switch, matchPath, withRouter } from 'react-router-dom';
import NavBar from 'components/NavBar';
import ProjectList from './ProjectList';
import ProjectDetail from './projectDetail/ProjectDetail';
import { useEffect, useState } from 'react';
import { getProject } from 'services/project';
import CustomSnackbar from 'components/CustomSnackbar';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { getDsWorkbenchHardReload } from 'services/project';

const useStyles = makeStyles(() => ({
    root: {
        height: '99vh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto'
    }
}));
function DSWorkbench({ location, user_permissions, ...props }) {
    const classes = useStyles();
    const pathName = location.pathname;
    const isProjectListScreen = matchPath(pathName, { path: '/ds-workbench/project/list' });
    const isNotebooksScreen = matchPath(pathName, {
        path: '/ds-workbench/project/:projectId/configure-develop/notebooks'
    });
    const [loading, setLoading] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState({});
    const [dsWorkbenchName, setDsWorkbenchName] = useState('DS Workbench');
    const [showHardReloadBtn, setShowHardReloadBtn] = useState(false);

    const getProjectId = () => {
        let prjId;
        if (pathName.includes('ds-workbench/project')) {
            const pathNames = pathName.toLowerCase().split('/');
            const projectIdIndex = pathNames.indexOf('project');
            if (!isNaN(pathNames[projectIdIndex + 1])) {
                prjId = Number(pathNames[projectIdIndex + 1]);
            }
        }
        return prjId;
    };
    const projectId = getProjectId();

    useEffect(() => {
        if (projectId) {
            loadProjectData(projectId);
        } else {
            setDsWorkbenchName('DS Workbench');
        }
    }, [projectId]);

    useEffect(() => {
        if (isNotebooksScreen && isNotebooksScreen.isExact && showHardReloadBtn) {
            setShowHardReloadBtn(true);
        } else {
            setShowHardReloadBtn(false);
        }
    }, [isNotebooksScreen]);

    const loadProjectData = async (projectId) => {
        try {
            setLoading(true);
            const project = await getProject(projectId);
            setDsWorkbenchName('DS Workbench : ' + project.name);
        } catch (err) {
            setNotification({
                message: err.response?.data?.error || 'Failed to load project. Try again.',
                severity: 'error'
            });
            setNotificationOpen(true);
            setDsWorkbenchName('DS Workbench');
        } finally {
            setLoading(false);
        }
    };
    const [projectDetailsState, setProjectDetailsState] = useState({
        showAppAdmin: false,
        selectedRow: {},
        routes: [],
        drawerCon: false,
        projectId: null,
        projectData: null,
        showAddApplication: false,
        app_info: {
            id: null,
            modules: false
        },
        user_permissions,
        logged_in_user_info: {},
        setGPTinfo: {}
    });
    const dsAppConfig = {
        projectDetailsState,
        setProjectDetailsState
    };

    const onHardReload = () => {
        const projectId = isNotebooksScreen.params.projectId;
        getDsWorkbenchHardReload({
            callback: getDsWorkbenchHardReloadRes,
            projectId
        });
    };

    const getDsWorkbenchHardReloadRes = (response_data) => {
        if (response_data.status === 'error') {
            setNotificationOpen(true);
            setNotification({
                message: 'Failed to Refresh Jupyter Hub...!',
                severity: 'error'
            });
        } else {
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    };

    return (
        <div className={classes.root}>
            {loading ? (
                <CodxCircularLoader data-testid="circularload" size={60} center />
            ) : (
                <>
                    {' '}
                    <CssBaseline />
                    <NavBar
                        {...props}
                        gridView={true}
                        title={dsWorkbenchName}
                        showHardReloadBtn={showHardReloadBtn}
                        onHardReload={onHardReload}
                        isDsWorkbench={true}
                    ></NavBar>
                    <Switch>
                        <Route
                            exact
                            path="/ds-workbench/project/list"
                            render={(p) => (
                                <ProjectList
                                    user_permissions={user_permissions}
                                    {...p}
                                    dsAppConfig={dsAppConfig}
                                />
                            )}
                        />
                        <Route
                            path="/ds-workbench/project/:projectId"
                            render={(p) => (
                                <ProjectDetail
                                    user_permissions={user_permissions}
                                    {...p}
                                    dsAppConfig={dsAppConfig}
                                    setShowHardReloadBtn={setShowHardReloadBtn}
                                    showHardReloadBtn={showHardReloadBtn}
                                />
                            )}
                        />
                        <Redirect to={'/ds-workbench/project/list'} />
                    </Switch>
                    {isProjectListScreen ? (
                        <Footer
                            key={'footer'}
                            extraClasses={{ container: classes.footerContainer }}
                        />
                    ) : null}
                </>
            )}

            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </div>
    );
}

export default withRouter(DSWorkbench);
