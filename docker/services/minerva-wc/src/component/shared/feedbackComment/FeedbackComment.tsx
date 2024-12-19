import "./feedbackComment.scss";
// import downcastFaceEmoji from "../../../assets/DowncastFaceEmoji.png"
import DowncastFaceEmoji from "../../../svg/DowncastFaceEmoji";
import { useContext, useEffect, useState } from "preact/hooks";
import CloseIcon from "../../../svg/CloseIcon";
import TickIcon from "../../../svg/TickIcon";
import { RootContext } from "../../../context/rootContext";
import TickCircleIcon from "../../../svg/TickCircleIcon";

const CommentTypes = ["Incorrect", "Offensive/unsafe", "Incomplete"];

export default function FeedbackComment({query, onCloseComment}) {
    const [comment, setComment] = useState(query?.comment || {});
    const {queryService, mainService} = useContext(RootContext);
    const [openCompleted, setOpenCompleted] = useState(false);

    useEffect(() => {
        setComment(query?.comment || {});
    }, [query?.comment])

    const handleTypeChange = (type) => {
        setComment(s =>  {
            s.type = type === s.type ? "" : type;
            return {...s};
        })
    }

    const handleTextChange = (text) => {
        setComment(s =>  {
            s.text = text;
            return s;
        })
    }
    const handleSubmit = () => {
        queryService.updateQueryRecord(query.id, {
            comment: comment
        });
        setOpenCompleted(true);
    }

    if(!query.id || !mainService.copilotAppId.value) {
        return null;
    }

    return <div className="MinervaFeedbackComment">
        {openCompleted? <div className="MinervaFeedback-header">
                <p>	<TickCircleIcon className="MinervaIcon" /> <span>Thanks for your time! Your input helps us improve your copilot experience</span> </p>
                <div style={{flex: 1}} />
                <button title="close" class="MinervaIconButton" onClick={onCloseComment}>
                    <CloseIcon/>
                </button>
            </div>
        : <>
            <div className="MinervaFeedback-completed">
                <p>	<DowncastFaceEmoji/> <span>Oh Sorry! Please let us know why did you choose this rating, So we can improve.</span> </p>
                <div style={{flex: 1}} />
                <button title="close" class="MinervaIconButton" onClick={onCloseComment}>
                    <CloseIcon/>
                </button>
            </div>
            <div className="MinervaFeedbackComment-options-container">
                {CommentTypes.map(el => <div
                selected={comment?.type === el}
                className="MinervaFeedbackComment-options-item"
                onClick={() => handleTypeChange(el)}>
                    {comment?.type === el? <TickIcon /> : null}
                    <span>{el}</span>
                </div>)}
            </div>

            <form onSubmit={e => {
                e.preventDefault();
                handleSubmit();
            }}>
                <label>Add your comments</label>
                <textarea rows={3} min={3} value={comment?.text} onChange={(e: any) => handleTextChange(e.target.value)} placeholder="Tell us more about what you didn't like..." />
                <button className="MinervaButton-text">Submit</button>
            </form>
        </>}
    </div>
}