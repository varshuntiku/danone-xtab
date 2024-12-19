import React, { useContext } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';

import clsx from 'clsx';
import GridLayout from './content-editor/GridLayout';
import DynamicForm from '../../dynamic-form/dynamic-form';
import { useDebouncedCallback } from '../../../hooks/useDebounceCallback';
import InfoPopper from './InfoPopper';
import ConstraintsTable from './content-editor/ConstraintsTable';
import PDFbgDark from 'assets/img/pd-framework-bg-dark.png';
import PDFbgLight from 'assets/img/pd-framework-bg-light.png';
import { PDFrameworkContext } from './PDFrameworkContext';

const useStyles = makeStyles((theme) => ({
    subSectionRoot: {
        backgroundImage: theme.props?.mode === 'dark' ? `url(${PDFbgDark})` : `url(${PDFbgLight})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    suppressBackground: {
        background: 'none'
    },
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
    button: {
        // padding: "0.5rem 2.6rem"
    },
    header: {
        fontWeight: '600',
        opacity: '0.8'
    },
    subSectionContent: {
        height: '100%'
    },
    subSectionContentSmall: {
        height: `calc(100% - ${theme.layoutSpacing(60)})`
    },
    actions: {
        display: 'flex',
        padding: '1rem 18rem 0'
    }
}));

export default function PDFrameworkSubSection({
    lastSection,
    last,
    subSection,
    saveProcessing,
    project,
    onNext,
    onFinish,
    onChange
}) {
    const classes = useStyles();
    const {
        actionButtonPosition,
        finishButtonText,
        nextButtonText,
        suppressBackground,
        hideFinishButton
    } = useContext(PDFrameworkContext);
    return (
        <div
            aria-label="sub section root"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            className={clsx(
                classes.subSectionRoot,
                suppressBackground ? classes.suppressBackground : ''
            )}
        >
            <div
                aria-label="sub section header"
                style={{
                    display: 'flex',
                    padding: '2rem 18rem 0 18rem',
                    justifyContent: 'space-between',
                    position: 'relative'
                }}
            >
                <Typography variant="h4" className={clsx(classes.colorDefault, classes.header)}>
                    {subSection.header}
                    {subSection.info ? (
                        <InfoPopper
                            {...subSection.info}
                            data-testid={subSection.name + 'InfoPopper'}
                            size="large"
                            style={{
                                position: 'relative',
                                marginLeft: '1rem',
                                top: '-0.2rem'
                            }}
                        />
                    ) : null}
                </Typography>

                {actionButtonPosition !== 'bottom' ? (
                    lastSection && last ? (
                        hideFinishButton ? null : (
                            <Button
                                variant="contained"
                                size="small"
                                className={classes.button}
                                onClick={onFinish}
                                disabled={saveProcessing}
                                aria-label="Finish"
                            >
                                {finishButtonText || 'Finish'}
                            </Button>
                        )
                    ) : (
                        <Button
                            variant="contained"
                            size="small"
                            className={classes.button}
                            onClick={onNext}
                            data-testid="createProjectFinishButton"
                            aria-label="Next"
                        >
                            {nextButtonText || 'Next'}
                        </Button>
                    )
                ) : null}
            </div>
            <div
                aria-label="sub section content"
                style={{
                    padding: '1rem 18rem',
                    flex: subSection.contentType == 'project-details-form' ? 0 : 1
                }}
            >
                <SubSectionContent
                    subSection={subSection}
                    classes={classes}
                    project={project}
                    onChange={onChange}
                />
            </div>
            <div className={classes.actions}>
                {actionButtonPosition === 'bottom' ? <div style={{ flex: 1 }} /> : null}
                {actionButtonPosition === 'bottom' ? (
                    lastSection && last ? (
                        hideFinishButton ? null : (
                            <Button
                                variant="contained"
                                size="small"
                                className={classes.button}
                                onClick={onFinish}
                                disabled={saveProcessing}
                                aria-label="Finish"
                            >
                                {finishButtonText || 'Finish'}
                            </Button>
                        )
                    ) : (
                        <Button
                            variant="contained"
                            size="small"
                            className={classes.button}
                            onClick={onNext}
                            data-testid="createProjectFinishButton"
                            aria-label="Next"
                        >
                            {nextButtonText || 'Next'}
                        </Button>
                    )
                ) : null}
            </div>
        </div>
    );
}

function SubSectionContent({ subSection, classes, project, onChange }) {
    const { contentType, content } = subSection;

    const handleChange = useDebouncedCallback(
        (e) => {
            onChange(e);
        },
        [onChange],
        1000
    );

    const handleDynamicFormChange = (e) => {
        subSection.content = e;
        handleChange(subSection);
    };

    const handleGridLayoutChange = (e) => {
        subSection.content = e;
        handleChange(subSection);
    };

    const handleConstraintsTableChange = (e) => {
        subSection.content.tableParams.rowData = e;
        handleChange(subSection);
    };

    switch (contentType) {
        case 'project-details-form':
            return <DynamicForm params={content} onChange={handleDynamicFormChange} />;
        case 'grid-layout':
            return (
                <GridLayout params={content} project={project} onChange={handleGridLayoutChange} />
            );
        case 'constraints-table':
            return <ConstraintsTable params={content} onChange={handleConstraintsTableChange} />;
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
