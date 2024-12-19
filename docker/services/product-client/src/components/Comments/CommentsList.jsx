import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Comment from './Comment';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';

const useStyles = makeStyles(() => ({
    commentsList: {
        height: '100%',
        overflowY: 'scroll',
        width: '100%'
    }
}));

const CommentsList = (props) => {
    const {
        comments,
        users,
        onRemoveComment,
        shouldOpen,
        refreshComments,
        filterWidgetId,
        filterCommentId,
        filterScreenId,
        linkType,
        screenName,
        widget_name,
        screenId,
        app_info,
        isScenarioLibrary,
        shouldOpenLibraryHandler,
        enableHighlight
    } = props;
    const classes = useStyles();
    const [notificationOpen, setNotification] = useState({});
    const commentRefs = useRef([]);
    useEffect(() => {
        if (filterCommentId && shouldOpen) {
            const commentIndex = comments.findIndex((comment) => comment.id == filterCommentId);
            if (commentIndex !== -1 && commentRefs.current[commentIndex]) {
                commentRefs.current[commentIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else
                setNotification({
                    severity: 'warning',
                    message: 'The status of the comment may have changed'
                });
        }
    }, [filterCommentId, comments]);

    return (
        <div className={classes.commentsList}>
            {comments.map((comment, index) => (
                <div key={comment.id} ref={(el) => (commentRefs.current[index] = el)}>
                    <Comment
                        comment={comment}
                        users={users}
                        index={index}
                        onRemoveComment={onRemoveComment}
                        shouldOpen={shouldOpen}
                        refreshComments={refreshComments}
                        filterWidgetId={filterWidgetId}
                        filterCommentId={filterCommentId}
                        filterScreenId={filterScreenId}
                        linkType={linkType}
                        screenName={screenName}
                        widget_name={widget_name}
                        screenId={screenId}
                        app_info={app_info}
                        mode={comment.mode}
                        approvals={comment.approvals}
                        user_id={comment.user_id}
                        created_by={comment.created_by}
                        scenario_list={comment.scenario_list}
                        shouldOpenLibraryHandler={shouldOpenLibraryHandler}
                        isScenarioLibrary={isScenarioLibrary}
                        enableHighlight={enableHighlight}
                    />
                </div>
            ))}
            <CustomSnackbar
                open={notificationOpen?.message}
                autoHideDuration={2000}
                onClose={() => setNotification({})}
                severity={notificationOpen?.severity}
                message={notificationOpen?.message}
                data-testid="snackbar"
            />
        </div>
    );
};

export default withRouter(CommentsList);
