import { useContext } from "preact/hooks";
import LoadMore from "../shared/loadMore/LoadMore";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "../shared/timeline/Timeline";
import { RootContext } from "../../context/rootContext";
import "./promptHistory.scss"
import { QueryServiceEvents } from "../../model/Events";

export default function PromptHistory() {
    let {queryService} = useContext(RootContext);
    const loadMore = queryService.queries.value.length < queryService.total_count.value;

    const handleClick = (id) => {
        queryService.eventTarget.dispatchEvent(QueryServiceEvents.JUMP_TO_QUERY, {detail: {id: id}})
    };

    if (!queryService.queries.value.length) {
        return null;
    }
    return (
        <div className="MinervaPromptHistory">
            <Timeline>
                {[...queryService.queries.value]?.reverse()?.map((query, i) => (
                    <TimelineItem key={query.id}>
                        <TimelineSeparator>
                            <TimelineDot />
                            {!loadMore && i === queryService.queries.value.length - 1 ? null : <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <div
                                className="MinervaButtonBase"
                                onClick={() => handleClick(query.id)}
                                aria-label={query.input}
                            >
                                <p>
                                    {query.input}
                                </p>
                            </div>
                        </TimelineContent>
                    </TimelineItem>
                ))}
                {loadMore || queryService.loadingConversation.value ? (
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot />
                        </TimelineSeparator>
                        <TimelineContent>
                            <LoadMore />
                        </TimelineContent>
                    </TimelineItem>
                ) : null}
            </Timeline>
        </div>
    );
}
