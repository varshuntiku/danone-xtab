import { useContext } from "preact/hooks";
import { RootContext } from "../../../../../context/rootContext";
import "./recommendationCards.scss";
import useDisableUserInput from "../../../../../util/useDisableUserInput";
import ArrowForwardIcon from "../../../../../svg/ArrowForwardIcon";

export default function RecommendationCards({ data }) {

    const { queryService } = useContext(RootContext);
    const isDisabled = useDisableUserInput()

    const handleCardClick = (item: string) => {
        queryService.makeQuery(item,'text', 'recommended-prompt');
    }

    return (
        <div className="RecommendationCards">
            {data?.items?.map((item: string) => (
                <div key={item}
                    tabIndex={1}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleCardClick(item)
                        }
                    }}
                    onClick={() => handleCardClick(item)}
                    className={"RecommendationCards-card " + (isDisabled ? "RecommendationCards-disabledCard" : "")}>
                    <p className="RecommendationCards-cardTitle">
                        {item}
                        <ArrowForwardIcon />
                    </p>
                </div>
            ))}
        </div>
    )

}
