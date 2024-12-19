import React, { useContext, useEffect, useRef } from 'react';
import { Typography, alpha, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import TypingAnimation from '../TypingAnimation';

import { ReactComponent as MinervaLogo } from 'assets/img/minerva_logo.svg';
import { AuthContext } from 'auth/AuthContext';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import LoadMore from './LoadMore';
import QueryOutputItem from './QueryOutputItem';
// import { getSocket } from 'util/initiate_socket';
// import { setQueryProcessStatus } from 'store/slices/minervaSlice';

const useStyles = makeStyles((theme) => ({
    queryOutputRoot: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        overflowY: 'auto',
        height: '100%',
        padding: '1rem 10rem'
    },
    chatPopperView: {
        padding: '0 1rem',
        '& $emptyStateRoot svg': {
            width: '15rem',
            height: '15rem'
        }
    },
    emptyStateRoot: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        '& svg': {
            width: '20rem',
            height: '30rem',
            fill: alpha(theme.palette.text.default, 0.4),
            stroke: alpha(theme.palette.text.default, 0.45)
        },
        '& .MuiTypography-root': {
            fontSize: '2rem',
            color: alpha(theme.palette.text.default, 0.7)
        }
    }
}));

function QueryOutput({ appId, minervaAppId, chatPopperView, ...props }) {
    const classes = useStyles();
    const { queries, loadingConversation, scrollToResponseId } = useSelector((d) => d.minerva);
    // const dispatch = useDispatch();
    const queryOutputRootRef = useRef();

    // useEffect(() => {
    //     const scoket = getSocket('minerva_socket');
    //     const listener = (data) => {
    //         dispatch(setQueryProcessStatus(data));
    //     };
    //     scoket?.on('query_status', listener);
    //     return () => {
    //         scoket?.removeListener(listener);
    //     };
    // }, []);

    useEffect(() => {
        setTimeout(() => {
            const id = scrollToResponseId + '_minerva_result_output';
            const element = document.getElementById(id);
            if (element) {
                element?.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, 200);
    }, [scrollToResponseId]);

    useEffect(() => {
        if (queryOutputRootRef.current) {
            setTimeout(() => {
                queryOutputRootRef.current.scrollTo({
                    top: queryOutputRootRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }, [queries]);

    return (
        <div
            className={clsx(classes.queryOutputRoot, chatPopperView && classes.chatPopperView)}
            ref={queryOutputRootRef}
        >
            {queries?.length || loadingConversation ? null : (
                <EmptyState classes={classes} chatPopperView={chatPopperView} />
            )}
            <div style={{ margin: '0 auto' }}>
                <LoadMore minervaAppId={minervaAppId} />
            </div>
            {queries?.map((query) => (
                <QueryOutputItem
                    key={query.id || query.requestId}
                    query={query}
                    history={props.history}
                    appId={appId}
                    chatPopperView={chatPopperView}
                />
            ))}
        </div>
    );
}

function EmptyState({ chatPopperView, classes }) {
    const { user } = useContext(AuthContext);
    const text = `Hi ${
        user?.first_name || user?.last_name
    }! Ask questions to get insights about your data.`;
    return (
        <div className={classes.emptyStateRoot}>
            <MinervaLogo />
            <Typography variant="h4" align="center">
                {chatPopperView ? text : <TypingAnimation enableCaret text={text} />}
            </Typography>
        </div>
    );
}

export default withRouter(QueryOutput);
