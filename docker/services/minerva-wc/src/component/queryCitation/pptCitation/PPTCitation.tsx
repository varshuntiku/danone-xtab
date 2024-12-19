import { Fragment } from "preact/jsx-runtime";
import ImageRenderer from "../../queryOutput/widgetOutput/widgets/imageRenderer/ImageRenderer";
import CitationSourceIcon from "../../../svg/CitationSourceIcon";
import "./pptCitation.scss"
import { useState } from "preact/hooks";
import CustomLink from "../../shared/link/CustomLink";
import { ICitationPPTData } from "../../../model/ICitation";
import OpenInNewIcon from "../../../svg/OpenInNewIcon";

type PPTCitationData = {
    citationsListData: Array<ICitationPPTData>
}

export default function PPTCitation({ citationsListData }: PPTCitationData) {
    const [activeIndex, setActiveIndex] = useState(0)

    const sourceImageClickHandler = (idx: number) => {
        setActiveIndex(idx)
    }
    return (
        <div className={"MinervaPPTCitation MinervaNucliosBorder " + (citationsListData?.length === 1? " MinervaPPTCitation-single-item-root" : "")}>
            {citationsListData?.length > 1 ? (
                <div className="MinervaPPTCitation-list" id="#citationList">
                    {citationsListData?.map((item: ICitationPPTData, index: number) => (
                        <div key={item.img_url || item.image_url} className={`MinervaPPTCitation-list-item ${activeIndex === index ? "MinervaPPTCitation-list-item-active" : ""}`}>
                            <p>{index + 1}</p>
                            <div onClick={() => sourceImageClickHandler(index)} onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    sourceImageClickHandler(index)
                                }
                            }}>
                                <ImageRenderer data={{ url: item.img_url || item.image_url }} hideFullScreenButton={true} whiteBg={true} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
            <div className="MinervaPPTCitation-preview">
                {citationsListData ? (
                    <Fragment>
                        <ImageRenderer data={{ url: citationsListData[activeIndex]?.img_url || citationsListData[activeIndex]?.image_url }} hideFullScreenButton={true} whiteBg={true} />
                        <div className="MinervaPPTCitation-hyperlink-container">
                            {citationsListData[activeIndex]?.source_url ? (
                                <CustomLink url={citationsListData[activeIndex].source_url} title="Open in new tab" target="_blank">
                                    <CitationSourceIcon className="MinervaPPTCitation-source-icon"/>
                                    <span className="MinervaPPTCitation-document-name">{citationsListData[activeIndex].name || 'Go to source document'}</span>
                                    <OpenInNewIcon className="MinervaPPTCitation-open-in-new MinervaIcon"/>
                                </CustomLink>
                            ) : null}
                            {!citationsListData[activeIndex]?.source_url && citationsListData[activeIndex]?.name ? <span className="MinervaPPTCitation-document-name">{citationsListData[activeIndex].name}</span> : null}
                        </div>
                    </Fragment>
                ) : null}
            </div>
        </div>
    )
}