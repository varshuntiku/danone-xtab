import {
    Box,
    Grid,
    makeStyles,
    Typography,
    Paper,
    Button,
    alpha,
    IconButton,
    Avatar
} from '@material-ui/core';
import React, { useState, useEffect, useContext, Fragment } from 'react';
import clsx from 'clsx';
import TextEditor from './textEditor';
import AddCharts from './dialog/addChart';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { Skeleton } from '@material-ui/lab';
import * as _ from 'underscore';
import imgPlaceholder from 'assets/img/create-story-layouts/img-placeholder.png';
import AddIcon from '@material-ui/icons/Add';
import VisualContents from './visualContent';
import EditIcon from '@material-ui/icons/Edit';
import { StoryContext } from './storyContext';

const useStyle = makeStyles((theme) => ({
    sectionTools: {
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    layoutContent: {
        color: theme.palette.text.default,
        fontSize: '12px'
    },
    layoutDetailsSkeleton: {
        backgroundColor: theme.palette.primary.main
    },
    layoutSectionBorder: {
        border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.4)}`
    }
}));

const PageDetailsContext = React.createContext({
    previewMode: false,
    disablePlaceHolder: false,
    outerClasses: null
});

const useStyle2 = makeStyles((theme) => ({
    containerRoot: (props) => ({
        height: '100%',
        position: 'relative',
        ...(props.previewMode
            ? {}
            : {
                  borderColor: theme.palette.primary.contrastText,
                  border: '1px solid',
                  borderRadius: theme.spacing(1)
              })
    }),
    container: {
        height: '100%',
        gridGap: theme.spacing(2),
        padding: theme.spacing(2),
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridTemplateRows: 'auto auto auto auto auto'
    },
    layoutSection: {
        background: theme.palette.primary.dark
    },
    noLayout: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '50rem',
        textAlign: 'center',
        gap: '1rem'
    },
    avator: {
        color: theme.palette.text.default,
        backgroundColor: theme.palette.primary.dark,
        width: '15rem',
        height: '15rem',
        '& svg': {
            fontSize: '7rem'
        }
    }
}));
const PageDetails = React.memo(function ({
    page,
    onDataChange = () => {},
    previewMode,
    disablePlaceHolder,
    classNames,
    story
}) {
    const classes = useStyle2({ previewMode });
    const commonClasses = useStyle();
    const { style, layoutProps } = page || {};

    if (!page) {
        return null;
    }
    return (
        <PageDetailsContext.Provider
            value={{ previewMode, disablePlaceHolder, outerClasses: classNames }}
        >
            <Grid
                direction="column"
                container
                spacing={2}
                style={{
                    height: '100%',
                    paddingRight: story?.app_id[0] !== 1838 ? '0rem' : '20rem'
                }}
                className={classNames && classNames.root}
                wrap="nowrap"
            >
                {!previewMode && (
                    <Grid item xs={12} className={commonClasses.sectionTools} style={{ flex: 0 }}>
                        <Typography variant="h4">Layout Details</Typography>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <div
                        className={clsx(
                            classes.containerRoot,
                            classNames && classNames.containerRoot
                        )}
                    >
                        {page.layoutId ? (
                            <Box display="grid" style={{ ...style }} className={classes.container}>
                                {layoutProps.sections.map((section) => (
                                    <SectionRenderer
                                        key={section.dataKey}
                                        data={page.data[section.dataKey]}
                                        onDataChange={onDataChange}
                                        layoutSection={section}
                                        classes={classes}
                                        commonClasses={commonClasses}
                                        classNames={classNames}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Box className={classes.noLayout} position="absolute">
                                <Avatar className={classes.avator}>
                                    <DescriptionOutlinedIcon />
                                </Avatar>
                                <Typography variant="h4">
                                    {
                                        'No layouts selected yet. Choose a layout to start creating your story.'
                                    }
                                </Typography>
                            </Box>
                        )}
                    </div>
                </Grid>
            </Grid>
        </PageDetailsContext.Provider>
    );
});

PageDetails.displayName = 'PageDetails';

const SectionRenderer = React.memo(function ({
    data,
    layoutSection,
    onDataChange,
    classes,
    commonClasses,
    classNames
}) {
    let comp = null;
    switch (layoutSection.component) {
        case 'header':
            comp = (
                <HeaderContent
                    data={data}
                    layoutSection={layoutSection}
                    onDataChange={onDataChange.bind(null, layoutSection.dataKey)}
                />
            );
            break;
        case 'text':
            comp = (
                <TextContent
                    data={data}
                    layoutSection={layoutSection}
                    onDataChange={onDataChange.bind(null, layoutSection.dataKey)}
                />
            );
            break;
        case 'visualContent':
            comp = (
                <VisualContent
                    data={data}
                    layoutSection={layoutSection}
                    onDataChange={onDataChange.bind(null, layoutSection.dataKey)}
                />
            );
            break;
        case 'keyFinding':
            comp = (
                <KeyFindingContent
                    data={data}
                    layoutSection={layoutSection}
                    onDataChange={onDataChange.bind(null, layoutSection.dataKey)}
                />
            );
            break;
        default:
            return null;
    }

    return (
        <Box
            key={layoutSection.dataKey}
            minHeight="90px"
            component={(props) => <Paper variant="outlined" {...props} />}
            className={clsx(
                classNames && classNames.layoutSection,
                classes.layoutSection,
                data && commonClasses.layoutSectionBorder
            )}
            gridArea={layoutSection.gridArea}
        >
            {comp}
        </Box>
    );
});

SectionRenderer.displayName = 'SectionRenderer';

function HeaderContent({ data, onDataChange }) {
    const [editing, setEditing] = useState(false);
    const commonClasses = useStyle();
    const { disablePlaceHolder } = useContext(PageDetailsContext);
    if (editing) {
        return (
            <TextEditor
                content={data}
                onAdd={onDataChange}
                onCancle={setEditing.bind(null, false)}
            />
        );
    } else {
        return (
            <Box height="100%" position="relative">
                {data ? (
                    // <div className={commonClasses.layoutContent}  dangerouslySetInnerHTML={{__html:data}} />
                    <TextEditor content={data} viewMode />
                ) : disablePlaceHolder ? null : (
                    <Box
                        display="flex"
                        gridGap="1rem"
                        height="100%"
                        justifyContent="flex-start"
                        alignItems="center"
                        padding="2rem"
                    >
                        <Skeleton
                            className={commonClasses.layoutDetailsSkeleton}
                            animation={false}
                            variant="rect"
                            height={50}
                            width={50}
                        />
                        <div style={{ width: '100%' }}>
                            <Typography variant="h4">
                                <Skeleton
                                    className={commonClasses.layoutDetailsSkeleton}
                                    animation={false}
                                    variant="text"
                                    width="80%"
                                />
                            </Typography>
                            <Typography variant="h5">
                                <Skeleton
                                    className={commonClasses.layoutDetailsSkeleton}
                                    animation={false}
                                    variant="text"
                                    width="30%"
                                />
                            </Typography>
                        </div>
                    </Box>
                )}
                <ContentEditButton
                    disableCoverButton={data}
                    text={data ? 'Click to edit Title' : 'Click to add Title'}
                    onClick={setEditing.bind(null, true)}
                />
            </Box>
        );
    }
}

function TextContent({ data, onDataChange, layoutSection }) {
    const [editing, setEditing] = useState(false);
    const commonClasses = useStyle();
    const layoutRows = layoutSection.rowCount;
    const { disablePlaceHolder } = useContext(PageDetailsContext);
    if (editing) {
        return (
            <TextEditor
                content={data}
                onAdd={onDataChange}
                onCancle={setEditing.bind(null, false)}
            />
        );
    } else {
        return (
            <Box height="100%" position="relative">
                {data ? (
                    // <div className={commonClasses.layoutContent}  dangerouslySetInnerHTML={{__html:data}} />
                    <TextEditor content={data} viewMode />
                ) : disablePlaceHolder ? null : (
                    <Box
                        display="flex"
                        flexDirection="column"
                        height="100%"
                        justifyContent="flex-start"
                        padding="2rem"
                    >
                        {_.range(layoutRows * (layoutRows > 2 ? 7 : 3)).map((i) => (
                            <Typography key={i} variant="body1">
                                <Skeleton
                                    className={commonClasses.layoutDetailsSkeleton}
                                    animation={false}
                                    variant="text"
                                    width={`${_.random(40) + 60}%`}
                                />
                            </Typography>
                        ))}
                    </Box>
                )}
                <ContentEditButton
                    disableCoverButton={data}
                    text={data ? 'Click to edit Text' : 'Click to add Text'}
                    onClick={setEditing.bind(null, true)}
                />
            </Box>
        );
    }
}

function KeyFindingContent({ data, onDataChange, layoutSection }) {
    const [editing, setEditing] = useState(false);
    const commonClasses = useStyle();
    const layoutRows = layoutSection.rowCount;
    const layoutCols = layoutSection.colCount;
    const { disablePlaceHolder } = useContext(PageDetailsContext);
    if (editing) {
        return (
            <TextEditor
                content={data}
                onAdd={onDataChange}
                onCancle={setEditing.bind(null, false)}
                component="keyFindingContent"
            />
        );
    } else {
        return (
            <Box height="100%" position="relative" padding="1rem">
                {/* {
                    content ? [
                        <div className={commonClasses.layoutContent}  dangerouslySetInnerHTML={{__html:content}} />,
                        <ContentEditButton text={content ? "Click to edit Key Findings":"Click to add Key Findings"} onClick={setEditing.bind(null, true)} />
                 ] : ( */}
                <Box
                    display="flex"
                    flexWrap="wrap"
                    gridGap="1rem"
                    height="100%"
                    alignItems="center"
                    flexDirection={layoutCols > 2 ? 'row' : 'column'}
                    justifyContent="flex-start"
                    padding="1rem"
                >
                    {disablePlaceHolder ? null : <AddKeyFindingImageButton />}
                    <Box width={layoutCols > 2 ? '50%' : '100%'} position="relative">
                        {data ? (
                            // <div className={commonClasses.layoutContent}  dangerouslySetInnerHTML={{__html:data}} />
                            <TextEditor content={data} viewMode />
                        ) : disablePlaceHolder ? null : (
                            _.range(layoutRows * 3).map((i) => (
                                <Typography key={i} variant="body1">
                                    <Skeleton
                                        className={commonClasses.layoutDetailsSkeleton}
                                        animation={false}
                                        variant="text"
                                        width={`${_.random(10) + 90}%`}
                                    />
                                </Typography>
                            ))
                        )}
                        <ContentEditButton
                            disableCoverButton={data}
                            text={data ? 'Click to edit Key Findings' : 'Click to add Key Findings'}
                            onClick={setEditing.bind(null, true)}
                        />
                    </Box>
                    {disablePlaceHolder ? null : <AddKeyFindingImageButton />}
                    {disablePlaceHolder ? null : layoutRows > 2 && <AddKeyFindingImageButton />}
                </Box>
                {/* )
                } */}
            </Box>
        );
    }
}

const useVisualContentStyle = makeStyles((theme) => ({
    root: {
        background: theme.palette.primary.dark
    },
    placeholderDiv: {
        background: `url(${imgPlaceholder}) no-repeat center center`,
        backgroundSize: 'contain'
    }
}));
function VisualContent({ data, onDataChange }) {
    const classes = useVisualContentStyle();
    const [graphData, setGraphData] = useState(null);
    const { contents } = useContext(StoryContext);
    const value = contents[data] && contents[data].value;
    const { previewMode, disablePlaceHolder } = useContext(PageDetailsContext);
    useEffect(() => {
        if (value) {
            setGraphData(JSON.parse(value));
        }
    }, [value]);

    return (
        <Box
            height="100%"
            position="relative"
            display="flex"
            flexDirection="column"
            overflow="hidden"
        >
            <Box display="flex" justifyContent="flex-end" width="100%" className={classes.root}>
                {/* needs to be optimized useEffect Object.values goes there. AddCharts selectedGraph => contents */}
                {!previewMode && contents && (
                    <AddCharts
                        title="select chart"
                        selectedGraph={contents}
                        onGraphDataChange={(d) => {
                            onDataChange(d.content_id);
                        }}
                        nameFlag={false}
                    />
                )}
            </Box>
            {graphData ? (
                <Box flex={1} display="grid" alignItems="center" padding="1rem">
                    <VisualContents item={contents[data]} />
                </Box>
            ) : disablePlaceHolder ? null : (
                <Box flex={1} className={classes.placeholderDiv}></Box>
            )}
        </Box>
    );
}

const useStyleKFIButton = makeStyles((theme) => ({
    btn: {
        background: `url(${imgPlaceholder}) no-repeat scroll right center`,
        border: `1px dashed ${theme.palette.primary.main}`,
        borderRadius: '50%',
        backgroundOrigin: 'content-box',
        backgroundSize: 'contain',
        width: '60px',
        height: '60px',
        cursor: 'pointer',
        transition: '0.3s',
        '& svg': {
            fontSize: '4rem',
            color: theme.palette.text.default,
            opacity: 0.4,
            transition: '0.3s'
        },
        '&:hover': {
            '& svg': {
                opacity: 0.8
            }
        }
    }
}));
function AddKeyFindingImageButton({ onClick = () => {} }) {
    const classes = useStyleKFIButton();
    return (
        <Button onClick={onClick} className={classes.btn} aria-label="Add">
            <AddIcon />
        </Button>
    );
}

const useContentEditButtonStyle = makeStyles(() => ({
    btn: {
        position: 'absolute',
        top: '0',
        right: '-5px',
        opacity: 0.4,
        transition: '300ms',
        zIndex: 1,
        '&:hover': {
            opacity: 1
        }
    }
}));
function ContentEditButton({ text, onClick, disableCoverButton, editButtonContent }) {
    const classes = useContentEditButtonStyle();
    const { previewMode } = useContext(PageDetailsContext);
    if (previewMode) {
        return null;
    }
    return (
        <Fragment>
            {disableCoverButton ? null : (
                <Box
                    key={1}
                    title={text}
                    width="100%"
                    height="100%"
                    top={0}
                    right={0}
                    position="absolute"
                    style={{ cursor: 'pointer' }}
                    onClick={onClick}
                ></Box>
            )}
            {editButtonContent || (
                <IconButton
                    key={2}
                    title={text}
                    onClick={onClick}
                    className={classes.btn}
                    variant="contained"
                    aria-label="Edit"
                >
                    <EditIcon fontSize="large" />
                </IconButton>
            )}
        </Fragment>
    );
}

export default PageDetails;
