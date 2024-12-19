import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import replyAddStyles from './ReplyAdd.module.css';
import AttachFileIcon from './assets/AttachFileIcon';
import SendIcon from './assets/SendIcon';
import DescriptionIcon from './assets/DescriptionIcon';
import GetAppIcon from './assets/GetAppIcon';
import CancelIcon from './assets/CancelIcon';
import MentionsInput from './mentionsInput';
import MenuLoader from './assets/MenuLoader';
import { GlobalContext } from '../Context/GlobalContext';
import { upload_file } from './common/Utils';

import { useApiServices } from './services/comments'
import { useHttpClient } from './Login/HttpClient';


const MAX_FILES = 3;
const MAX_FILE_SIZE_KB = 500; 

const AttachmentCard = ({ attachment, onDelete, isUploading, uploadProgress }) => {
    const trimmedFileName = typeof attachment?.name === 'string'
        ? (attachment.name.length > 25 ? attachment.name.substring(0, 25) + '...' : attachment.name)
        : '';



    return (
        <div className={replyAddStyles.attachmentCard}>
            <DescriptionIcon className={replyAddStyles.fileIcon} />
            <span className={replyAddStyles.fileName}>{trimmedFileName}</span>
            <span className={replyAddStyles.fileSize}>{attachment?.size}</span>
            {isUploading ? (
                <>
                    <span className={replyAddStyles.progress}>{uploadProgress}%</span>
                    <div className={replyAddStyles.loadingBarContainer}>
                        <div className={replyAddStyles.loadingBar} style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                </>
            ) : (
                <>
                    <a href={attachment?.url} download className={replyAddStyles.downloadLink} title='Download'>
                        <GetAppIcon className={replyAddStyles.downloadIcon} />
                    </a>
                    <div onClick={onDelete} title="Remove">
                        <CancelIcon className={replyAddStyles.cancelIcon} />
                    </div>
                </>
            )}
        </div>
    );
};



const ReplyAdd = ({ comment, refreshComments, handleSnackbar, users }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [reply, setReply] = useState('');
    const [uploadingAttachment, setUploadingAttachment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [addingReply, setAdding] = useState(false);
    const { globalState, setGlobalState } = useContext(GlobalContext);
    const [htmlcontent, sethtmlcontent] = useState(undefined);
    const [allMentions, setAllMentions] = useState([]);
    const { addReply } = useApiServices();
    const httpClient = useHttpClient();

    const fileRef = useRef(null);

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
                
                // Store mention in the map
                mentionMap.set(mentionText, mentionHtml);
            });
    
            // Replace all mentions in the newHtmlContent
            mentionMap.forEach((mentionHtml, mentionText) => {
                // Use a global case-insensitive regex with word boundaries to replace all instances of the mention text
                const mentionRegex = new RegExp(`\\b${mentionText}\\b`, 'gi');
                newHtmlContent = newHtmlContent.replace(mentionRegex, mentionHtml);
            });
        }
    
        setReply(newValue);  // Update the raw comment value
        sethtmlcontent(newHtmlContent);  // Update the HTML content
    
        const newTaggedUsers = updatedMentions.map((mention) => mention.id);
        setTaggedUsers(newTaggedUsers);  // Update the list of tagged users
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


    const uploadReply = async () => {
        if (!reply.trim()) {
            handleSnackbar('Reply cannot be empty', 'warning');
            return; 
        }
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        url.search = '';
        setGlobalState({ reply });
        try {
            setAdding(true);
            let commentParams = {
                payload: {
                    comment_id: comment.id,
                    reply_text: htmlcontent,
                    attachments: attachments?.map((item) => JSON.stringify(item)),
                    link: url,
                    tagged_users: taggedUsers,
                    filters: generateFiltersId()

                }
            };
            await addReply(commentParams);
            
       
            setReply('');
            setAttachments([]);
            setAdding(false);
            setTaggedUsers([]);
            sethtmlcontent(undefined);
            setIsFocused(false);
            refreshComments('add');
            handleSnackbar("Reply Added!","success");

        }

        catch (err) {
            console.error('Error adding comment:', err);
        }


    };

    const handleDeleteAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleFocus = () => {
        setIsFocused(true);
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
            className={`${replyAddStyles.commentBox} ${isFocused ? replyAddStyles.commentBoxFocused : ''}`}
            onFocus={handleFocus}
        >
            <div className={replyAddStyles.textFieldWrapper}>
                <MentionsInput
                    users={users}
                    value={reply} 
                    onMentionChange={handleMentionChange}
                    styles={{
                        padding: '3px', 
                        fontSize: '0.65em' ,
                        color:'#220047',
                        
                    }}
                    placeholder="Add a reply" 
                />


                <div className={replyAddStyles.attachmentContainer}>
                    {uploadingAttachment && (
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
                        />
                    ))}
                </div>
                {attachments.length > 0 && (
                    <div className={replyAddStyles.warningText}>Maximum up to 3 files</div>
                )}
            </div>

            <div className={`${replyAddStyles.divider} ${isFocused ? replyAddStyles.dividerFocused : ''}`} />
            <div
                className={`${replyAddStyles.actionButtons} ${isFocused ? replyAddStyles.actionButtonsVisible : ''}`}
            >
                <div>
                    <input
                        id="reply-file-input"
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        disabled={loading || attachments.length >= 3}
                        ref={fileRef}
                    />
                    <label htmlFor="reply-file-input" className={replyAddStyles.rotatedAttachIcon} onClick={openFileDialog}
                        disabled={loading || attachments.length >= 3} title='Attach'>
                        <AttachFileIcon />
                    </label>
                </div>
                {!addingReply ? (<div className={replyAddStyles.sendButton} onClick={uploadReply} disabled={addingReply || !reply.trim()} title='Post'>
                    <SendIcon />
                </div>) : (<span className={replyAddStyles.progress}><MenuLoader /></span>)}
            </div>
        </div>

    );
};

export default ReplyAdd;
