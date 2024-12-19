import { useContext } from "preact/hooks";
import { RootContext } from "../../../context/rootContext";

export default function LoadMore() {
    const {queryService} = useContext(RootContext)

    const handleLoadMore = () => {
        queryService.loadConversation();
    };

    if (queryService.loadingConversation.value) {
        return <p>Loading...</p>;
    }

    if (queryService.queries.value.length < queryService.total_count.value) {
        return (
            <button
                className="MinervaButton-outlined-small"
                onClick={handleLoadMore}
                aria-label="Load more"
            >
                Load more
            </button>
        );
    } else return null;
}
