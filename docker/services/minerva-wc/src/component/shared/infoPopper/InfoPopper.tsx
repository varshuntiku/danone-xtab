import { useRef, useState } from "preact/hooks"
import MarkdownRenderer from "../../queryOutput/widgetOutput/widgets/markdownRenderer/MarkdownRenderer";
import Popover from "../popover/Popover";
import "./infoPopper.scss";
import FlatCloseIcon from "../../../svg/FlatCloseIcon";
import InfoIcon from "../../../svg/InfoIcon";

export default function InfoPopper({content="", triggerButtonTitle="", popoverProps = {}}) {
    const [open, setOpen] =  useState(false);
    const triggerButton = useRef();

    const handleClose = () => {
        setOpen(false);
    }
    return <>
        <button ref={triggerButton} className="MinervaIconButton MinervaInfoPopper-trigger-btn MinervaIconButton-small-bellow-md" onClick={() =>  setOpen(true)} title={triggerButtonTitle || "info"}>
            <InfoIcon />
        </button>
        <Popover anchorEle={triggerButton.current} open={open} onClose={handleClose} {...popoverProps}>
            <div className='MinervaInfoPopper-content' slot="content">
                <div className="MinervaInfoPopper-content-header">
                    <button className="MinervaIconButton MinervaInfoPopper-close-btn" onClick={() =>  setOpen(false)} title="close">
                        <FlatCloseIcon/>
                    </button>
                </div>
                <div className="MinervaInfoPopper-content-body">
                    <MarkdownRenderer>
                        {content}
                    </MarkdownRenderer>
                </div>
            </div>
        </Popover>
    </>
}