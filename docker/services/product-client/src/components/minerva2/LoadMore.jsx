import { Button, alpha, makeStyles } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CodxCircularLoader from '../CodxCircularLoader';
import { loadConversations } from '../../store/thunks/minervaThunk';

const useStyles = makeStyles((theme) => ({
    loadmorebtn: {
        color: alpha(theme.palette.text.default, 0.7)
    }
}));

export default function LoadMore({ minervaAppId }) {
    const classes = useStyles();
    const { total_count, queries, loadingConversation, selectedWindowId, next_offset } =
        useSelector((s) => s.minerva);
    const dispatch = useDispatch();

    const handleLoadMore = () => {
        dispatch(
            loadConversations({
                minervaAppId: minervaAppId,
                windowId: selectedWindowId,
                query_limit: 10,
                query_offset: next_offset
            })
        );
    };

    if (loadingConversation) {
        return <CodxCircularLoader size={50} />;
    }

    if (queries.length < total_count) {
        return (
            <Button
                size="small"
                className={classes.loadmorebtn}
                onClick={handleLoadMore}
                aria-label="Load more"
            >
                Load more
            </Button>
        );
    } else return null;
}
