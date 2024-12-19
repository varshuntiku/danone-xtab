import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { IResponse, IWidget } from "../../../model/Query";
import "./widgetOutput.scss";
import CardView from "./widgets/cardView/CardView";
import ChartView from "./widgets/chartView/ChartView";
import DataTable from "./widgets/dataTable/DataTable";
import MarkdownRenderer from "./widgets/markdownRenderer/MarkdownRenderer";
import QueryFormInput from "./widgets/queryFormInput/QueryFormInput";
import ImageView from "./widgets/imageView/ImageView";
import RecommendationBox from "./widgets/queryInfoView/RecommendationBox";
import RecommendationCards from "./widgets/recommendationCards/RecommendationCards";
import RecommendationList from "./widgets/recommendationList/RecommendationList";
import LinkCards from "./widgets/linkCards/LinkCards";
import CitationController from "./citationController/CitationController";
import QueryInsight from "../../shared/insight/QueryInsight";
import GraphIcon from "../../../svg/GraphIcon";
import CodeBlockRenderer from "./widgets/codeBlockRenderer/CodeBlockRenderer";
import Cursor from "../../shared/cursor/Cursor";
import { QueryItemContext } from "../../../context/queryItemContext";
import OutlineEditor from "./widgets/outlineEditor/OutlineEditor";
import FileListRenderer from "./widgets/fileListRenderer/FileListRenderer";
import ArrowDropDown from "../../../svg/ArrowDropDown";
import ExpandIcon from "../../../svg/ExpandIcon";
import CloseFullscreenIcon from "../../../svg/CloseFullscreenIcon";
import { BaseEvents } from "../../../model/Events";

import { RootContext } from "../../../context/rootContext";

type WidgetOutputType = {
    data: Partial<IResponse>,
    chartExpandHandler?: ((chartExpandedFlag: boolean | ((prevState: boolean) => boolean)) => void) | null,
    chartExpanded?: boolean
}
export default function WidgetOutput({ data, chartExpandHandler = null, chartExpanded = false }: WidgetOutputType) {
    return <div className="MinervaWidgetOutput">
        {data?.entities ? (
            <QueryInsight insights={data?.entities} />
        ) : null}
        {data.widgets?.map((widget, i) => {
            if (widget instanceof Array) {
                return <WidgetListRenderer widgets={widget} key={i} chartExpandHandler={chartExpandHandler} chartExpanded={chartExpanded} />
            } else {
                return <WidgetRenderer widget={widget} key={i} />
            }
        })}
        <pre className="MinervaTypo-pre">
            {data.text}
        </pre>
    </div>
}

