
export interface ICopilotAppDetails {
    id: number
    name: string
    desc: string
    config?: ICopilotAppConfig
    is_test?: boolean
}

export interface ICopilotAppConfig {
    industry: string
    org_name: string
    identity: string
    persona: string
    lang_model: string
    capabilities: string
    avatar_url: string
    empty_state_message_desc: string
    suggested_queries: Array<string>
}

export interface ICopilotInputConfig {
    max_files: number,
    max_file_size: number,
    accepted_file_type: Array<string>
}