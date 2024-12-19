import React from 'react';
import { Button, Link } from '@material-ui/core';
import { addFolder, browseBlueprints, defaultBlueprint, onResetBtnClick } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { setBpState, onSaveBlueprints } from 'store';
import {
    getEdges,
    getParsedData,
    getPayloadActions
} from 'components/dsWorkbench/solutionBluePrint/utils';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { Link as RouterLink } from 'react-router-dom';
import ExportSplitButton from 'components/dsWorkbench/solutionBluePrint/ExportSplitButton';

function SolutionBluePrintNavBar({ classes }) {
    const dispatch = useDispatch();
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const { set_disable, projectId, current_bp_State, import_action_list, is_download } =
        solutionBluePrintData;
    const { react_flow_data } = current_bp_State;

    const onSaveFolder = () => {
        const edges = getEdges(getParsedData(react_flow_data.available_nodes), [
            ...getParsedData(react_flow_data.new_edges)
        ]);
        let importActionList = [];
        getParsedData(import_action_list).forEach((item) => {
            if (item.action === 'copy') {
                item.payload = item.payload.filter(
                    (value, index, self) => index === self.findIndex((t) => t.path === value.path)
                );
                importActionList.push(item);
            } else {
                importActionList.push(item);
            }
        });
        const getPayloadActionData = getPayloadActions(
            getParsedData(react_flow_data),
            projectId,
            edges,
            importActionList
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
                payload: getPayloadActionData
            })
        );
        dispatch(
            onSaveBlueprints({
                payload: getPayloadActionData
            })
        );
    };

    const onDefaultBlueprintClick = () => {
        dispatch(defaultBlueprint());
    };

    return (
        <div className={classes.navBarMain}>
            {is_download && (
                <RouterLink
                    className={classes.navigationLink}
                    to={'/platform-utils'}
                    title={'Back To Platform Utils'}
                >
                    <ArrowBackIosRoundedIcon />
                    <div className={classes.backTitle}>{'Back to Platform Utils'}</div>
                </RouterLink>
            )}

            <Button
                variant="contained"
                className={classes.addFolderButton}
                onClick={() => dispatch(addFolder())}
                aria-label="Add Folder"
                title="Add Folder"
                disabled={set_disable}
            >
                + Add Folder
            </Button>
            {!is_download && (
                <ConfirmPopup
                    title={<span>Default Blueprint</span>}
                    subTitle={
                        <>
                            Your changes will be discarded, and the default blueprint will be
                            applied. Click <b>Yes</b> to proceed.
                        </>
                    }
                    cancelText="No"
                    confirmText="Yes"
                    onConfirm={(e) => {
                        e.stopPropagation();
                        onDefaultBlueprintClick();
                    }}
                >
                    {(triggerConfirm) => (
                        <Button
                            variant="contained"
                            className={classes.addFolderButton}
                            onClick={triggerConfirm}
                            aria-label="Default Blueprint"
                            title="Default Blueprint"
                            disabled={set_disable}
                        >
                            Default Blueprint
                        </Button>
                    )}
                </ConfirmPopup>
            )}

            <Link onClick={() => dispatch(browseBlueprints())} className={classes.link} disabled>
                Browse Blueprints
            </Link>
            {is_download && <div className={classes.title1}>{'Solution Blueprint'}</div>}
            <div className={classes.saveResetBtnContainer}>
                {!is_download ? (
                    <>
                        <Button
                            onClick={() => dispatch(onResetBtnClick())}
                            variant="outlined"
                            title={'Reset'}
                            aria-label="reset"
                        >
                            Reset
                        </Button>
                        <Button
                            variant="contained"
                            className={classes.addFolderButton}
                            onClick={onSaveFolder}
                            aria-label={'Save'}
                            title={'Save'}
                        >
                            {'Save'}
                        </Button>
                    </>
                ) : (
                    <>
                        <ConfirmPopup
                            title={<span>Reset Blueprints</span>}
                            subTitle={
                                <>
                                    Your changes will be discarded, Click <b>Yes</b> to proceed.?
                                </>
                            }
                            cancelText="No"
                            confirmText="Yes"
                            onConfirm={(e) => {
                                e.stopPropagation();
                                dispatch(onResetBtnClick());
                            }}
                        >
                            {(triggerConfirm) => (
                                <Button
                                    onClick={triggerConfirm}
                                    variant="outlined"
                                    title={'Reset'}
                                    aria-label="reset"
                                >
                                    Reset
                                </Button>
                            )}
                        </ConfirmPopup>
                        <ExportSplitButton classes={classes} />
                    </>
                )}
            </div>
        </div>
    );
}

export default SolutionBluePrintNavBar;
