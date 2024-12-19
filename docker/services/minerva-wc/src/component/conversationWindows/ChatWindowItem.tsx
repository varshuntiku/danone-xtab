import ConfirmPopup from "../shared/confirmPopup/ConfirmPopup";
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { useContext, useEffect, useState } from "preact/hooks";
import PromptHistory from "./PromptHistory";
import "./chatWindowItem.scss";
import { RootContext } from "../../context/rootContext";
import DeleteIcon from "../../svg/DeleteIcon";
import MessageIcon from "../../svg/MessageIcon";
import MessageOutlinedIcon from "../../svg/MessageOutlinedIcon";
import FlatCloseIcon from "../../svg/FlatCloseIcon";
import DoneIcon from "../../svg/DoneIcon";
import ExpandMoreIcon from "../../svg/ExpandMoreIcon";

dayjs.extend(calendar)

export default function ChatWindowItem({ data, selected=false, onSelect=(close:boolean) => {} }) {
    const [editOn, setEditOn] = useState(false);
    const [title, setTilte] = useState(data?.title);
    const [expanded, setExpanded] = useState(false);
    const {queryService} = useContext(RootContext);

    useEffect(() => {
        if (!selected) {
            setExpanded(false);
        }
    }, [selected]);

    const handleComplete = (e) => {
        e.stopPropagation();
        setEditOn(false);
        queryService.updateConversationWindow(data.id, {
            title: title
        });
    };

    const handleExpand = (e) => {
        e.stopPropagation();
        if(!selected) {
            onSelect(false);
        }
        setExpanded((s) => !s);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        queryService.deleteConversationWindow(data.id)
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setEditOn(false);
        setTilte(data?.title);
    }

    return (
        <div data-testid={data.id + "_convo_windo_item"}
        className={`MinervaChatWindowItem ${selected? "MinervaChatWindowItem-selected" : ""} ${expanded? "MinervaChatWindowItem-expanded" : ""}`}
        onClick={() => onSelect(true)}>
            <div className="MinervaChatWindowItem-row1">
                {/* <span className={`material-symbols-outlined MinervaChatWindowItem-chaticon ${selected? "MinervaIcon-filled" : "null"}`}>
                chat
                </span> */}
                {selected?
                    <MessageIcon className="MinervaChatWindowItem-chaticon" />
                    :<MessageOutlinedIcon className="MinervaChatWindowItem-chaticon" />
                }
                <div className={`MinervaChatWindowItem-title ${editOn?  "MinervaChatWindowItem-title-editing" : null}`}>
                    <input placeholder="Conversation name" value={title} onChange={(e: any) => {
                        setEditOn(true);
                        setTilte(e.target.value)
                    }} onClick={e => e.stopPropagation()} title={title} />
                    <button className="MinervaIconButton" onClick={handleCancelEdit} title="close">
                        <FlatCloseIcon />
                    </button>
                    <button className="MinervaIconButton" onClick={handleComplete} title="save">
                        <DoneIcon />
                    </button>
                </div>
                <div aria-label="action container" className="MinervaChatWindowItem-actions" onClick={(e) => e.stopPropagation()}>
                    <ConfirmPopup
                        onConfirm={handleDelete}
                        title={title}
                        subTitle="Delete conversation history. Are you sure?"
                    >
                        {(triggerConfirm) => (
                            <button
                                className="MinervaIconButton MinervaChatWindowItem-delete-btn"
                                onClick={triggerConfirm}
                                aria-label="delete"
                            >
                                <DeleteIcon />
                            </button>
                        )}
                    </ConfirmPopup>
                    <button
                        className="MinervaIconButton MinervaChatWindowItem-expand-btn"
                        onClick={handleExpand}
                        aria-label="Expand more"
                    >
                        <ExpandMoreIcon/>
                    </button>
                </div>
            </div>
            <div className="MinervaChatWindowItem-row2">
                <p>
                    {dayjs(data.created_at).calendar()}
                </p>
                <div style={{ flex: 1 }}></div>
                {/* {selected ? (
                    <button
                        className="MinervaIconButton"
                        onClick={handleExpand}
                        aria-label="Expand more"
                    >
                        <span class="material-symbols-outlined">
                        expand_more
                        </span>
                    </button>
                ) : null} */}
            </div>
            <div className={`MinervaChatWindowItem-row3 ${expanded? "MinervaChatWindowItem-row3-expended"  : null}`}>
                {selected ? <PromptHistory /> : null}
            </div>
        </div>
    );
}