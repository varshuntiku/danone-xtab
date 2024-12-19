import WidgetOutput from "../widgetOutput/WidgetOutput";
import "./queryOutputItem.scss"
import LinearProgress from "../../shared/linearProgress/LineraProgress";
import { IQuery, WidgetType } from "../../../model/Query";
import InfoPopper from "../../shared/infoPopper/InfoPopper";
import QueryItemContextProvider from "../../../context/queryItemContext";
import Skeleton from "../../shared/skeleton/Skeleton";
import Feedback from "../../shared/feedback/Feedback";
import FeedbackComment from "../../shared/feedbackComment/FeedbackComment";
import PersonIcon from "../../../svg/PersonIcon";
import MinervaAvatarIcon from "../../../svg/MinervaAvatarIcon";
import PinButton from "../../shared/pinButton/PinButton";
import { useContext, useEffect, useState } from "preact/hooks";
import { RootContext } from "../../../context/rootContext";
import CitationIcon from "../../../svg/CitationIcon";
import { ViewModeContext } from "../../../context/viewModeContext";
import { SideWorkspaceContext } from "../../../model/SideWorkspace";
import CitationFilledIcon from "../../../svg/CitationFilledIcon";
import DotLoader from "../../shared/dotLoader/DotLoader";
import CustomTooltip from "../../shared/tooltip/CustomTooltip";
import QueryInputDatasourceItem from "../../queryInput/QueryInputDatasource";
import SelectedQueryIcon from "../../../svg/SelectedQueryIcon";
import { BaseEvents, QueryServiceEvents } from "../../../model/Events";
import AddQueryIcon from "../../../svg/AddQueryIcon";
import ErrorBoundary from "../../errorBoundaries/ErrorBoundaries";

