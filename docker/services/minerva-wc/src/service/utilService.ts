import { Signal, signal } from "@preact/signals";
import { SideWorkspaceContext } from "../model/SideWorkspace";
import QueryService from "./queryService";

export default class UtilService {
    openSideWorkspace: Signal<boolean> = signal(false);
    sideWorkspaceContext: Signal<SideWorkspaceContext> = signal(null);
    queryService: QueryService;

    constructor(queryService: QueryService) {
        this.queryService = queryService;
        this.queryService.selectedWindowId.subscribe(() => {
            this.closeSideWorkspace();
        })
    }

    handleOpenSideWorkspace = (context: SideWorkspaceContext) => {
        this.openSideWorkspace.value = true
        this.sideWorkspaceContext.value = context

    }

    closeSideWorkspace = () => {
        this.openSideWorkspace.value = false
    }
}