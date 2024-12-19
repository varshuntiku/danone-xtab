import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import addStyles from './CommentAdd.module.css';
import AttachFileIcon from './assets/AttachFileIcon';
import SendIcon from './assets/SendIcon';
import MentionsInput from './mentionsInput';
import DescriptionIcon from './assets/DescriptionIcon';
import GetAppIcon from './assets/GetAppIcon';
import CancelIcon from './assets/CancelIcon';
import MenuLoader from './assets/MenuLoader';
import { GlobalContext } from '../Context/GlobalContext';
import { upload_file } from './common/Utils';
import { useApiServices } from './services/comments'
import { useHttpClient } from './Login/HttpClient';



const MAX_FILES = 3;
const MAX_FILE_SIZE_KB = 500; 

const AttachmentCard = ({ attachment, onDelete, isUploading, uploadProgress }) => {
 
    const trimmedFileName =
        attachment?.name?.length > 25
            ? attachment?.name.substring(0, 25) + '...'
            : attachment?.name;

    return (
        <div className={addStyles.attachmentCard}>
            <DescriptionIcon className={addStyles.fileIcon} />
            <span className={addStyles.fileName}>{trimmedFileName}</span>
            <span className={addStyles.fileSize} style={{ marginRight: 'auto' }}>{attachment?.size}</span>
            {isUploading ? (
                <>
                    <span className={addStyles.uploadProgress}>{uploadProgress}%</span>
                    <div className={addStyles.loadingBarContainer}>
                        <div className={addStyles.loadingBar} style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                </>
            ) : (
                <>
                    <a href={attachment?.url} download className={addStyles.downloadLink} title="Download">
                        <GetAppIcon className={addStyles.downloadIcon} />
                    </a>
                    <div onClick={onDelete} title="Remove">
                        <CancelIcon className={addStyles.cancelIcon} />
                    </div>
                </>
            )}
        </div>
    );
};


