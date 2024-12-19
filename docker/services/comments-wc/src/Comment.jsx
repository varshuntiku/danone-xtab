
import React, { useState, useEffect, useRef } from 'react';
import BookmarkIcon from './assets/BookmarkIcon';
import MoreVertIcon from './assets/MoreVertIcon';
import ResolvedIcon from './assets/ResolvedIcon';
import commentStyles from './Comment.module.css';
import Reply from './Reply';
import CloseIcon from './assets/CloseIcon';
import ReplyAdd from './ReplyAdd';
import DateDisplay from './DateDisplay';
import BookmarkUnfillIcon from './assets/BookmarkUnfillIcon';
import { AttachmentCard } from './AttachmentCard';
import { useApiServices } from './services/comments';
import KeyBoardArrowDown from './assets/KeyBoardArrowDown';
import sanitizeHtml from 'sanitize-html-react';
import KeyBoardArrowUp from './assets/KeyBoardArrowUp';


const Comment = ({ comment, onRemoveComment, refreshComments, handleSnackbar, filterCommentId, linkType, users }) => {

    const [sanitizedComment, setSanitizedComment] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isBookmarked, setIsBookmarked] = useState(comment.bookmarked);
    const [isResolved, setIsResolved] = useState(comment.status == 'resolved' ? true : false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [highlight, setHighlight] = useState(false);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingValues, setLoadingValues] = useState({});
    const menuRef = useRef(null);
    const iconRef = useRef(null);
    const timeoutRef = useRef(null);
    const { status, bookmark, commentDeleteStateChange, addFilter } = useApiServices();


    const handleMenuToggle = (event) => {

        const iconRect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: iconRect.bottom + window.scrollY - 20
        });

        setIsMenuOpen((prevOpen) => !prevOpen);
    };
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 60%)`;
        return color;
    };

    const comment_replies = comment?.replies;

    const replies =
        comment?.replies && comment?.replies?.length
            ? showAllReplies
                ? comment?.replies
                : comment?.replies?.slice(comment?.replies?.length - 2)
            : [];


    useEffect(() => {
        if (!comment || !comment.comment_text) {
            setSanitizedComment('');
            return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(comment.comment_text, 'text/html');

        doc.querySelectorAll('span.mention').forEach((span) => {
            span.innerHTML = span.innerHTML.replace(/^@/, '');
            span.classList.add(commentStyles.mention);
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

    }, [comment.comment_text]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                iconRef.current && !iconRef.current.contains(event.target)
            ) {
                timeoutRef.current = setTimeout(() => {
                    setIsMenuOpen(false);
                }, 300);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isMenuOpen]);



    useEffect(() => {
        if (
            (filterCommentId !== undefined || filterCommentId !== null) &&
            filterCommentId == comment?.id
        ) {
            setHighlight(true);
            const timer = setTimeout(() => {
                setHighlight(false);
            }, 20000);

            return () => clearTimeout(timer);
        }
    }, [filterCommentId, comment?.id]);


    const statusChange = async () => {
        const resolved = isResolved;
        try {
            setLoadingValues({ resolve: true });
            setIsResolved(() => !resolved);
            const params = {
                payload: {
                    comment_id: comment?.id,
                    status: resolved ? 'unresolved' : 'resolved'
                }
            };
            await status(params);
            handleSnackbar(`comment ${resolved ? "unresolved" : 'resolved'}`, 'success');

            onRemoveComment(comment.id, resolved ? 'unresolved' : 'resolved');
            setLoadingValues({ resolve: false });
        } catch (err) {
            setLoadingValues({ resolve: false });
            console.error(err);
            setIsResolved(() => resolved);
            handleSnackbar(`Error while changing status`, 'warning');

        }
    };

    const bookmarkChange = async () => {
        const ismarked = isBookmarked;
        try {
            setLoadingValues({ bookmark: true });
            setIsBookmarked(() => !ismarked);
            const params = {
                payload: {
                    comment_id: comment?.id,
                    bookmarked: !ismarked
                }
            };
            await bookmark(params);
            handleSnackbar(`Comment ${ismarked ? ' is off the bookmarked list' : 'bookmarked'}`, 'success');

            setLoadingValues({ bookmark: false });
        } catch (err) {
            setLoadingValues({ bookmark: false });
            setIsBookmarked(() => ismarked);
            console.error(err);
            handleSnackbar('error while bookmarking comment', 'warning');
        }
    };

    const handleBookmarkToggle = () => {
        bookmarkChange();
    };

    const handleResolveToggle = () => {
        statusChange();
    };


    const handleCopyLink = async (event) => {
        event.stopPropagation();
        event.preventDefault();


        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (comment?.deleted_at) {
            handleSnackbar('Cannot generate  link for a deleted comment', 'warning');
            return;
        }
        const filters = {};
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        url.search = '';
        filters['url'] = url;
        filters['linkType'] = 'copy';
        filters['comment'] = comment.id;
        try {
            const payload = {
                filters: filters
            };
            setLoading(true);
            const filterId = await addFilter(payload);

            if (!filterId) throw new Error('Error while generating link');
            url.searchParams.set('filters', filterId);
            navigator.clipboard
                .writeText(url.href)
                .then(() => {
                    handleSnackbar('Comment link copied', 'success');
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    handleSnackbar('Error  while copying the comment link', 'error');
                });
        } catch (err) {
            setLoading(false);
            console.error(err);
            handleSnackbar('Error  while generating the comment link', 'error');
        }
        setIsMenuOpen(false);
    };


    const confirmHandler = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        try {
            setLoading(true);

            const action = comment.deleted_at ? 'undelete' : 'delete';

            await commentDeleteStateChange(comment.id, action);

            onRemoveComment(comment.id, action);

            setLoading(false);

            if (action === 'delete') {
                handleSnackbar('Comment Deleted', 'success');
            } else {
                handleSnackbar('Comment Undeleted', 'success');
            }
        } catch (err) {
            handleSnackbar('Error Occurred', 'error');
            console.error('err');
            setLoading(false);
        }
    };


    return (
        <div className={commentStyles.commentContainer}>
            <div className={commentStyles.bookmarkResolveContainer}>
                {highlight ? (
                    <div className={commentStyles.pulseContainer}>
                        <div className={commentStyles.pulsatingCircle}></div>
                        {linkType == 'new' ? (
                            <span className={commentStyles.notificationMessage}>1 New Message</span>
                        ) : null}
                    </div>
                ) : null}
                <div className={commentStyles.iconBar} disabled={loading}>

                    <span onClick={handleResolveToggle} className={`${commentStyles.iconButton} ${comment?.deleted_at ? commentStyles.disabled : ''}`} title={isResolved ? "Unresolve" : "Resolve"}  >

                        <ResolvedIcon className={`${isResolved && !loading ? commentStyles.resolvedIcon : commentStyles.resolveIcon}`} />
                    </span>

                    <span onClick={handleBookmarkToggle} className={`${commentStyles.iconButton} ${comment?.deleted_at || isResolved ? commentStyles.disabled : ''}`} title="Bookmark" >

                        {isBookmarked ? (
                            <BookmarkIcon className={` ${commentStyles.bookmarkIcon}`} />

                        ) : (
                            <BookmarkUnfillIcon className={`${commentStyles.bookmarkunfillIcon}`} />
                        )}
                    </span>

                    <span onClick={handleMenuToggle} className={commentStyles.iconButton} ref={iconRef} title="Options">
                        <MoreVertIcon className={`${commentStyles.iconButton} ${commentStyles.moreVertIcon}`} />
                    </span>
                </div>
            </div>
            <div className={commentStyles.header}>
                <div className={commentStyles.avatarWrapper}>
                    <span className={commentStyles.avatar}
                        style={{ backgroundColor: stringToColor(comment.created_by) }}>
                        {comment.created_by?.[0]?.toUpperCase()}
                    </span>
                </div>
                <span className={commentStyles.name}>
                    {comment.created_by}
                </span>
                <DateDisplay createdAt={comment.created_at} />
            </div>
            <div className={commentStyles.content}>
                <div className={commentStyles.textField} dangerouslySetInnerHTML={{ __html: sanitizedComment }} />
            </div>
            {isMenuOpen && (
                <div className={commentStyles.menu} style={{ top: menuPosition.top }} ref={menuRef}>
                    <button onClick={handleCopyLink} disabled={comment?.deleted_at || isResolved} className={commentStyles.menuItem} >
                        Copy Link
                    </button>
                    <button onClick={() => setDialogOpen(true)} className={commentStyles.menuItem} >
                        {`${comment?.deleted_at ? 'Undelete Thread' : 'Delete Thread'}`}
                    </button>
                </div>
            )}
            {dialogOpen && (
                <div className={commentStyles.dialogContainer}>
                    <div className={commentStyles.dialogPaper}>
                        <div className={commentStyles.dialogRoot}>
                            <h6 className={commentStyles.dialogTitle}>
                                Delete Thread
                            </h6>
                            <span onClick={() => setDialogOpen(false)} className={commentStyles.closeButton} title="Close">
                                <CloseIcon />
                            </span>
                        </div>
                        <div className={commentStyles.dialogContent}>
                            {`Are you sure you want to ${comment?.deleted_at ? 'Undelete' : 'Delete'
                                } this comment thread ?`}
                        </div>
                        <div className={commentStyles.dialogActions}>
                            <button onClick={() => setDialogOpen(false)} className={commentStyles.cancel}>
                                Cancel
                            </button>
                            <button onClick={confirmHandler} className={commentStyles.proceed}>
                                Yes, Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {comment.attachments && comment.attachments.length > 0 && (
                <div className={commentStyles.attachmentContainer}>
                    {comment.attachments
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
                </div>
            )}
            {replies?.length ? (
                <div className={commentStyles.replyContainer}>
                    {comment_replies?.length >= 3 ? (
                        <>

                            <div className={commentStyles.showButton}
                                onClick={() => setShowAllReplies((prev) => !prev)}
                            >
                                {`${showAllReplies ? 'show less' : 'show all replies'}`}

                                {showAllReplies ? <KeyBoardArrowUp /> : <KeyBoardArrowDown />}
                            </div>

                        </>

                    ) : null}

                    {replies?.map((reply, index) => {
                        return (
                            <Reply
                                key={index}
                                reply={reply}
                                comment={comment}
                                index={index}

                            ></Reply>
                        );
                    })}
                </div>
            ) : null}
            {!isResolved && !comment.deleted_at ? (
                <div className={commentStyles.replyAddContainer}>
                    <div className={commentStyles.avatarWrapper}>
                        <span className={commentStyles.avatar} style={{ backgroundColor: stringToColor(comment.created_by) }}>

                            {comment.created_by?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <ReplyAdd
                        users={users}
                        comment={comment}
                        refreshComments={refreshComments}
                        handleSnackbar={handleSnackbar}
                    />
                </div>
            ) : null}

        </div>
    );
};

export default Comment;
