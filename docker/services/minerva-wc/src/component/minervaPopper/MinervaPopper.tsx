import { useContext, useRef, useState } from "preact/hooks"
import Popover from "../shared/popover/Popover";
import "./minervaPopper.scss";
import { RootContext } from "../../context/rootContext";
import MinervaFullScreen from "../minervaFullScreen/MinervaFullScreen";
import { buttonVariantToClass } from "../../util";
import MinervaAvatarIcon from "../../svg/MinervaAvatarIcon";
import CloseIcon from "../../svg/CloseIcon";
import Minimize from "../../svg/Minimize";
import ExpandIcon from "../../svg/ExpandIcon";
import { BaseEvents, MainServiceEvents } from "../../model/Events";
import CloseFullscreenIcon from "../../svg/CloseFullscreenIcon";
import OpenInNewIcon from "../../svg/OpenInNewIcon";

export default function MinervaPopper() {
    const [open, setOpen] =  useState(false);
    const {minerva_avatar_url, hide_trigger_button, open_popper, external_open_in_new, external_open_in_new_title, suppress_fullscreen_toggler, trigger_button_variant, minerva_alias="Ask NucliOS", mainService, queryService} = useContext(RootContext);
    const triggerButton = useRef();
    const [expanded, setExpanded] = useState(false);

    const handleOpenPopper = () =>  {
        setOpen(true);
        const event = new Event(BaseEvents.POPPER_OPEN, { bubbles: true });
        this.base.dispatchEvent(event);
    }

    const handleClose = () => {
        setOpen(false);
        const event = new Event(BaseEvents.POPPER_CLOSE, { bubbles: true });
        this.base.dispatchEvent(event);
    }
    const handleOpenInNew = () => {
        const event = new Event(BaseEvents.OPEN_IN_NEW, { bubbles: true });
        this.base.dispatchEvent(event);
    }

    const handleExpand = () => {
        setExpanded(true);
        const event = new Event(BaseEvents.POPPER_EXPANDED, { bubbles: true });
        this.base.dispatchEvent(event);
    }

    const handleMinimize = () => {
        setExpanded(false);
        const event = new Event(BaseEvents.POPPER_MINIMIZE, { bubbles: true });
        this.base.dispatchEvent(event);
    }

    const handleExit = () => {
        setOpen(false);
        queryService.startNewChatWindow();
        const event = new Event(BaseEvents.POPPER_EXIT, { bubbles: true });
        this.base.dispatchEvent(event);
        mainService.eventTarget.dispatchEvent(MainServiceEvents.POPPER_EXIT)
    }

    const openPopper = hide_trigger_button? open_popper : open;
    const isAppDetailsLoading= mainService?.loadingCopilotAppDetails.value || mainService?.loadingConsumerDetails.value;

    return <>
        {isAppDetailsLoading || hide_trigger_button ?
        null
        : trigger_button_variant === "float"?
        <button
        title={"open " + (minerva_alias || "Ask NucliOS")}
        ref={triggerButton}
        className="MinervaIconButton MinervaPopper-floater-btn MinervaPopper-trigger-btn MinervaFadeInAnimation"
        onClick={handleOpenPopper}>
            {minerva_avatar_url? <img src={minerva_avatar_url} alt="avatar" />
                : <MinervaAvatarIcon />}
        </button>
        : <button
        title={"open " + (minerva_alias || "Ask NucliOS")}
        ref={triggerButton}
        className={buttonVariantToClass(trigger_button_variant) + " MinervaButton MinervaPopper-trigger-btn MinervaFadeInAnimation"}
        onClick={handleOpenPopper}>
            {minerva_avatar_url? <img src={minerva_avatar_url} alt="avatar" />
                : <MinervaAvatarIcon />} {(minerva_alias || "Ask NucliOS")}
        </button>}

        <Popover
            fullscreen={expanded}
            className={"MinervaPopperDialog " + (expanded? "MinervaPopperDialog-expanded" : "")}
            anchorEle={triggerButton.current}
            open={openPopper}
            onClose={handleClose}
            transformOrigin={trigger_button_variant === "float"? {
                vertical:"bottom",
                horizontal: "left"
            } : undefined}
            anchorOrigin={trigger_button_variant === "float"? {
                vertical:"bottom",
                horizontal: "left"
            } : undefined}
        >
            <MinervaFullScreen
                renderedOnPopper={true}
                popperOpened={openPopper}
                popperExpanded={expanded}
                handleExpand={handleExpand}
                headerRightActionsChildren={<>

                <button title= "minimize" onClick={handleClose} class="MinervaIconButton MinervaFullscreenToggler"><Minimize/></button>
                {suppress_fullscreen_toggler?
                null :

                expanded? <button class="MinervaIconButton MinervaFullscreenToggler" onClick={handleMinimize} title="Minimize">
                        <CloseFullscreenIcon/>
                    </button>
                    : <button class="MinervaIconButton MinervaFullscreenToggler" onClick={handleExpand} title="Expand">
                        <ExpandIcon/>
                    </button>}
                {external_open_in_new? <button class="MinervaIconButton" onClick={handleOpenInNew} title={external_open_in_new_title}>
                    <OpenInNewIcon/>
                </button> : null}
                <button title="close" class="MinervaIconButton" onClick={handleExit}>
                <CloseIcon/>
                </button>
            </>}
            />
        </Popover>
    </>
}