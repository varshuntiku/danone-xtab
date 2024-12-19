import ICitation from "./ICitation";

export interface IQuery {
    id: number | string;
    input: string;
    output: IOutput;
    status: StatusType;
    window_id: number;
    progress_message: string;
    progress_percentage: number;
    feedback: number;
    comment: {type: string, text: string}
    pinned: boolean;
    selected?: boolean;
    request_type: string;
    request_payload: Object;
    query_trace_id: string;
    progress_icon?: string;
    interrupted?: boolean;
    playing?:boolean;
    datasource?: Array<File>;
    error?: any;
    data_to_emit?: any;
    progress_audio_message?: any;
}

export enum StatusType {
    pending='pending',
    resolved='resolved',
    rejected='rejected',
    streaming='streaming'
}


export enum OutputType {
    SQL = 'sql',
    INDEX_FILE = 'index_file',
    DOCUMENT = 'DOCUMENT'
}

export enum WidgetType {
    text,
    markdown,
    chart,
    card,
    dataTable,
}

export interface IWidget {
    name?: string;
    type?: WidgetType | string;
    title?: string;
    selected?: boolean;
    value?: any,
    citation?: ICitation,
    next?: Boolean
}

export interface IResponse {
    entities?: Array<{key: string, value: string}>;
    text?: string;
    sql_query?: string;
    citation?: ICitation;
    widgets?: Array<IWidget | Array<IWidget>>;
    skip_storyboard?: boolean;
}

export interface IOutput {
    type?: OutputType | string,
    response?: IResponse,
}
