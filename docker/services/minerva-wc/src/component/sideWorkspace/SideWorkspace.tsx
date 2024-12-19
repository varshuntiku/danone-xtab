import "./sideWorkspace.scss"
import CloseIcon from "../../svg/CloseIcon";
import { MutableRef, useRef } from "preact/hooks";
import DraggableDiv from './draggableDiv/DraggableDiv';
import PinnedQueries from '../pinnedQueries/PinnedQueries';
import DragExpandIcon from "../../svg/DragExpand";
import QueryCitation from "../queryCitation/QueryCitation";
import { SideWorkspaceContext } from "../../model/SideWorkspace";
import QueryStoryBoard from "../queryStoryBoard/QueryStoryBoard";

const WorkspaceObj = {
    0: {
        "title": "Pinned Response",
        "component": <PinnedQueries />
    },
    1: {
        "title": "View Sources",
        "component": <QueryCitation />
    },
    2: {
        "title": "Presentation",
        "component": <QueryStoryBoard />
    }
}


export default function SideWorkspace({ context, onClose }: { context: SideWorkspaceContext, onClose: () => void }) {
    const dragHandleRef: MutableRef<HTMLButtonElement> = useRef();
    return (<DraggableDiv className="MinervaSideWorkspace" dragHandleRef={dragHandleRef} minimumSize={450} >
        <div className="MinervaSideWorkspace-header">
            <p> {WorkspaceObj[context]?.title} </p>
            <div style={{ flex: 1 }} />
            <button title="close" className="MinervaIconButton MinervaSideWorkspace-close-btn" onClick={onClose}>
                <CloseIcon />
            </button>
        </div>
        <button className="MinervaIconButton MinervaSideWorkspace-expand-button" ref={dragHandleRef}>
            <DragExpandIcon />
        </button>
        <div className="MinervaSideWorkspace-expand-indicator">
        </div>
        <div className="MinervaSideWorkspace-pinnedQueries">
            {WorkspaceObj[context]?.component}
        </div>
    </DraggableDiv>)
}