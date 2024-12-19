export interface IConsumer {
    id: number
    access_key: string
    name: string
    desc: string
    allowed_origins: Array<string>
    features: any
    auth_agents: Array<any>
    minerva_apps: Array<number>
    copilot_apps: Array<number>
}