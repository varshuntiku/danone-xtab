import GridViewIcon from "../../../../../svg/GridViewIcon";
import "./linkCards.scss";

export default function LinkCards({ data }) {

    return (
        <div className="MinervaLinkCards-container">
            {data?.title &&
                <div>
                    <p className="MinervaTypo-title2 MinervaTypo-color-70">
                        {data.title}
                    </p>
                </div>
            }
            <div className="MinervaLinkCards-list">
                {data?.items?.map((item: object) => (
                    <a key={item}
                        className="MinervaLinkCard-box"
                        title="Open in a new tab"
                        href={item["url"]}
                        target="_blank"
                    >
                        <div className="MinervaLinkCard-header">
                            <div className="MinervaLinkCard-logoContainer">
                                {/* TO DO: implement dynamic svg icons logic  */}
                                {/* <span className="material-symbols-outlined MinervaLinkCard-logo">
                                    {item["logo"] || "grid_view"}
                                </span> */}
                                <GridViewIcon className="MinervaLinkCard-logo MinervaIconContrast"/>
                            </div>
                            <p className="MinervaTypo-color-70 MinervaLinkCard-title">{item["title"]}</p>
                        </div>
                        {item["desc"] && <p className="MinervaTypo-color-70 LinkCard-description">{item["desc"]}</p>}
                        {item["caption"] && <em className="MinervaTypo-color-70 LinkCard-caption">{item["caption"]}</em>}
                    </a>
                ))}
            </div>
        </div>
    )

}
