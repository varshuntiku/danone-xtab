import { useState, useContext, useEffect, useRef } from "preact/hooks";
import Tabs, { TabsContainer } from "../shared/tabs/Tabs";
import Tab from "../shared/tabs/Tab";
import TabPanel from "../shared/tabs/TabPanel";
import './queryStoryBoard.scss';
import { RootContext } from '../../context/rootContext';
import List from '../shared/list/List';
import SyncIcon from '../../svg/SyncIcon';
import AddToListIcon from '../../svg/AddToListIcon';
import { QueryServiceEvents } from "../../model/Events";
import { ViewModeContext } from "../../context/viewModeContext";
import { Fragment } from "preact/jsx-runtime";

export default function QueryStoryBoard() {
    const [activeTab, setActiveTab] = useState(0);
    const [storyBoardQueries, setStoryBoardQueries] = useState<Array<{ id: number | string; content: string; selected: boolean; datasource?: Array<File>; }>>([]);
    const storyBoardQueriesRef = useRef(storyBoardQueries);
    const orientation = 'horizontal';
    const { queryService } = useContext(RootContext);
    const { sideWorkspaceContext, openSideWorkspace } = useContext(ViewModeContext);

    const handleTabClick = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };

    const handleIncludeAllConversation = () => {
        const queries = queryService.queries.value.map((query) => {
            if (query && (!query.request_type || !query.request_type.includes("storyboard")) && Number.isInteger(query.id) && !query.error && !query.output?.response?.skip_storyboard) {
                return {
                    id: query.id,
                    content: query.input,
                    selected: true,
                    datasource: query.input === ""
                        ? query.datasource
                        : undefined,
                };
            }
        }).filter(query => query);
        setStoryBoardQueries(queries);
        queryService.queries.value = queryService.queries.value.map((query) => {
            if (query && (!query.request_type || !query.request_type.includes("storyboard")) && !query.error && !query.output?.response?.skip_storyboard) {
                return {
                    ...query,
                    selected: true
                };
            }
            return query;
        });
    };

    const handleQuerySelect = (id: number) => {
        const updatedQueries = storyBoardQueries.map(query =>
            query.id === id ? { ...query, selected: !query.selected } : query
        );
        setStoryBoardQueries(updatedQueries);
        queryService.updateQuery(id, { selected: updatedQueries.find(q => q.id === id)?.selected });
    };

    const handleSelectAll = (selectAll: boolean) => {
        const userQueryIds = new Set(storyBoardQueries.map(query => query.id));
        const updatedQueries = storyBoardQueries.map(query => ({ ...query, selected: selectAll }));
        setStoryBoardQueries(updatedQueries);

        queryService.queries.value = queryService.queries.value.map(query => {
            if (userQueryIds.has(query.id)) {
                return { ...query, selected: selectAll };
            }
            return query;
        });
    };

    const handleViewInChat = (query_id: number | string) => {
        queryService.eventTarget.dispatchEvent(QueryServiceEvents.JUMP_TO_QUERY, { detail: { id: query_id } });
    };

    useEffect(() => {
        const handleStoryBoardUpdate = (e) => {
            const storyBoardQuery = storyBoardQueriesRef.current.find(query => query.id === e.detail?.id);
            let updatedQueries = [];
            if (storyBoardQuery) {
                updatedQueries = storyBoardQueriesRef.current.map(query =>
                    query.id === e.detail?.id ? { ...query, selected: !query.selected } : query
                );
            } else {
                updatedQueries = [...storyBoardQueriesRef.current, { id: e.detail?.id, content: e.detail?.query, selected: true, datasource: e.detail?.datasource }];
            }
            setStoryBoardQueries(updatedQueries);
        };

        queryService.eventTarget.addEventListener(QueryServiceEvents.QUERY_SELECT, handleStoryBoardUpdate);

        return () => {
            queryService.eventTarget.removeEventListener(QueryServiceEvents.QUERY_SELECT, handleStoryBoardUpdate);
        };
    }, [queryService]);

    useEffect(() => {
        storyBoardQueriesRef.current = storyBoardQueries;
    }, [storyBoardQueries]);

    const handleGenerateOutline = () => {
        const selectedQueries = storyBoardQueries.map(query => {
            if (query.selected) {
                return query.id
            }
        }).filter(query => query)
        queryService.makeQuery('Generate Outline', 'text', 'storyboard:outline', {
            "selected_conversations": selectedQueries
        });
    }

    useEffect(() => {
        setStoryBoardQueries([]);
        queryService.queries.value = queryService.queries.value.map(query => ({
            ...query,
            selected: false
        }));
    }, [queryService.selectedWindowId.value, openSideWorkspace, sideWorkspaceContext]);

    const isOutlineBtnDisabled = queryService.stopQueryFetch.value || !(storyBoardQueries.some(query => query.selected))
    return (
        <div className='MinervaStoryBoard-root'>
            <TabsContainer orientation={orientation}>
                <Tabs orientation={orientation}>
                    <Tab
                        label='Create Presentation'
                        value={0}
                        onTabClick={handleTabClick}
                        activeTabIndex={activeTab}
                        orientation={orientation}
                    />
                    {/* TO DO - History tab Implementation */}
                    {/* <Tab
                        label='History'
                        value={1}
                        onTabClick={handleTabClick}
                        activeTabIndex={activeTab}
                        orientation={orientation}
                        disabled
                    /> */}
                </Tabs>
                <TabPanel activeTabIndex={activeTab} index={0}>
                    <div className="MinervaStoryboard-query-items">
                        <div className="MinervaStoryBoard-include-all-container">
                            <p className="MinervaStoryBoard-include-all-label">Include All Conversations</p>
                            <button onClick={handleIncludeAllConversation} className="MinervaIconButton"> <SyncIcon /> </button>
                        </div>

                        {storyBoardQueries.length > 0 ? (
                            <Fragment>
                                <List
                                    listItems={storyBoardQueries}
                                    onListItemSelect={handleQuerySelect}
                                    onSelectAll={handleSelectAll}
                                    onListItemClick={handleViewInChat}
                                />
                                <button className="MinervaButton MinervaStoryOutline-button" disabled={isOutlineBtnDisabled} onClick={handleGenerateOutline}>Generate Outline</button>
                            </Fragment>
                        ) : (
                            <div className="MinervaAddToListIcon">
                                <AddToListIcon />
                                <p>Select prompts to create presentation</p>
                            </div>
                        )}
                    </div>
                </TabPanel>
            </TabsContainer>
        </div>
    );
}
