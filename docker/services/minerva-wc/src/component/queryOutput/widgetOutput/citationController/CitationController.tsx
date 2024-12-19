import { useContext, useState } from 'preact/hooks';
import './citationController.scss';
import { QueryItemContext } from '../../../../context/queryItemContext';
import ICitation from '../../../../model/ICitation';
import { WidgetType } from '../../../../model/Query';
import { RootContext } from '../../../../context/rootContext';
import { ViewModeContext } from '../../../../context/viewModeContext';
import { SideWorkspaceContext } from '../../../../model/SideWorkspace';
import { nanoid } from '../../../../util';
import RightArrowIcon from '../../../../svg/RightArrowIcon';
type CitationControllerType = {
    citation: ICitation,
    contentType: WidgetType | string | 'Component',
    content: any
    Component?: 'div' | 'span'
    children: any
}
export default function CitationController({citation, contentType, content, Component= 'div', children}: CitationControllerType) {
    const {citationService} = useContext(RootContext);
    const {citationEnabled, query} = useContext(QueryItemContext);
    const {handleOpenSideWorkspace, handleExpand} = useContext(ViewModeContext);
    const [id] = useState(citation?.id || nanoid());

    let classes = "";
    const handleCitation = () => {
        const citationData = {
            id: id,
            content: content,
            contentType: contentType,
            citation: citation
        }
        citationService.setActivateCitation(query.id, citationData);
        handleOpenSideWorkspace(SideWorkspaceContext.CITATION)
        handleExpand();
    }

    if (citation) {
        if (['text', 'markdown'].includes(contentType.toString())) {
            classes = 'MinervaCitationController-text '
        } else if (contentType) {
            classes = 'MinervaCitationController-chart '
        }
        const activeCitation = citationService.activeCitationDetails.value?.id == id;
        classes += activeCitation ? "MinervaCitationController-active" : ""
    }

    return <Component className={"MinervaCitationController " + classes}
    onClick={(citationEnabled && citation && ['text', 'markdown'].includes(contentType.toString()))? handleCitation : undefined}>
        {children}
        {citation && citationEnabled && !['text', 'markdown'].includes(contentType.toString())?
            <span className="MinervaCitationController-view-source-btn MinervaFont-2" onClick={handleCitation}>View Source <RightArrowIcon /></span>
        :null}
    </Component>
}