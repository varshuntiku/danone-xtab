export enum BaseEvents{
    POPPER_OPEN= "popper:open",
    POPPER_CLOSE= "popper:close",
    OPEN_IN_NEW= "external:open-in-new",
    POPPER_EXPANDED= "popper:expanded",
    POPPER_MINIMIZE= "popper:minimize",
    POPPER_EXIT= "popper:exit",
    GO_BACK= "external:go-back",
    EMIT_TO_CLIENT= "external:emit-to-client"
}

export enum MainServiceEvents{
    POPPER_EXIT= "popper:exit"
}

export enum QueryServiceEvents{
    QUERY_INTERRUPTED= "queryInput:stop",
    QUERY_RESPONSE_STREAMING= "queryResponse:streaming",
    QUERY_RESPONSE_STREAMING_START= "queryResponse:streamStart",
    QUERY_RESPONSE_STREAMING_END = 'queryResponse:streamEnd',
    JUMP_TO_QUERY = "queryPrompt:jump-to-query",
    QUERY_SELECT = "query:select",
    // EMIT_TO_CLIENT= "external:emit-to-client"
}