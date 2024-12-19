import './pinnedQueries.scss';
import { RootContext } from "../../context/rootContext";
import { useContext, useState } from 'preact/hooks';
import { useSignalEffect } from '@preact/signals';
import { IQuery } from '../../model/Query';
import PinnedQuery from './PinnedQuery';
export default function  PinnedQueries() {
    const {queryService} = useContext(RootContext);
    const [pinnedQueries, setPinnedQueries] = useState<Partial<IQuery>[]>([]);

    useSignalEffect(() => {
        const queries = queryService.queries.value;
        const pinnedQueries = queries.filter(el => el.pinned)
        setPinnedQueries(pinnedQueries);
    })
    return (
        <div className="MinervaPinnedQueries">
            {pinnedQueries.map(el => (<PinnedQuery key={el.id} query={el} />))}
        </div>)
}