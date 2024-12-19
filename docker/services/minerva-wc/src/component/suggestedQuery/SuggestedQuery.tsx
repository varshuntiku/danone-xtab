import { useContext, useEffect, useState } from "preact/hooks";
import "./suggestedQuery.scss";
import { RootContext } from "../../context/rootContext";
import { ViewModeContext } from "../../context/viewModeContext";
// import { makeQuery } from "../../service/queryService";
// const SuggestedQueries = [
//     "What data do we have access to, and how relevant and reliable is this data for our strategic goals?",
//     "Can we identify any anomalies or outliers in the data, and what do they signify?",
//     "How well does our model perform when tested against historical data?",
//     "How can we leverage data to gain deeper insights into customer behavior and preferences?",
//     "How do the pattern recognition techniques scale with increasing data size?",
//     "What types of errors does our model make, and what are the potential consequences of these errors?"
// ]
export default function SuggestedQuery({}) {
    const {queryService, suggested_queries = []} = useContext(RootContext);
    const [suggestedQueries, setSuggestedQuery] = useState([]);
    const {popperExpanded, popper, variant} = useContext(ViewModeContext);
    const handleSendQuery = (el) => {
        queryService.makeQuery(el,'text')
    };

    useEffect(() => {
        const filter = variant === 'fullscreen-mini'|| popper? !popperExpanded : false;
        if (filter) {
            setSuggestedQuery(suggested_queries?.slice(0, 3) || [])
        } else {
            setSuggestedQuery(suggested_queries || [])
        }
    }, [suggested_queries, popperExpanded, popper, variant])
    return (
        <div className="MinervaSuggestedQuery">
            <div className="MinervaSuggestedQuery-list">
                {suggestedQueries.map(el => (<div key={el} className="MinervaSuggestedQuery-item MinervaNucliosBorder"
                onClick={() => handleSendQuery(el)}>
                    {el}&nbsp;→
                    {/* <span class="material-symbols-outlined">
                    trending_flat
                    </span> */}
                </div>))}
            </div>
        </div>
    );
}