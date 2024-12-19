import React, { useState, useEffect } from 'react';
import replyStyles from './Reply.module.css';
import DateDisplay from './DateDisplay';
import CustomSnackbar from './CustomSnackbar';
import { AttachmentCard } from './AttachmentCard';
import sanitizeHtml from 'sanitize-html-react';

const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
};

const Reply = ({ reply }) => {
    const [isEditing] = useState(false);
    const [sanitizedComment, setSanitizedComment] = useState('');

 
    useEffect(() => {
        if (!reply || !reply.reply_text) {
            setSanitizedComment('');
            return;
        }
       
        const parser = new DOMParser();
        const doc = parser.parseFromString(reply.reply_text, 'text/html');

        doc.querySelectorAll('span.mention').forEach((span) => {
            span.innerHTML = span.innerHTML.replace(/^@/, '');
            span.classList.add(replyStyles.mention);
        });

        const updatedHtml = doc.body.innerHTML;

        const sanitizedHtml = sanitizeHtml(updatedHtml, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span'],
            allowedAttributes: {
                a: ['href'],
                span: ['class', 'data-id']
            }
        });

        setSanitizedComment(sanitizedHtml);
   
    }, [reply.reply_text]);


    return (
        <div key={reply.id} className={replyStyles.commentContainer}>
            <div className={replyStyles.header}>
                <div className={replyStyles.avatarWrapper}>
                    <span 
                        className={replyStyles.avatar} 
                        style={{ backgroundColor: stringToColor(reply.created_by) }}
                    >
                        {reply?.created_by?.[0]?.toUpperCase()}
                    </span>
                </div>
                <span className={replyStyles.name}>
                    {reply.created_by}
                </span>
                <DateDisplay createdAt={reply.created_at} />
            </div>
            <div className={replyStyles.content}>
            <div className={replyStyles.textField} dangerouslySetInnerHTML={{ __html: sanitizedComment }} />
             
            </div>

            {reply.attachments && reply.attachments.length > 0 && (
                <>
                    {reply.attachments
                        .slice(0, 3)
                        .map((item) => JSON.parse(item))
                        .map((attachment, index) => (
                            <AttachmentCard
                                key={index}
                                fileUrl={attachment?.url}
                                fileName={attachment.name}
                                fileSize={attachment.size}
                            />
                        ))}
                </>
            )}
        </div>
    );
};

export default Reply;
