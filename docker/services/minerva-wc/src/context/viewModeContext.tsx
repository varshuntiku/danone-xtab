import { Context, VNode, createContext } from "preact";
import { SideWorkspaceContext } from "../model/SideWorkspace";

type ViewModeContextType = {
    popper:boolean,
    popperOpened: boolean,
    popperExpanded: boolean,
    variant: 'fullscreen' | 'fullscreen-mini' | null,
    openSideWorkspace: boolean,
    handleOpenSideWorkspace: (context: SideWorkspaceContext) => void,
    closeSideWorkspace: () => void,
    sideWorkspaceContext: SideWorkspaceContext,
    handleExpand: () => void
}
export const ViewModeContext: Context<ViewModeContextType> = createContext(null);

export default function ViewModeContextProvider({children, value}: {value: ViewModeContextType, children: VNode}) {
    return <ViewModeContext.Provider value={value}>
       {children}
       </ViewModeContext.Provider>
}