const CommentsAdd = ({ refreshComments, handleSnackbar, users }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [comment, setComment] = useState('');
    const [addingComment, setAdding] = useState(false);
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [htmlcontent, sethtmlcontent] = useState(undefined);
    const [uploadingAttachment, setUploadingAttachment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allMentions, setAllMentions] = useState([]);
    const { globalState, setGlobalState } = useContext(GlobalContext);
    const { addComment } = useApiServices();
 
    const httpClient = useHttpClient();

    const fileRef = useRef(null);
//   test
    useEffect(() => {
        let interval;

        if (loading) {
            interval = setInterval(() => {
                setUploadingAttachment((prev) => {
                    if (prev?.progress < 80) {
                        return { ...prev, progress: prev.progress + 20 };
                    }
                    return prev;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [loading]);
   
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    
   
const handleMentionChange = ({ newValue, mentions }) => {

    let newHtmlContent = newValue;
    const updatedMentions = [...allMentions, ...mentions]
        .filter((mention, index, self) =>
            index === self.findIndex((m) => m.id === mention.id)
        );
    
    setAllMentions(updatedMentions);
  
    const mentionMap = new Map();

    if (updatedMentions.length > 0) {
        updatedMentions.forEach((mention) => {
            const mentionText = escapeRegExp(`${mention.displayName}`); 
            const mentionHtml = `<span class='mention' data-id='${mention.id}'>${mention.displayName}</span>`;
            
            mentionMap.set(mentionText, mentionHtml);
        });

        mentionMap.forEach((mentionHtml, mentionText) => {
        
            const mentionRegex = new RegExp(`\\b${mentionText}\\b`, 'gi');
            newHtmlContent = newHtmlContent.replace(mentionRegex, mentionHtml);
        });
    }

    setComment(newValue);  
    sethtmlcontent(newHtmlContent);  

    const newTaggedUsers = updatedMentions.map((mention) => mention.id);
    setTaggedUsers(newTaggedUsers); 
};


    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_FILE_SIZE_KB * 1024) {
            handleSnackbar(`File size exceeds ${MAX_FILE_SIZE_KB} KB`, 'warning');
            return;
        }
        event.target.value = null;

        const newAttachment = {
            name: file.name ?? 'anonymous',
            size: (file.size / 1024).toFixed(2) + ' KB',
            progress: 0,
        };
        setLoading(true);
        setUploadingAttachment(newAttachment);

        const url = await upload_file(file, httpClient);

        const attachment = {
            ...newAttachment,
            url: url.data?.path,
            progress: 100
        };
        setLoading(false);
        setUploadingAttachment(null);
        setAttachments((prev) => [...prev, attachment]);
    };


    const copyCommentLink = () => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

        url.search = '';
        return url.href;
    };

    const generateFiltersId = () => {
        const filters = {};
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

        url.search = '';
        filters['url'] = url;
        filters['linkType'] = 'new';
        return filters;
    };
    const handleDeleteAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const uploadComment = async () => {
        if (!comment.trim()) {
            handleSnackbar('Comment cannot be empty', 'warning');
            return; 
        }

        setGlobalState({ comment });
        try {
            setAdding(true);
            let commentParams = {
                payload: {
                    identifier: copyCommentLink(),
                    comment_text: htmlcontent,
                    bookmarked: false,
                    status: "unresolved",
                    tagged_users: taggedUsers,
                    attachments: attachments?.map((item) => JSON.stringify(item)),
                    link: copyCommentLink(),
                    filters: generateFiltersId()
                }
            };
            await addComment(commentParams);
            setComment('');
            setAttachments([]);
            setAdding(false);
            setTaggedUsers([]);
            sethtmlcontent(undefined);
            setIsFocused(false);
            handleSnackbar('Comment Added!', 'success');
            refreshComments('add');
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            uploadComment();
            event.preventDefault();
        }
    };

    const openFileDialog = useCallback((event) => {
        event.preventDefault(); 
      
        if (attachments.length >= MAX_FILES) {
            handleSnackbar(`Max ${MAX_FILES} files allowed`, 'warning');
            return;
        }
        fileRef.current?.click();
    }, [attachments, handleSnackbar]);

    return (
        <div
            className={`${addStyles.commentBox} ${isFocused ? addStyles.commentBoxFocused : ''}`}
            onFocus={handleFocus}
        >
            <div className={addStyles.textFieldWrapper}>
              
                <MentionsInput
                    users={users}
                    value={comment}
                    onMentionChange={handleMentionChange}
                />

                <div className={addStyles.attachmentContainer}>
                    {loading && uploadingAttachment && (
                        <AttachmentCard
                            attachment={uploadingAttachment}
                            isUploading={true}
                            uploadProgress={uploadingAttachment.progress}
                        />
                    )}
                    {attachments.map((attachment, index) => (
                        <AttachmentCard
                            key={attachment.name}
                            attachment={attachment}
                            onDelete={() => handleDeleteAttachment(index)}
                            isUploading={false}
                        />
                    ))}
                </div>
                {attachments.length > 0 && (
                    <div className={addStyles.warningText}>Maximum up to 3 files</div>
                )}

            </div>

            <div className={`${addStyles.divider} ${isFocused ? addStyles.dividerFocused : ''}`} />
            <div
                className={`${addStyles.actionButtons} ${isFocused ? addStyles.actionButtonsVisible : ''}`}
            >
                <div>
                    <input
                        id="comment-file-input"
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        disabled={loading || attachments.length >= 3}
                        ref={fileRef}
                    />
                    <label
                        htmlFor="comment-file-input"
                        className={addStyles.rotatedAttachIcon}
                        onClick={openFileDialog}
                        disabled={loading || attachments.length >= 3}
                        title='Attach'

                    >
                        <AttachFileIcon />
                    </label>
                </div>
                {!addingComment ? (<div className={addStyles.sendButton} onClick={uploadComment} disabled={addingComment || !comment.trim()} title='Post'>
                    <SendIcon />
                </div>) : (<span className={addStyles.progress}><MenuLoader /></span>)}
            </div>
        </div>
    );
};

export default CommentsAdd;