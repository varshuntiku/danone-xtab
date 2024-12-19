import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { RootContext } from "../../context/rootContext";
import ConversationWindows from "../conversationWindows/ConversationWindows";
import QueryOutput from "../queryOutput/QueryOutput";
import "./minervaFullScreen.scss"
import ViewModeContextProvider from "../../context/viewModeContext";
import SideWorkspace from "../sideWorkspace/SideWorkspace";
import HamburgerIcon from "../../svg/HamburgerIcon";
import { SideWorkspaceContext } from "../../model/SideWorkspace";
import PinnedListIcon from "../../svg/PinnedListIcon";
import { BaseEvents, MainServiceEvents } from "../../model/Events";
import CustomTooltip from "../shared/tooltip/CustomTooltip";
import PresentationIcon from "../../svg/PresentationIcon";
import ArrowBackIcon from "../../svg/ArrowBackIcon";
import QueryInput from "../queryInput/QueryInput";

export default function MinervaFullScreen({ renderedOnPopper = false, headerRightActionsChildren = null, popperOpened = false, popperExpanded = false, handleExpand = () => { } }) {
    const { external_go_back, external_go_back_title, variant, minerva_alias = "Ask NucliOS", minerva_version, citationService, mainService, queryService, hide_sideworkspace, utilService } = useContext(RootContext);
    const [openConvo, setOpenConvo] = useState(false);

    useEffect(() => {
        const handleConvoClose = (e) => {
            setOpenConvo(false)
        }
        mainService.eventTarget.addEventListener(MainServiceEvents.POPPER_EXIT, handleConvoClose)

        return () => {
            mainService.eventTarget.removeEventListener(MainServiceEvents.POPPER_EXIT, handleConvoClose)
        }
    },[])

    const handleGoBack = () => {
        const event = new Event(BaseEvents.GO_BACK, { bubbles: true });
        this.base.dispatchEvent(event);
    }
    const toggleConvoHistory = () => {
        setOpenConvo(s => !s);
    }
    const handleOpenSideWorkspace = (context: SideWorkspaceContext) => {
        utilService.handleOpenSideWorkspace(context)
    }
    const closeSideWorkspace = () => {
        utilService.closeSideWorkspace();
        citationService.setActivateCitation(null, null);
    }


    const isAppDetailsLoading = mainService.loadingCopilotAppDetails.value || mainService.loadingConsumerDetails.value;

    const hideSideWorkspaceTriggers = hide_sideworkspace || (((hide_sideworkspace && !popperExpanded) || (!hide_sideworkspace && !popperExpanded)) && !["fullscreen", "fullscreen-mini"].includes(variant))

    return (
        <ViewModeContextProvider value={{
            popper: renderedOnPopper,
            popperOpened,
            popperExpanded,
            variant,
            openSideWorkspace: utilService.openSideWorkspace.value,
            handleOpenSideWorkspace,
            closeSideWorkspace,
            sideWorkspaceContext: utilService.sideWorkspaceContext.value,
            handleExpand
        }}>
            <div className={
                "MinervaFullScreen " +
                // (variant == "fullscreen-mini" ? "MinervaFullScreen-mini " : "") +
                (renderedOnPopper ? "MinervaFullScreen-popper " : "") +
                (openConvo ? "MinervaFullScreen-convo-opened " : "") +
                (utilService.openSideWorkspace.value ? "MinervaFullScreen-sideworkspace-opened" : "")}
            >
                <div className="MinervaFullScreen-header">

                    <div className="MinervaFullScreen-header-action-left">
                    {external_go_back?
                        <button class="MinervaIconButton" onClick={handleGoBack} title={external_go_back_title}>
                            <ArrowBackIcon/>
                        </button> : null}
                        <button class="MinervaIconButton MinervaFullScreen-open-convo-btn" onClick={toggleConvoHistory} title="Open Conversation History">
                            <HamburgerIcon />
                        </button>
                    </div>
                    <h3 className={`MinervaFont-2 ${(renderedOnPopper? "" : " MinervaFadeInAnimation")}`}>{isAppDetailsLoading? "" : (minerva_alias || "Ask NucliOS")} <small className="MinervaFullScreen-version">{minerva_version || process.env.MINERVA_VERSION}</small></h3>
                    <div className="MinervaFullScreen-header-action-right">
                        {headerRightActionsChildren}
                    </div>
                </div>
                <div className="MinervaFullScreen-main">
                    <div className="MinervaFullScreen-conversation-section">
                        <ConversationWindows closeConvoWindow={() => setOpenConvo(false)} />
                    </div>
                    {/* <div className="MinervaFullScreen-conversation-section-trigger" onClick={toggleConvoHistory}>
                    <button className="MinervaIconButton">
                        <span class="material-symbols-outlined">
                            arrow_forward
                        </span>
                    </button>
                </div> */}

                <div className="MinervaFullScreen-chat-section">

                            <div className="MinervaFullScreen-queryoutput-section">
                                <QueryOutput />
                            </div>

                    <div className="MinervaFullScreen-queryinput-section">
                        <QueryInput/>
                    </div>
                </div>

                    {hideSideWorkspaceTriggers ?
                        <div style={{display: 'none'}} /> :
                        <div className="MinervaFullScreen-sideworkspace-triggers" style={!mainService.copilotAppId.value ? { padding: 0 } : {}}>
                            {mainService.copilotAppId.value ?
                                <CustomTooltip content="Open pinned response" placement="left" arrow={true}>
                                    <button className="MinervaIconButton" onClick={() => handleOpenSideWorkspace(SideWorkspaceContext.PINNED_RESPONSES)}>
                                        <PinnedListIcon />
                                    </button>
                                </CustomTooltip>
                                : null}
                            {mainService.enableStoryBoarding.value ?
                                <CustomTooltip content="Create Presentation" placement="left" arrow={true}>
                                    <button
                                        className="MinervaIconButton"
                                        onClick={() => handleOpenSideWorkspace(SideWorkspaceContext.STORY)}
                                        disabled={queryService.queries.value.length === 0}>
                                        <PresentationIcon />
                                    </button>
                                </CustomTooltip>
                                : null}
                        </div>
                    }
                    <div className="MinervaFullScreen-sideworkspace-section">
                        <SideWorkspace onClose={() => closeSideWorkspace()} context={utilService.sideWorkspaceContext.value} />
                    </div>
                </div>
            </div>
        </ViewModeContextProvider>);
}