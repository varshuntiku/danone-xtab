import React from 'react';
import { alpha, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import TextEditor2 from './TextEditor2';
import InfoPopper from '../InfoPopper';
import FileAttachment from './FileAttachment';

const useStyles = makeStyles((theme) => ({
    colorContrast: {
        color: theme.palette.primary.contrastText
    },
    colorDefault: {
        color: theme.palette.text.default
    },
    letterSpacing1: {
        letterSpacing: '0.02em'
    },
    fontSize1: {
        fontSize: '1.6rem'
    },
    fontSize2: {
        fontSize: '1.2rem'
    },
    button: {
        borderRadius: '20px',
        padding: '4px 20px'
    },
    gridContainer: {
        border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.4)}`,
        borderRadius: '4px',
        display: 'grid',
        gridColumn: 32,
        gridRow: 18,
        height: '100%',
        gap: '2rem',
        padding: '2rem',
        gridAutoColumns: '1fr',
        gridAutoRows: '1fr'
    },
    gridItem: {
        background: theme.palette.primary.main,
        borderRadius: '4px',
        padding: '2rem 3rem',
        overflow: 'auto'
    },
    textBoxHeader: {
        color: '#94c8ff',
        fontWeight: '700'
    },
    header1Class: {
        '& .rdw-editor-main': {
            fontSize: '2.3rem'
        }
    },
    textBoxWrapper: {
        flex: 1,
        fontSize: '1.8rem'
    }
}));

export default function GridLayout({ params, project, onChange }) {
    const classes = useStyles();
    const fixedAspectRatio = false; // ensure 16 : 9 aspect ratio when true
    return (
        <div aria-label="Grid Layout editor root" style={{ height: '100%' }}>
            <div
                aria-label="16/9 aspect ratio"
                style={{
                    paddingTop: fixedAspectRatio ? '56.25%' : '0',
                    height: fixedAspectRatio ? 'none' : '100%',
                    width: '100%',
                    position: 'relative'
                }}
            >
                <div
                    aria-label="grid container"
                    className={classes.gridContainer}
                    style={{ position: 'absolute', left: 0, top: 0, width: '100%' }}
                >
                    {params.sections.map((gridSection, i) => (
                        <div
                            aria-label="grid section"
                            key={i}
                            className={classes.gridItem}
                            style={{
                                gridRowStart: gridSection.rowStart,
                                gridRowEnd: gridSection.rowEnd,
                                gridColumnStart: gridSection.colStart,
                                gridColumnEnd: gridSection.colEnd
                            }}
                        >
                            <LayoutSectionComponent
                                gridSection={gridSection}
                                classes={classes}
                                project={project}
                                onChange={() => {
                                    params.sections[i] = gridSection;
                                    onChange(params);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LayoutSectionComponent({ gridSection, classes, project, onChange }) {
    const { component, params, dataKey } = gridSection;

    const handleTextBoxChange = (e) => {
        gridSection.params.content = e;
        onChange(gridSection);
    };

    const handleAttachmentChange = (e) => {
        gridSection.params.attachments = e;
        onChange(gridSection);
    };

    switch (component) {
        case 'rich-text-box:header1':
            return (
                <HeaderTextBox
                    {...params}
                    header1
                    classes={classes}
                    onChange={handleTextBoxChange}
                />
            );
        case 'rich-text-box:attachment':
            return (
                <AttachmentTextBox
                    {...params}
                    classes={classes}
                    savedAttachments={project.content[dataKey]?.attachments}
                    onTextChange={handleTextBoxChange}
                    onAttachmentChange={handleAttachmentChange}
                />
            );
        case 'rich-text-box':
            return <TextBox {...params} classes={classes} onChange={handleTextBoxChange} />;
        default:
            return (
                <Typography
                    variant="h6"
                    className={clsx(classes.colorDefault)}
                    style={{ opacity: 0.7 }}
                >
                    Work in progress...
                </Typography>
            );
    }
}

function TextBox({ title, info, onChange, classes, ...props }) {
    return (
        <div
            aria-label="rich text editor with header"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative'
            }}
        >
            {title ? (
                <Typography variant="h4" className={classes.textBoxHeader} gutterBottom>
                    {title}
                    {info ? (
                        <InfoPopper
                            {...info}
                            size="large"
                            style={{
                                marginLeft: '1rem'
                            }}
                        />
                    ) : null}
                </Typography>
            ) : null}
            <TextEditor2
                className={classes.textBoxWrapper}
                {...props}
                onChange={onChange}
                title={title}
            />
        </div>
    );
}

function HeaderTextBox({ info, onChange, header1, classes, ...props }) {
    const headerToolbar = {
        options: ['fontFamily', 'colorPicker', 'textAlign', 'remove']
    };
    return (
        <div
            aria-label="rich text editor header only"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative'
            }}
        >
            {info ? (
                <InfoPopper
                    {...info}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        transform: 'translate(-115%, -50%)'
                    }}
                />
            ) : null}
            <TextEditor2
                toolbar={header1 ? headerToolbar : null}
                className={
                    header1
                        ? clsx(classes.header1Class, classes.textBoxWrapper)
                        : classes.textBoxWrapper
                }
                {...props}
                onChange={onChange}
            />
        </div>
    );
}

function AttachmentTextBox({
    title,
    info,
    savedAttachments,
    onTextChange,
    onAttachmentChange,
    classes,
    ...props
}) {
    return (
        <div
            aria-label="rich text editor with header"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative'
            }}
        >
            {title ? (
                <Typography variant="h4" className={classes.textBoxHeader} gutterBottom>
                    {title}
                    {info ? (
                        <InfoPopper
                            {...info}
                            size="large"
                            style={{
                                marginLeft: '1rem'
                            }}
                        />
                    ) : null}
                </Typography>
            ) : null}
            <FileAttachment
                {...props}
                savedAttachments={savedAttachments}
                onChange={onAttachmentChange}
            />
            <TextEditor2 className={classes.textBoxWrapper} {...props} onChange={onTextChange} />
        </div>
    );
}

// function Questionnarie({questionnaire, ...props}) {
//     const []
//     return (
//         <div  aria-label='Questionnarie' style={{display:"flex", flexDirection: "column", height: "100%"}}>
//             {questionnaire.map(q => (
//                 <div>
//                     <div></div>
//                     <TextEditor2 {...props} onChange={onChange} />
//                 </div>
//             ))}
//         </div>
//     )
// }
