import { useContext } from 'preact/hooks';
import CitationSourceIcon from '../../../../../svg/CitationSourceIcon';
import CustomTooltip from '../../../../shared/tooltip/CustomTooltip';
import './fileListRenderer.scss';
import { RootContext } from '../../../../../context/rootContext';
import OpenInNewIcon from '../../../../../svg/OpenInNewIcon';
import PDFIcon from '../../../../../svg/PDFIcon';
import CSVFileIcon from '../../../../../svg/CSVFileIcon';
import DocFileIcon from '../../../../../svg/DocFileIcon';
import CommonFileIcon from '../../../../../svg/CommonFileIcon';

const icons = {
    csv: <CSVFileIcon />,
    doc: <DocFileIcon />,
    pdf: <PDFIcon />,
    ppt: <CitationSourceIcon />
};

type FileItemData = {
    name: string,
    type: string,
    url?: string
}

type FileListData = {
    data: Array<FileItemData>
}

export default function FileListRenderer({ data }: FileListData) {

    const { queryService } = useContext(RootContext);

    const handleDownload = async (file) => {
        try {
            const url = await queryService.getPublicURL(file.url);
            const anchorElement = document.createElement('a');
            anchorElement.setAttribute('href', url);
            anchorElement.setAttribute('download', 'true');
            anchorElement.click();
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="MinervaFileListRenderer-container">
            {data.map((file, i) => (
                <div key={file.name + i} className="MinervaFileListItemContainer-root">
                    <div key={file.name} className="MinervaFileListItemContainer" onClick={() => handleDownload(file)}>
                        <span className="MinervaFileType-icon" >{icons[file.type] ? icons[file.type] : <CommonFileIcon />}</span>
                        <CustomTooltip content={file.name} placement="bottom">
                            <p className="MinervaFileItem-title" >{file.name}</p>
                        </CustomTooltip>
                    </div>
                    <OpenInNewIcon title='Download' className="MinervaFileListItem-download MinervaIcon" onClick={() => handleDownload(file)} />
                </div>
            ))}
        </div>
    );
}
