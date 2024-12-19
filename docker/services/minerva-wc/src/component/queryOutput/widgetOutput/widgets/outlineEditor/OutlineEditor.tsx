import { Fragment } from 'preact/jsx-runtime'
import './outlineEditor.scss'
import { useContext } from 'preact/hooks'
import { RootContext } from '../../../../../context/rootContext'
import RecommendationList from '../recommendationList/RecommendationList'

type SlidePlaceholder = {
    placeholder_type: string,
    idx: number,
    content: string,
    widget_index?: any
    conversation_id?: number
}

type SlideData = {
    placeholder: Array<SlidePlaceholder>
}

type PresentationActionData = {
    name: string,
    variant?: string
}

type ContentData = {
    slides: Array<SlideData>
    presentationAction: Array<PresentationActionData>
    selected_conversations: Array<number>
}

type OutlineEditorData = {
    data: ContentData
}

export default function OutlineEditor({ data }: OutlineEditorData) {

    const { queryService } = useContext(RootContext);

    const outerActionHandler = (el) => {
        queryService.makeQuery(el,'text', 'storyboard:presentation', {
            "outline_data": {
                "slides": data["slides"]
            },
            "selected_conversations": data["selected_conversations"]
        });
    };



    return (
        <div className='MinervaOutlineEditor-container'>
            {data?.slides?.map((slide, index) => (
                <div key={index} className='MinervaOutlineEditor-root'>
                    {slide.placeholder?.map((item, placeholderIndex) =>
                        <Fragment key={placeholderIndex}>
                            {["title", "center_title"].some(type => item.placeholder_type?.toLowerCase().includes(type.toLowerCase())) ?
                                <h4 className='MinervaOutlineEditor-title'>
                                    <span>Slide {index + 1}: </span>
                                    <span>{item.content}</span>
                                </h4>
                                : null}
                            {["object", "picture", "chart", "table", "body"].some(type => item.placeholder_type?.toLowerCase().includes(type.toLowerCase())) ?
                                <div className='MinervaOutlineEditor-content'>
                                    <em>{item.content}</em>
                                </div>
                                : null}
                        </Fragment>
                    )}
                </div>
            ))}
            <div className="MinervaOutlineEditor-action-container" >
                <RecommendationList data={data?.presentationAction} onClick={outerActionHandler} />
            </div>
        </div>
    )
}
