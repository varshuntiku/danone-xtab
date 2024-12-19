import { useContext, useState } from "preact/hooks";
import { IQuery } from "../../model/Query";
import './pinnedQuery.scss';
import PersonIcon from "../../svg/PersonIcon";
import PinButton from "../shared/pinButton/PinButton";
import QueryResponsePreview from "./QueryResponsePreview";
import WidgetOutput from "../queryOutput/widgetOutput/WidgetOutput";
import MinervaAvatarIcon from "../../svg/MinervaAvatarIcon";
import { RootContext } from "../../context/rootContext";
import QueryItemContextProvider from "../../context/queryItemContext";
import { QueryServiceEvents } from "../../model/Events";
import ErrorBoundary from "../errorBoundaries/ErrorBoundaries";
import ExpandMoreIcon from "../../svg/ExpandMoreIcon";

export default function PinnedQuery({ query }: { query: Partial<IQuery> }) {
    const [expanded, setExpanded] = useState(false);
    const { queryService, minerva_avatar_url } = useContext(RootContext);

    const handleExpand = () => {
        setExpanded(s => !s);
    }

    const handleViewInChat = () => {
        queryService.eventTarget.dispatchEvent(QueryServiceEvents.JUMP_TO_QUERY, { detail: { id: query.id } })
    }

    return (<div className={"MinervaPinnedQuery " + (expanded ? "MinervaPinnedQuery-expanded" : "")}>
        <QueryItemContextProvider value={{ query, citationEnabled: false }}>
            <div className="MinervaPinnedQuery-header">
                <div className="MinervaAvatar">
                    <PersonIcon />
                </div>
                <p className="MinervaPinnedQuery-query-input">
                    {query.input}
                </p>
                <div style={{ flex: 1 }}></div>
                <div className="MinervaPinnedQuery-header-action">
                    <PinButton query_id={query.id} pinned={query.pinned} />
                    <button className="MinervaIconButton MinervaPinnedQuery-expand-btn" onClick={handleExpand} title='Expand more'>
                        <ExpandMoreIcon/>

                    </button>
                </div>
            </div>
            {expanded ?
                (<div className="MinervaPinnedQuery-response">
                    <div className="MinervaAvatar">
                        {minerva_avatar_url ? <img src={minerva_avatar_url} />
                            : <MinervaAvatarIcon />}
                    </div>
                    <div className="MinervaPinnedQuery-response-content">
                        {query.output?.response ?
                            <ErrorBoundary fallback="Failed to load">
                                <div className="MinervaPinnedQuery-visual-result">
                                    <WidgetOutput data={query.output.response} />
                                </div>
                            </ErrorBoundary>
                            : null}
                    </div>
                </div>)
                : <QueryResponsePreview query={query} />}
            <div className="MinervaPinnedQuery-bottom-actions">
                <div style={{ flex: 1 }}></div>
                <a className="MinervaPinnedQuery-link" onClick={handleViewInChat}>View in chat</a>
            </div>
        </QueryItemContextProvider>
    </div>)
}