type QueryOutputItemPropsType = {
    chatPopperView?: boolean;
    query: Partial<IQuery>;
}
export default function QueryOutputItem({ chatPopperView = false, query }: QueryOutputItemPropsType) {
    const { minerva_avatar_url, citationService, queryService, mainService } = useContext(RootContext);
    const { handleOpenSideWorkspace, handleExpand, closeSideWorkspace, sideWorkspaceContext, openSideWorkspace, popperExpanded } = useContext(ViewModeContext);
    const [openFeedbackComment, setOpenFeedbackComment] = useState(false);
    const [showQueryAvatar, setShowQueryAvatar] = useState(true);
    const [chartExpanded, setChartExpanded] = useState(false);

    const citationEnabled = query.id === citationService?.activeQueryId.value;

    useEffect(() => {
        if  (query?.data_to_emit) {
            const event = new CustomEvent(BaseEvents.EMIT_TO_CLIENT, { detail: query.data_to_emit, bubbles: true });
            this.base.dispatchEvent(event)
        }
    }, [query?.data_to_emit])

    useEffect(() => {
        const skip_storyboard = query.output?.response?.skip_storyboard
        if (!openSideWorkspace || (openSideWorkspace && sideWorkspaceContext !== 2) || !Number.isInteger(query.id) || query.request_type?.includes("storyboard") || !!query.error || !!skip_storyboard) {
            setShowQueryAvatar(true);
        } else {
            setShowQueryAvatar(false);
        }
    }, [sideWorkspaceContext, openSideWorkspace]);

    const toggleEnableCitation = () => {
        if (!citationEnabled) {
            if (query.output.response?.citation) {
                const citationData = {
                    contentType: WidgetType.text,
                    content: query.output.response?.text,
                    citation: query.output.response?.citation
                }
                citationService.setActivateCitation(query.id, citationData);
                handleOpenSideWorkspace(SideWorkspaceContext.CITATION);
                if (!popperExpanded) {
                    handleExpand();
                }
            } else {
                citationService.setActivateCitation(query.id, null);
            }
        } else {
            closeSideWorkspace();
            citationService.setActivateCitation(null, null);
        }
    }

    const handleFeedbackChange = (value) => {
        queryService.updateQueryRecord(query.id, {
            feedback: value
        });
        setOpenFeedbackComment(value == -1)
    }

    const handleCloseComment = () => {
        setOpenFeedbackComment(false);
    }

    const isEmptyInterruptedResponse = () => {
        if (query.interrupted) {
            return (Object.keys(query.output || {}).length === 0 ||
                ("response" in query.output &&
                    !(
                        query.output?.response?.text ||
                        query.output?.response?.widgets ||
                        query.output?.response?.entities
                    )));
        }
        return false
    }

    const handleQuerySelect = (val) => {
        queryService.updateQuery(query.id, { selected: !val });
        queryService.eventTarget.dispatchEvent(QueryServiceEvents.QUERY_SELECT, { detail: { id: query.id, query: query.input, datasource: query.datasource } });
    }

    const renderQueryStoryBoardStateIcon = () => {
        return (
            Number.isInteger(query.id) ? (
                query.selected ? <SelectedQueryIcon className="MinervaIcon" /> : <AddQueryIcon className="MinervaIcon" />
            ) : null
        );
    }

    return (<QueryItemContextProvider value={{ query, citationEnabled }}>
        <div
            id={query.id + '_minerva_result_output'}
            data-testid={query.id + '_minerva_result_output'}
            className={"MinervaQueryOutputItem " + (citationEnabled ? "MinervaQueryOutputItem-citation-enabled" : "")}
        >
            <div className="MinervaQueryOutputItem-query-container">
                {showQueryAvatar ? <div className="MinervaAvatar"> <PersonIcon /> </div> :
                    <div className="MinervaQuerySelectIcon" onClick={() => handleQuerySelect(query.selected)}> {renderQueryStoryBoardStateIcon()} </div>}
                <div className="MinervaQueryOutput-queryInput-container">
                    {query.input ? <div className="MinervaQueryOutput-Query">
                        <p className="MinervaQueryOutputItem-query-input">
                            {query.input}
                        </p>
                        <PinButton query_id={query.id} pinned={query.pinned} />
                    </div> : null}
                    {query?.datasource?.length ? <QueryInputDatasourceItem queryDatasourceList={query?.datasource} allowFileRemove={false} enablePreview={true}/> : null}

                </div>
                {/* <div style={{flex: 1}}></div> */}
                {!query.input ? <div>
                    <PinButton query_id={query.id} pinned={query.pinned} />
                </div> : null}
            </div>
            <div className="MinervaQueryOutputItem-response-container">
                <div>
                    <div className="MinervaAvatar">
                        {minerva_avatar_url ? <img src={minerva_avatar_url} />
                            : <MinervaAvatarIcon />}
                    </div>
                </div>
                <div className="MinervaQueryOutputItem-response-content">
                    {query.output?.response ? (
                        chatPopperView ? (
                            <button class="MinervaButton">
                                Open Visual Result
                            </button>
                        ) : (
                            query.output?.response?.text || query.output?.response?.entities || query.output?.response?.widgets ?
                                (<ErrorBoundary fallback="Unable to unfold the response">
                                    <div className={`MinervaQueryOutputItem-visual-result ${chartExpanded ? 'expanded' : ''}`}>
                                        <WidgetOutput data={query.output.response} chartExpanded={chartExpanded} chartExpandHandler={(flag) => setChartExpanded(flag)} />
                                    </div>
                                </ErrorBoundary>) : null
                        )
                    ) : (
                        null
                        // (query.status == 'pending' && !mainService.copilotAppId.value)? <Skeleton height={10} /> : null
                    )}
                    {/* {query.output?.response?.text ? (
                        null
                    ) : (
                        (query.status == 'pending' && !mainService.copilotAppId.value)? <div><Skeleton height={1} typography={true} /> <Skeleton height={1} typography={true} /> </div> : null
                    )} */}

                    <InterruptedMsgRenderer query={query} />

                    {query.status === 'rejected' ? (
                        <p className="MinervaQueryOutputItem-textresult">
                            Unable to resolve your query!
                        </p>

                    ) : null}
                    {(!query.status || query.status === 'resolved') && !chatPopperView && !isEmptyInterruptedResponse() ? (
                        <div className="MinervaQueryOutputItem-action-panel ">
                            <Feedback feedback={query.feedback} onChangeFeedback={handleFeedbackChange} />
                            <CustomTooltip content={`${citationEnabled ? 'Hide sources' : 'View sources'}`} placement="bottom" arrow={true}>
                                <button
                                    className="MinervaIconButton MinervaIconButton-small-bellow-md MinervaQueryOutputItem-citation-btn"
                                    onClick={toggleEnableCitation}>
                                    {citationEnabled ? <CitationFilledIcon /> : <CitationIcon />}
                                </button>
                            </CustomTooltip>
                            <div style={{ flex: 1 }} />
                            {query.output?.response?.sql_query ? (
                                <OutputHintPopper
                                    popoverInfo={query.output?.response?.sql_query}
                                />
                            ) : null}
                        </div>
                    ) : null}


                    {/* {query.status == 'pending' && !query.progress_message && !mainService.copilotAppId.value ? <Skeleton height={1} /> : null} */}

                    {/*Show only on minerva */}
                    {/* {query.progress_message && (query.status == 'pending' || query.status == 'streaming') && !mainService.copilotAppId.value  ? (
                        <small className="MinervaQueryOutputItem-status">
                            <LinearProgress height={0.5} value={query.progress_percentage} variant={typeof (query.progress_percentage) === 'number' ? "determinate" : "indeterminate"} showPercentage={typeof (query.progress_percentage) === 'number'} />
                            <em>{query.progress_message}</em>
                        </small>
                    ) : null} */}
                    {/* Only for copilot */}
                    {(query.progress_message && query.progress_message !== 'Done') && (query.status == 'pending' || query.status == 'streaming') ?
                        <span className="MinervaQueryOutputItem-loaderContainer" >
                            <img src={process.env.HOST_URL + `/assets/progress_${query?.progress_icon || 'search'}.gif`} className="MinervaQueryOutputItem-image" alt="searching" />
                            <span className="MinervaQueryOutputItem-textresult">{query.progress_message}</span>
                            <DotLoader />
                        </span> : null}
                    {openFeedbackComment ? <FeedbackComment query={query} onCloseComment={handleCloseComment} /> : null}
                </div>
            </div>
        </div>
    </QueryItemContextProvider>);
}

function OutputHintPopper({ popoverInfo }) {
    return (
        <InfoPopper
            content={popoverInfo}
            triggerButtonTitle="help"
            popoverProps={{
                anchorOrigin: {
                    vertical: 'center',
                    horizontal: 'center'
                },
                transformOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                },
                loadContentOnOpen: true
            }}
        />
    );
}

function InterruptedMsgRenderer({ query }) {
    if (query.interrupted) {
        return (
            <p>
                Got it, I've stopped the response. How can I assist you further?
            </p>
        );
    }
}
