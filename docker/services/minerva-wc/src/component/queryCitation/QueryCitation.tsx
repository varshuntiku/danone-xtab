import { useContext } from "preact/hooks";
import "./queryCitation.scss";
import { RootContext } from "../../context/rootContext";
import { ICitationType } from "../../model/ICitation";
import MarkdownRenderer from "../queryOutput/widgetOutput/widgets/markdownRenderer/MarkdownRenderer";
import VideoCitation from "./videoCitation/VideoCitation";
import PPTCitation from "./pptCitation/PPTCitation";

export default function QueryCitation() {
    const { citationService } = useContext(RootContext);
    const citationObj = citationService.activeCitationDetails?.value?.citation;
    // const citationType =
    //     citationService.activeCitationDetails?.value?.citation?.type;
    // const citationData =
    //     citationService.activeCitationDetails?.value?.citation?.data;

    return (
        <div
            className="MinervaQueryCitation-container"
            key={citationService?.activeCitationDetails?.value?.id}
        >
            {['text', 'markdown'].includes(
                citationService?.activeCitationDetails?.value?.contentType?.toString()
            ) ? (
                <p className="MinervaQueryCitation-title">
                    {citationService?.activeCitationDetails?.value?.content}
                </p>
            ) : null}
            {citationObj?.type === ICitationType.ppt ? (
                <PPTCitation citationsListData={citationObj?.data} />
            ) : null}
            {citationObj?.type === ICitationType.markdown ? (
                <MarkdownRenderer>{citationObj?.data}</MarkdownRenderer>
            ) : null}
            {citationObj?.type === ICitationType.video ? (
                <VideoCitation data={citationObj?.data} />
            ) : null}
        </div>

    )
}