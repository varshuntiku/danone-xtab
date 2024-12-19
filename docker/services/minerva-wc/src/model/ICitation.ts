import { WidgetType } from "./Query";

interface ICitationBase {
    id?: number | string;
}

interface ICitationPPT extends ICitationBase {
    type: ICitationType.ppt;
    data: Array<ICitationPPTData>;
}

interface ICitationMarkdown extends ICitationBase {
    type: ICitationType.markdown;
    data: string;
}

interface ICitationMiscellaneous extends ICitationBase {
    type: ICitationType.video;
    data: any;
}

type ICitation = ICitationMarkdown | ICitationPPT | ICitationMiscellaneous;

export default ICitation;

export enum ICitationType {
    ppt = 'ppt',
    markdown = 'markdown',
    video = 'video'
}

export interface ICitationPPTData {
    name?: string,
    source_url?: string,
    img_url?: string,
    image_url?: string
}

export interface ICitationViewModel {
    id?: number | string,
    contentType: WidgetType | 'Component' | string,
    content: any,
    citation: ICitation
}