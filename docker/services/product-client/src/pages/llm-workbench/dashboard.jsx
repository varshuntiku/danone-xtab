import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import SupportedModels from './supported-model';
import { CssBaseline, makeStyles } from '@material-ui/core';

import DeployedLLM from 'components/llmWorkbench/DeployedLLM';
import SideDrawer from 'components/llmWorkbench/SideDrawer';
import TopBar from 'components/llmWorkbench/Topbar';
import ApprovalRequests from 'components/llmWorkbench/approval/ApprovalRequests';
import DeployLLMWorkBench from 'pages/llm-workbench/deploy-llm';
import FineTuneModel from 'pages/llm-workbench/create-finetune';
import ImportedModels from 'pages/llm-workbench/imported-models';
import LLMExperiments from 'components/llmWorkbench/LLMExperiments';
import FinetuningReports from 'components/llmWorkbench/Reports/FinetuningReports';
import FinetuneStatus from 'components/llmWorkbench/finetune/status';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: 'flex',
        height: 'calc(100% - 5.4rem)',
        maxWidth: '100%',
        paddingRight: theme.layoutSpacing(16),
        paddingBottom: theme.layoutSpacing(8),
        background: theme.palette.background.paper
    },
    bodyContent: {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        background: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        marginTop: theme.layoutSpacing(8),
        display: 'flex',
        flexDirection: 'column'
    },
    drawer: {
        width: 'calc(100% - 82.5%)'
    }
}));

const exceptions = ['results', 'status'];

const DeployedLLMPage = ({ user_permissions, ...props }) => {
    const currentPath = window.location.pathname;
    const classes = useStyles();
    const isException = useMemo(() => exceptions.some((ex) => currentPath?.includes(ex)), []);
    return (
        <>
            <CssBaseline />
            <TopBar {...props} user_permissions={user_permissions} />
            <div className={classes.wrapper}>
                <div
                    className={classes.drawer}
                    style={{
                        display: isException ? 'none' : ''
                    }}
                >
                    <SideDrawer />
                </div>
                <div
                    className={classes.bodyContent}
                    style={{ borderRight: isException ? 'none' : '' }}
                >
                    <Switch>
                        <Route
                            path="/llmworkbench/finetunedmodels/:modelId/checkpoints/:checkpointName/results"
                            component={(props) => <FinetuningReports {...props} />}
                        />
                        <Route
                            path="/llmworkbench/finetunedmodels/:modelId/results"
                            component={(props) => <FinetuningReports {...props} />}
                        />
                        <Route
                            path="/llmworkbench/deployments"
                            component={(props) => <DeployedLLM {...props} />}
                            exact
                        />
                        <Route
                            exact
                            path="/llmworkbench/models"
                            component={(props) => <SupportedModels {...props} />}
                        />
                        <Route
                            exact
                            path="/llmworkbench/import-models"
                            component={(props) => <ImportedModels {...props} />}
                        />
                        <Route
                            path="/llmworkbench/models/:id/deploy"
                            component={(props) => <DeployLLMWorkBench isDelayed {...props} />}
                        />
                        <Route
                            path="/llmworkbench/models/:id/experiments/:experiment_id/deploy"
                            component={(props) => <DeployLLMWorkBench isDelayed {...props} />}
                        />
                        <Route
                            path="/llmworkbench/models/:id/experiments/:experiment_id/checkpoints/:checkpoint_name/deploy"
                            component={(props) => <DeployLLMWorkBench isDelayed {...props} />}
                        />
                        <Route
                            path="/llmworkbench/deployments/:deployment_id"
                            component={(props) => (
                                <DeployLLMWorkBench isDeployed isDelayed {...props} />
                            )}
                        />
                        <Route
                            path="/llmworkbench/finetunedmodels/:modelId/status"
                            component={(props) => <FinetuneStatus {...props} />}
                        />
                        <Route
                            path="/llmworkbench/finetunedmodels/create"
                            component={(props) => <FineTuneModel {...props} />}
                        />
                        <Route
                            path="/llmworkbench/job/finetune/:id"
                            component={(props) => <FineTuneModel isDeployed {...props} />}
                        />
                        <Route
                            path="/llmworkbench/finetunedmodels"
                            component={(props) => <LLMExperiments {...props} />}
                        />
                        <Route
                            path="/llmworkbench/approvals"
                            component={(props) => <ApprovalRequests {...props} />}
                        />
                    </Switch>
                </div>
            </div>
        </>
    );
};

export default DeployedLLMPage;
