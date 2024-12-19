import {useEffect, useState } from "preact/hooks";
import './queryInputDatasource.scss'
import CloseIcon from "../../svg/CloseIcon";
import PDFFileIcon from "../../svg/PDFFileIcon";
import PPTFileIcon from "../../svg/PPTFileIcon";
import FileIcon from "../../svg/FileIcon";
import Popover from "../shared/popover/Popover";

type QueryDatasourceData = {
    queryDatasourceList: Array<File>
    removeDatasource?: (i: number) => void
    allowFileRemove?: boolean
    enablePreview: boolean
}

const icons = {
    ppt : <PPTFileIcon class="MinervaQueryDatasource-file"/>,
    pdf : <PDFFileIcon class="MinervaQueryDatasource-file"/>
}

export default function QueryInputDatasourceItem({ queryDatasourceList, removeDatasource, allowFileRemove=true, enablePreview }: QueryDatasourceData) {
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const isImage = (name:string) => ['jpg','png','gif','jpeg','jfif'].includes(name.split('.').at(-1).toLowerCase())

    useEffect(() => {
        const previews = queryDatasourceList.map(datasourceItem => {
            if (datasourceItem?.type?.startsWith('image/') && (datasourceItem?.name?.split('.').at(-1) != 'svg')) {
                return URL.createObjectURL(datasourceItem);
            }
            else if(isImage(datasourceItem?.name) && datasourceItem["url"]){
                return datasourceItem["url"]
            }
            return '';
        });
        setFilePreviews(previews);

    },[queryDatasourceList])

    const openPopover = (imageUrl) => {
        setSelectedImage(imageUrl);
        setPopoverOpen(true);
    };

    const closePopover = () => {
        setPopoverOpen(false);
        setSelectedImage('');
    };
    return <div className="MinervaQueryDatasourceInput-datasource-wrapper">
                {queryDatasourceList?.map((datasourceItem: File, index) => {

                if ((datasourceItem?.type?.startsWith('image/') && (datasourceItem?.name?.split('.').at(-1) != 'svg'))|| isImage(datasourceItem?.name) && datasourceItem["url"]){
                    return (<div className="MinervaQueryDatsource-image" key={index}>
                        <img
                            src={filePreviews[index]}
                            alt={datasourceItem.name}
                            className="MinervaQueryDatasourceInput-thumbnail"
                            {...(enablePreview && {
                                onClick: (e) => openPopover(filePreviews[index]),
                                title: 'Click to View'
                            })}
                        />
                        {allowFileRemove ?
                        <button
                            className="MinervaIconButton-small"
                            onClick={() => removeDatasource(index)}
                            title="Remove"
                        >
                            <CloseIcon/>
                        </button>: null}
                    </div>)
                }
                return (
                    <div className="MinervaQueryDatasource" key={index} title={datasourceItem.name}>
                        <span className="MinervaIconButton-fileupload">
                            {icons[datasourceItem.name.split('.').at(-1)] || <FileIcon class="MinervaQueryDatasource-file"/>}
                        </span>
                        <span className="MinervaQueryDatasourceInput-name">{datasourceItem.name}</span>
                        {allowFileRemove ? (
                            <button
                                className="MinervaIconButton-small"
                                onClick={() => removeDatasource(index)}
                                 title="Remove"
                            >
                                <CloseIcon/>
                            </button>
                        ) : null}
                    </div>
                )
                })}
                {isPopoverOpen ? <Popover
                    open={isPopoverOpen}
                    onClose={closePopover}
                    className="MinervaQueryImage-preview-popover"
                >
                    <img className="MinervaQueryImage-preview" src={selectedImage} alt="Full Preview" />
                    <button
                        className="MinervaIconButton MinervaQueryImage-close"
                        onClick={closePopover}
                        title="Close"
                    >
                        <CloseIcon/>
                    </button>
                </Popover>: null}
            </div>
}
