import React, { useCallback, useEffect, useState } from 'react';
import { storytheme } from '../createStory/CreateStory';
import { getPublishedStory } from 'services/reports';
import { Box, CircularProgress, makeStyles, ThemeProvider } from '@material-ui/core';
import { PreviewStory } from '../createStory/PreviewStory';
import { StoryContext } from '../createStory/storyContext';

const useStyle = makeStyles((theme) => ({
    root: {
        background: theme.palette.primary.dark,
        width: '100%',
        height: 'max-content',
        minHeight: '100%'
    },
    container: {
        flex: 1
    },
    loader: {
        position: 'absolute',
        top: '50%',
        right: '50%',
        transform: 'translate(-50%, -50%)',
        color: theme.palette.primary.contrastText
    },
    actionTool: {
        background: theme.palette.primary.main,
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    previewContainer: {
        padding: theme.spacing(6, 0),
        background: theme.palette.primary.dark
    }
}));
export default function PreviewPublishedStory({ ...props }) {
    const classes = useStyle();
    const [pages, setPages] = useState([]);
    const [story, setStory] = useState({});
    const [loading, setLoading] = useState(true);

    const initiate = useCallback((story = { pages: [], layouts: [], content: [], app_id: [] }) => {
        if (story) {
            setStory(story);
            setPages(story.pages);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        getPublishedStory({
            search: props.location.search,
            callback: initiate
        });
    }, [initiate, props.location.search]);

    return (
        <ThemeProvider theme={storytheme}>
            <StoryContext.Provider value={{ contents: story.content }}>
                <Box display="felx" flexDirection="column" className={classes.root}>
                    {loading ? (
                        <CircularProgress className={classes.loader} size={40} />
                    ) : (
                        <PreviewStory
                            noModal={true}
                            themeToggle={true}
                            pages={pages}
                            story={story}
                            classNames={{
                                actionTool: classes.actionTool,
                                previewContainer: classes.previewContainer
                            }}
                        />
                    )}
                </Box>
            </StoryContext.Provider>
        </ThemeProvider>
    );
}
