import React from 'react'
import DescriptionIcon from './assets/DescriptionIcon';
import GetAppIcon from './assets/GetAppIcon';
import addStyles from './CommentAdd.module.css';

export const AttachmentCard = ({ fileUrl, fileName, fileSize }) => {
    const trimmedFileName = fileName.length > 40 ? fileName.substring(0, 40) + '...' : fileName;

    return (
        <div className={addStyles.attachmentCardComponent}>
            <DescriptionIcon className={addStyles.fileIcon} />
            <span className={addStyles.fileNameComponent}>{trimmedFileName}</span>
            <span className={addStyles.fileSize}>{fileSize}</span>
         
                <>
                    <a href={fileUrl} download className={addStyles.downloadLink} title='Download'>
                        <GetAppIcon className={addStyles.downloadIcon} />
                    </a>
                </>
            
        </div>
    );
};
