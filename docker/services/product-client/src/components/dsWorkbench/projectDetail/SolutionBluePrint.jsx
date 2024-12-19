import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import SolutionBluePrintNavBar from '../solutionBluePrint/SolutionBluePrintNavBar';
import BrowseBluePrints from '../solutionBluePrint/BrowseBluePrints';
import { solutionBluePrintStyles } from '../solutionBluePrint/style/solutionBluePrintStyles';
import appAdminStyle from 'assets/jss/appAdminStyle.jsx';
import {
    setProjectId,
    setPopUp,
    onLoadBlueprint,
    setBpState,
    onLoadDefaultBlueprint,
    setIsDownload
} from 'store';
import CustomSnackbar from 'components/CustomSnackbar';
import { ReactFlowProvider } from '@xyflow/react';
import ReactFlowRenderer from '../solutionBluePrint/ReactFlowRenderer';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { Typography } from '@material-ui/core';
import {
    getEdges,
    getParsedData,
    getDefaultPayloadActions
} from 'components/dsWorkbench/solutionBluePrint/utils';

function SolutionBluePrint({ location, classes }) {
    const pathName = location.pathname;
    const dispatch = useDispatch();
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const {
        popup_msg,
        show_browse_blueprint,
        on_loading,
        loading_blueprint_msg,
        on_saved,
        show_default_blueprint,
        current_bp_State,
        is_save_btn_clicked,
        is_download
    } = solutionBluePrintData;
    const { react_flow_data } = current_bp_State;

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
            dispatch(setProjectId(projectId));
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            dispatch(
                onLoadBlueprint({
                    projectId
                })
            );
        }
    }, [show_default_blueprint]);

    useEffect(() => {
        if (is_download) {
            dispatch(setIsDownload(false));
        }
    }, []);

    if (on_saved && projectId) {
        dispatch(
            onLoadBlueprint({
                projectId
            })
        );
    }

    if (projectId && show_default_blueprint) {
        let edges = [];
        edges = getEdges(getParsedData(react_flow_data.available_nodes), [
            ...getParsedData(react_flow_data.new_edges)
        ]);
        if (!is_save_btn_clicked) {
            edges = getEdges(getParsedData(react_flow_data.available_nodes), [
                ...getParsedData(react_flow_data.initial_nodes),
                ...getParsedData(react_flow_data.initial_edges)
            ]);
        }
        const getDefaultPayloadActionData = getDefaultPayloadActions(
            getParsedData(react_flow_data),
            projectId,
            edges,
            !is_save_btn_clicked
        );
        dispatch(
            setBpState({
                type: 'updateEdge',
                new_edges: edges
            })
        );
        dispatch(
            setBpState({
                type: 'setPayload',
                payload: getDefaultPayloadActionData
            })
        );

        dispatch(
            onLoadDefaultBlueprint({
                payload: getDefaultPayloadActionData,
                projectId
            })
        );
    }

    return (
        <React.Fragment>
            {on_loading ? (
                <div className={classes.browseBlueprintSideBarLoadingContainer}>
                    <CodxCircularLoader size={40} />
                    <Typography variant="h4" className={classes.textContent}>
                        {loading_blueprint_msg}
                    </Typography>
                </div>
            ) : (
                <>
                    <SolutionBluePrintNavBar classes={classes} />
                    <hr className={classes.sepratorline} />
                    <ReactFlowProvider>
                        <ReactFlowRenderer classes={classes} />
                    </ReactFlowProvider>

                    {show_browse_blueprint && <BrowseBluePrints classes={classes} />}
                </>
            )}

            <CustomSnackbar
                open={popup_msg.open}
                message={popup_msg.message}
                autoHideDuration={5000}
                onClose={() => {
                    dispatch(
                        setPopUp({
                            open: false
                        })
                    );
                }}
                severity={popup_msg.severity}
            />
        </React.Fragment>
    );
}

export default withStyles(
    (theme) => ({
        ...solutionBluePrintStyles(theme),
        ...appAdminStyle(theme)
    }),
    { withTheme: true }
)(SolutionBluePrint);
