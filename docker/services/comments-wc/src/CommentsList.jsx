import React, { useEffect, useRef, useState } from 'react';
import Comment from './Comment';
import commentListStyles from './commentList.module.css';

const CommentsList = ({ comments, onRemoveComment, refreshComments, handleSnackbar, filterCommentId,users ,linkType}) => {
    
    const commentRefs = useRef([]);

    useEffect(() => {
        commentRefs.current = commentRefs.current.slice(0, comments.length);
    }, [comments]);

    useEffect(() => {
        if (filterCommentId) {
            const commentIndex = comments.findIndex((comment) => comment.id == filterCommentId);
            if (commentIndex !== -1 && commentRefs.current[commentIndex]) {
                commentRefs.current[commentIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }
    }, [filterCommentId, comments]);

    return (
        <div className={commentListStyles.scrollableContainer}>
            {comments.map((comment, index) => (
                <div key={comment.id} ref={(el) => (commentRefs.current[index] = el)} className={commentListStyles.commentContainer}>
                    <Comment
                      users={users}
                        comment={comment}
                        onRemoveComment={onRemoveComment}
                        refreshComments={refreshComments}
                        handleSnackbar={handleSnackbar}
                        filterCommentId={filterCommentId}
                        linkType={linkType}
                    />
                </div>
            ))}
        </div>
    );
};

export default CommentsList;
