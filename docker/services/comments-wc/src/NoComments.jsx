import React from 'react';
import NoCommentIcon from './assets/NoCommentIcon';
import noCommentStyles from './noCommentStyles.module.css'


const NoComments = ({ filtersApplied }) => {
    return (
        <div className={noCommentStyles.main}>
            <span className={noCommentStyles.blankIcon}>
                <NoCommentIcon />
            </span>
            <span className={noCommentStyles.message}>{`${
                !filtersApplied ? 'No Comments Added' : 'No comments for the applied filters '
            }`}</span>
        </div>
    );
};

export default NoComments;