type WidgetListRendererType = {
    widgets: Array<IWidget>,
    chartExpandHandler: ((chartExpandedFlag: boolean | ((prevState: boolean) => boolean)) => void) | null,
    chartExpanded: boolean
}
function WidgetListRenderer({ widgets, chartExpandHandler = null, chartExpanded = false }: WidgetListRendererType) {
    const [index, setIndex] = useState(0);
    const selectRef = useRef<HTMLSelectElement>()
    const { query } = useContext(QueryItemContext);
    const { queryService } = useContext(RootContext);

    useEffect(() => {
        const selectedWidgetIndex = widgets.findIndex(widget => widget.selected);
        setIndex(selectedWidgetIndex !== -1 ? selectedWidgetIndex : 0);
    }, [widgets]);

    const handleWidgetTypeChange = (e: any) => {
        const selectedWidgetName = e.target.value;
        setIndex(widgets.findIndex(widget => widget.name === selectedWidgetName));

        const existingWidgets = query.output.response.widgets;

        const updatedWidgets = existingWidgets.map(widgetGroup => {
            if (Array.isArray(widgetGroup)) {
                return widgetGroup.map(widget => ({
                    ...widget,
                    selected: widget.name === selectedWidgetName,
                }));
            }
            return {
                ...widgetGroup,
                selected: widgetGroup.name === selectedWidgetName,
            };
        });

        const updatedResponse = {
            ...query.output.response,
            widgets: updatedWidgets,
        };

        queryService.updateQueryRecord(query.id, {
            output: { ...query.output, response: updatedResponse },
        });
    };


    const handleChartExpand = () => {
        chartExpandHandler && chartExpandHandler(true);
    };

    const handleChartCollapse = () => {
        chartExpandHandler && chartExpandHandler(false);
    };

    return <div className="MinervaWidgetListRenderer">
        {widgets[index] ? (
            <div className="MinervaWidgetListRenderer-header">
                <p>{widgets[index]?.title}</p>
                <fieldset>
                    <GraphIcon />
                    <select
                        ref={selectRef}
                        value={widgets[index]?.name}
                        title={widgets[index]?.name}
                        onChange={handleWidgetTypeChange}
                        aria-label="widget select"
                    >
                        {widgets.map(el => (
                            <option key={el.name} value={el.name}>
                                {el.name}
                            </option>
                        ))}
                    </select>
                    <ArrowDropDown className="MinervaIcon" />
                </fieldset>
                <button class="MinervaIconButton MinervaFullscreenToggler" onClick={chartExpanded ? handleChartCollapse : handleChartExpand} title="Expand">
                    {chartExpanded ? <CloseFullscreenIcon/> : <ExpandIcon/>}
                </button>
            </div>
        ) : null}

        {widgets[index] ? (
            <div className="MinervaCitationController">
                <CitationController citation={widgets[index]?.citation} contentType={widgets[index]?.type} content={widgets[index]?.value}>
                    <WidgetItem widget={widgets[index]} />
                </CitationController>
            </div>
        ) : null}
    </div>
}

type WidgetRendererType = {
    widget: IWidget
}
function WidgetRenderer({ widget }: WidgetRendererType) {
    return <div className="MinervaWidgetRenderer">
        {widget?.title ?
            <p>
                {widget?.title}
            </p>
            : null
        }
        <CitationController citation={widget?.citation} contentType={widget?.type} content={widget?.value}>
            <WidgetItem widget={widget} />
        </CitationController>
    </div>
}

type WidgetItemType = {
    widget: IWidget
}
export function WidgetItem({ widget }: WidgetItemType) {
    let widgetValue = widget?.value;
    const { query } = useContext(QueryItemContext)
    switch (widget?.type) {
        case 'card':
            return <CardView graphData={widgetValue} />;
        case 'dataTable':
            return <div className="MinervaDataTableWrapper"><DataTable
                columns={widgetValue?.data?.columns}
                values={widgetValue?.data?.values}
            /></div>
        case 'chart':
            return <ChartView params={widgetValue} />
        case 'text':
            return <pre className="MinervaTypo-pre">{widgetValue}{widget.next && widgetValue && query.status === 'streaming' ? <Cursor /> : null}</pre>
        // case 'text-list':
        //     return <TextList data={widgetValue} />
        case 'markdown':
            return <MarkdownRenderer>
                {widgetValue}
                {/* {(widgetValue || "") +  (query.status === "streaming" ? "<Cursor/>" : "")} */}
            </MarkdownRenderer>
        case 'input-form':
            return <QueryFormInput data={widgetValue} />
        case 'imageList':
            return <ImageView data={widgetValue} />
        case 'recommendation-cards':
            return <RecommendationCards data={widgetValue} />
        case 'recommendation-box':
            return <RecommendationBox data={widgetValue} />
        case 'recommendation-list':
            return <RecommendationList data={widgetValue} />
        case 'link-cards':
            return <LinkCards data={widgetValue} />
        case 'codeBlockWrapper':
            return <CodeBlockRenderer data={widgetValue} />
        case 'outlineEditor':
            return <OutlineEditor data={widgetValue} />
        case 'fileList':
            return <FileListRenderer data={widgetValue} />
        default:
            return <em>Unknown component.</em>
    }
}