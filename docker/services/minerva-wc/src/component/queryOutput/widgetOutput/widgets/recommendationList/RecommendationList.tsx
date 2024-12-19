import { useContext } from "preact/hooks";
import { RootContext } from "../../../../../context/rootContext";
import "./recommendationList.scss";
import useDisableUserInput from "../../../../../util/useDisableUserInput";

export default function RecommendationList({ data, onClick = null }) {
    const { queryService } = useContext(RootContext);
    const isDisabled = useDisableUserInput();

    const handleItemClick = (item: string) => {
        if (onClick) {
            onClick(item);
        } else {
            queryService.makeQuery(item,'text', "recommended-followup");
        }
    };

    return (
        <div className="RecommendationList-container">
            <div>
                {data?.title && (
                    <p className="MinervaTypo-title1 MinervaRecommendationList-title MinervaTypo-color-70">
                        {data.title}
                    </p>
                )}
            </div>
            <div className="RecommendationList-list">
                {data?.items?.map((item: string) => (
                    <div
                        key={item}
                        tabIndex={1}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleItemClick(item);
                            }
                        }}
                        onClick={() => handleItemClick(item)}
                        className={
                            "RecommendationList-item " +
                            (isDisabled ? "RecommendationList-disabledItem" : "")
                        }
                    >
                        <p className="RecommendationList-content" title={item}>
                            {item}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
