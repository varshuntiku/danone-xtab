import { useEffect, useState } from "preact/hooks";
import { IQuery, IWidget } from "../../model/Query";
import './queryResponsePreview.scss';
import { WidgetItem } from "../queryOutput/widgetOutput/WidgetOutput";

export default function QueryResponsePreview({query}: {query: Partial<IQuery>}) {
    const [widget, setWidget] = useState<IWidget>(null);
    useEffect(() => {
        let widgets = query.output?.response?.widgets?.flat() || [];
        let widget = widgets.find(el => el.type == 'chart');
        if (!widget) {
            widget = widgets.find(el => ['text', 'markdown'].includes(el.type.toString()));
        }
        setWidget(widget)
    }, [query]);

    return (<div className="MinervaQueryResponsePreview">
        <div className={"MinervaQueryResponsePreview-content " + (widget?.type === 'chart'? "MinervaQueryResponsePreview-content-chart" : "")}>
            {widget?
            <WidgetItem widget={widget} />
            :<pre className="MinervaTypo-pre">{query.output?.response?.text || "Preview Placeholder" }</pre>}
        </div>
    </div>)
}