import { useState } from "preact/hooks";
import "./recommendationBox.scss";
import useDisableUserInput from "../../../../../util/useDisableUserInput";

export default function RecommendationBox({ data }) {

    const [buttonText, setButtonText] = useState('Copy')
    const isDisabled = useDisableUserInput()

    const handleCopyClick = () => {
        navigator.clipboard.writeText(data?.items?.join(' '));
        setButtonText('Copied!')
        setTimeout(() => {
            setButtonText('Copy')
        }, 500)
    }

    return (
        <div className="MinervaRecommendationBox">
            <div className="MinervaRecommendationBox-header">
                <p className="MinervaTypo-title1 MinervaRecommendationBox-title MinervaTypo-color-70">{data.title}</p>
                {data?.enableCopyButton && <button className="MinervaButton-outlined-small MinervaRecommendationBox-copyButton" onClick={handleCopyClick} disabled={isDisabled}>{buttonText}</button>}
            </div>
            {data?.items?.map((item: string) => (
                <p className="MinervaTypo-color-70 MinervaRecommendationBox-queries" key={item}>
                    {item}
                </p>
            ))}
        </div>
    )

}
