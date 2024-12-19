import ICitation from "../../../../../model/ICitation"
import CitationController from "../../citationController/CitationController"

type TextListType = {
    data: {
        connecter: string,
        list: Array<{
            text: string,
            citation: ICitation
        }>
    }
}
export default function TextList({data}: TextListType) {
    return <pre className="MinervaTypo-pre">{
        data?.list?.map((el, i) => <>
        <CitationController citation={el?.citation} content={el?.text} contentType='text'>
            <span>{el?.text}</span>
        </CitationController>
        {i !== data?.list?.length - 1 ? data?.connecter : null}
        </>)
    }</pre>
}