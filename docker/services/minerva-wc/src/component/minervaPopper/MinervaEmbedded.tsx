import { useContext, useRef, useState } from "preact/hooks";
import { RootContext } from "../../context/rootContext";
import MinervaFullScreen from "../minervaFullScreen/MinervaFullScreen";
import CloseIcon from "../../svg/CloseIcon";
import Minimize from "../../svg/Minimize";
import CloseFullscreenIcon from "../../svg/CloseFullscreenIcon";
import ExpandIcon from "../../svg/ExpandIcon";
import { BaseEvents, MainServiceEvents } from "../../model/Events";
import OpenInNewIcon from "../../svg/OpenInNewIcon";
import "./minervaEmbedded.scss"
import "./minervaPopper.scss";
import "../shared/infoPopper/infoPopper.scss";
import Popover from "../shared/popover/Popover";
import MenuBarIcon from "../../svg/MenuBarIcon";
import PinnedListIcon from "../../svg/PinnedListIcon";
import PresentationIcon from "../../svg/PresentationIcon";
import { SideWorkspaceContext } from "../../model/SideWorkspace";

export default function MinervaEmbedded() {
  const [open, setOpen] = useState(false);
  const {
    minerva_avatar_url,
    hide_trigger_button,
    open_popper,
    external_open_in_new,
    external_open_in_new_title,
    suppress_fullscreen_toggler,
    trigger_button_variant,
    minerva_alias = "Ask NucliOS",
    mainService,
    queryService,
    utilService
  } = useContext(RootContext);
  const triggerButton = useRef();
  const [expanded, setExpanded] = useState(false);
  const [openInfoPopper, setOpenInfoPopper] = useState(false);
  const anchorEle = useRef()


  const handleOpenPopper = () => {
    setOpen(true);
    const event = new Event(BaseEvents.POPPER_OPEN, { bubbles: true });
    this.base.dispatchEvent(event);
  };

  const handleClose = () => {
    setOpen(false);
    setExpanded(false);
    const event = new Event(BaseEvents.POPPER_CLOSE, { bubbles: true });
    this.base.dispatchEvent(event);
  };
  const handleOpenInNew = () => {
    const event = new Event(BaseEvents.OPEN_IN_NEW, { bubbles: true });
    this.base.dispatchEvent(event);
  };

  const handleExpand = () => {
    setExpanded(true);
    const event = new Event(BaseEvents.POPPER_EXPANDED, { bubbles: true });
    this.base.dispatchEvent(event);
  };

  const handleMinimize = () => {
    setExpanded(false);
    const event = new Event(BaseEvents.POPPER_MINIMIZE, { bubbles: true });
    this.base.dispatchEvent(event);
    utilService.closeSideWorkspace();
  };

  const handleExit = () => {
    setExpanded(false);
    setOpen(false);
    queryService.startNewChatWindow();
    const event = new Event(BaseEvents.POPPER_EXIT, { bubbles: true });
    this.base.dispatchEvent(event);
    mainService.eventTarget.dispatchEvent(MainServiceEvents.POPPER_EXIT);
  };

  const openPopper = hide_trigger_button ? open_popper : open;

  const handleFullscreenClick = () => {
        setOpenInfoPopper(false)
        handleExpand();
  }

  const handleMenuClose = () => {
    setOpenInfoPopper(false)
  }

  const handleMenuClick = ()  => {
        setOpenInfoPopper(!openInfoPopper);
  }

  const handleSideWorkspaceContext = (context: SideWorkspaceContext) => {
       utilService.handleOpenSideWorkspace(context)
  }


  return (
    <>
    {expanded?
    <Popover
            fullscreen={expanded}
            className={"MinervaPopperDialog " + (expanded? "MinervaPopperDialog-expanded" : "" )+ " MinervaEmbedded-popper"}
            anchorEle={triggerButton.current}
            open={true}
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
                {!expanded && <button title= "click to see more" onClick={handleMenuClick}><MenuBarIcon/></button>}
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
        :
    <div className={`MinervaEmbedded ${!expanded ? "MinervaEmbedded-mini" : "" }`}>
       <MinervaFullScreen
            renderedOnPopper={true}
            popperOpened={openPopper}
            popperExpanded={expanded}
            handleExpand={handleExpand}
            headerRightActionsChildren={<>
                <button title= "minimize" onClick={handleClose} class="MinervaIconButton MinervaFullscreenToggler"><Minimize/></button>
                <button title="click to see options" onClick={handleMenuClick} ref={anchorEle} class="MinervaIconButton"><MenuBarIcon/></button>
                <Popover
                    anchorEle={anchorEle.current}
                    open={openInfoPopper}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    loadContentOnOpen={true}
                >
                    <div className='MinervaInfoPopper-content'>
                        <div className={"MinervaMenuOptions-Wrapper"}>
                            {suppress_fullscreen_toggler? null: <div className={"MinervaMenuOptions"} onClick={handleFullscreenClick}>
                                <button class="MinervaIconButton MinervaFullscreenToggler" title="Expand">
                                    <ExpandIcon />
                                </button>
                                <p>Full Screen</p>
                            </div>}
                            <div className={"MinervaMenuOptions"}
                                onClick={() => {
                                        handleFullscreenClick()
                                        handleSideWorkspaceContext(SideWorkspaceContext.PINNED_RESPONSES)
                                  }}
                            >
                                <button class="MinervaIconButton MinervaFullscreenToggler"
                                    title="Expand"
                                >
                                    <PinnedListIcon />
                                </button>
                                <p>View Pinned Prompts</p>
                            </div>
                            {mainService?.enableStoryBoarding?.value ?
                            <div className={"MinervaMenuOptions"}
                              onClick={() => {
                                        handleFullscreenClick()
                                        handleSideWorkspaceContext(SideWorkspaceContext.STORY)
                                    }}
                            >
                                <button class="MinervaIconButton MinervaFullscreenToggler"
                                    title="Create Presentation"
                                >
                                    <PresentationIcon />
                                </button>
                                <p>Create presentation</p>
                            </div> :null }
                        </div>
                    </div>
              </Popover>
              <button title="close" class="MinervaIconButton" onClick={handleExit}>
                  <CloseIcon/>
              </button>
      </>}
          />
     </div>
    }
    </>
  );
}
