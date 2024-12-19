import { useEffect, useState } from "preact/hooks";
import "./feedback.scss"
import ThumbsUpFilledIcon from "../../../svg/ThumbsUpFilledIcon";
import ThumbsUpOutlinedIcon from "../../../svg/ThumbsUpOutlinedIcon";
import ThumbsDownFilledIcon from "../../../svg/ThumbsDownFilledIcon";
import ThumbsDownOutlinedIcon from "../../../svg/ThumbsDownOutlinedIcon";
export default function Feedback({feedback, onChangeFeedback}) {
    const [_feedback, setFeedback] = useState(feedback);
    const handleFeedback = (like) => {
        const v = _feedback === like ? 0 : like;
        setFeedback(v);
        onChangeFeedback(v);
    };
    useEffect(() => {
        setFeedback(feedback);
    }, [feedback])
    return (
        <div className="MinervaFeedback">
            <button
                title="like"
                className={"MinervaIconButton MinervaIconButton-small-bellow-md " + (_feedback === 1 ? "MinervaFeedback-active" : '')}
                onClick={() => {
                    handleFeedback(1);
                }}
            >
                {_feedback === 1? <ThumbsUpFilledIcon />
                : <ThumbsUpOutlinedIcon />}
            </button>
            <button
                title="dislike"
                className={"MinervaIconButton  MinervaIconButton-small-bellow-md " + (_feedback === -1 ? "MinervaFeedback-active" : '')}
                onClick={() => {
                    handleFeedback(-1);
                }}
            >
                {_feedback === -1? <ThumbsDownFilledIcon />
                :<ThumbsDownOutlinedIcon />}
            </button>
        </div>
    );
}
