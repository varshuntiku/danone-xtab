import React, { useCallback, useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    Typography,
    withStyles,
    Link,
    useTheme
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { python } from 'react-syntax-highlighter/dist/cjs/languages/hljs';
import { atomOneDark, docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { Close, FileCopy } from '@material-ui/icons';
import { getUiacArchives } from 'services/app_admin';
import Archive from './icons/Archive';
SyntaxHighlighter.registerLanguage('python', python);

let memo = {};

const ArchivedUIaC = ({ classes, app_id, screen_id, screen_name, archiveType }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [activeSelection, setActiveSelection] = useState(screen_id);
    const [archiveList, setArchiveList] = useState([]);
    const [copied, setCopied] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        return () => {
            memo = {};
        };
    }, []);

    useEffect(() => {
        if (memo[activeSelection]) setArchiveList(memo[activeSelection]);
    }, [activeSelection]);

    const closeDialog = useCallback(() => {
        setShowDialog(false);
        setActiveSelection(screen_id);
    }, []);

    const openDialog = useCallback(() => {
        setShowDialog(true);
        loadArchives();
    }, []);

    const loadArchives = useCallback(
        (() => {
            let isLoaded = false;
            return async () => {
                if (isLoaded) return;
                setLoading(true);
                try {
                    const data = await getUiacArchives({ app_id, archiveType });
                    const options = memoizeArchiveAndGetOptions(data);
                    setOptions(options);
                    setArchiveList(memo[activeSelection]);
                    isLoaded = true;
                } catch (error) {
                    // console.error(error);
                }
                setLoading(false);
            };
        })(),
        []
    );

    const memoizeArchiveAndGetOptions = useCallback((archives) => {
        const options = [];
        let isCurrentScreenAdded = false;
        if (archiveType === 'visual') {
            archives.forEach((archive) => {
                const { screen_id: screenId, screen_title } = archive;
                if (screenId === screen_id) {
                    isCurrentScreenAdded = true;
                }

                if (memo[screenId]) {
                    memo[screenId].push(archive);
                } else {
                    memo[screenId] = [archive];
                    options.push({ label: screen_title, value: screenId });
                }
            });

            if (!isCurrentScreenAdded) {
                options.push({ label: screen_name, value: screen_id });
                memo[screen_id] = [];
            }
        } else if (archiveType === 'filter') {
            archives.forEach((archive) => {
                const { id: screenId, screen_title } = archive;
                if (screenId === screen_id) {
                    isCurrentScreenAdded = true;
                }

                if (memo[screenId]) {
                    memo[screenId].push(archive);
                } else {
                    memo[screenId] = [archive];
                    options.push({ label: screen_title, value: screenId });
                }
            });

            if (!isCurrentScreenAdded) {
                options.push({ label: screen_name, value: screen_id });
                memo[screen_id] = [];
            }
        }
        return options;
    }, []);

    const getTheme = () => {
        let currentTheme = localStorage.getItem('codx-products-theme');
        if (currentTheme && currentTheme === 'dark') {
            atomOneDark.hljs.background = theme.palette.primary.dark;
            return atomOneDark;
        } else {
            return docco;
        }
    };

    function copyCode(code) {
        setCopied(() => true);
        navigator.clipboard.writeText(code);
        setTimeout(() => {
            setCopied(() => false);
        }, 3000);
    }

    return (
        <div style={{ marginTop: theme.spacing(4) }}>
            <Link
                component="button"
                variant="button"
                className={classes.archiveButton}
                onClick={openDialog}
            >
                <Archive
                    color={theme.palette.text.contrastText}
                    className={classes.archiveButtonIcon}
                />
                Archived {archiveType === 'filter' && 'Filter'} UIaC Logs
            </Link>
            <Dialog
                open={showDialog}
                fullWidth
                maxWidth="xl"
                className={classes.archiveDialog}
                onClose={closeDialog}
                aria-labelledby="archived uiac logs"
            >
                <DialogTitle disableTypography className={classes.fixed} id="archived uiac logs">
                    <Typography variant="h4" className={classes.archiveDialogHeader}>
                        Archived {archiveType === 'filter' && 'Filter'} UIaC Logs
                    </Typography>
                    <IconButton title="Close" className={classes.closeButton} onClick={closeDialog}>
                        <Close fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorLine} />
                <div className={classes.archiveMessage}>
                    <Typography variant="h5">
                        Shows archived {archiveType === 'filter' ? 'Filter' : 'Visual'} UIaC for
                        last 60 days
                    </Typography>
                </div>
                <div className={classes.archiveDialogBody}>
                    {loading ? (
                        <CodxCircularLoader size={60} center />
                    ) : (
                        <div className={classes.archiveWrapper}>
                            <div className={classes.headingWrapper}>
                                <Select
                                    variant="filled"
                                    value={activeSelection}
                                    className={classes.input}
                                    fullWidth
                                    onChange={(e) => setActiveSelection(e.target.value)}
                                    IconComponent={ArrowDropDownIcon}
                                >
                                    {options.map(({ label, value }) => (
                                        <MenuItem value={value} key={value}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div className={classes.archiveList}>
                                {!archiveList?.length && (
                                    <Typography variant="h6" className={classes.widgetHeading}>
                                        No archives for the current screen
                                    </Typography>
                                )}
                                {archiveList?.map((archive, index) => (
                                    <div
                                        style={{
                                            marginBottom: theme.spacing(4)
                                        }}
                                        key={archiveType === 'visual' ? archive.widget_id : index}
                                    >
                                        <Typography variant="h6" className={classes.widgetHeading}>
                                            {archive.widget_title || '-'}
                                        </Typography>
                                        <div className={classes.codeWrapper}>
                                            <SyntaxHighlighter
                                                language="python"
                                                className={classes.codeBlock}
                                                style={getTheme()}
                                                customStyle={{
                                                    padding: theme.spacing(3)
                                                }}
                                                showLineNumbers
                                            >
                                                {archiveType === 'visual'
                                                    ? archive.widget_value.code
                                                    : archive.filter_value.code}
                                            </SyntaxHighlighter>
                                            <IconButton
                                                title={copied ? 'Copied' : 'Copy'}
                                                className={classes.copyButton}
                                                onClick={copyCode.bind(
                                                    null,
                                                    archiveType === 'visual'
                                                        ? archive.widget_value.code
                                                        : archive.filter_value.code
                                                )}
                                            >
                                                <FileCopy />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div></div>
            </Dialog>
        </div>
    );
};

export default withStyles(
    (theme) => ({
        archiveButton: {
            cursor: 'pointer',
            fontSize: theme.spacing(2),
            color: theme.palette.text.contrastText,
            textTransform: 'unset',
            display: 'flex',
            gap: theme.spacing(1.5),
            alignItems: 'center',
            '& svg': {
                width: '18px !important',
                height: '20px !important'
            }
        },
        archiveButtonIcon: {
            display: 'block',
            height: '100%',
            maxHeight: '18px',
            scale: 1.2
        },
        archiveDialog: {
            height: '100%',
            margin: 'auto',
            '& .MuiDialog-paper': {
                maxWidth: theme.layoutSpacing(854),
                maxHeight: '40rem',
                background: theme.palette.background.pureWhite
            }
        },
        fixed: {
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: theme.palette.background.pureWhite,
            padding: theme.layoutSpacing(20)
        },
        archiveDialogHeader: {
            background: theme.palette.background.pureWhite,
            color: theme.palette.text.titleText,
            fontFamily: theme.title.h1.fontFamily,
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            opacity: 0.8
        },
        archiveMessage: {
            color: theme.palette.text.contrastText,
            display: 'flex',
            justifyContent: 'right',
            padding: theme.spacing(3)
        },
        archiveDialogBody: {
            height: theme.spacing(100),
            display: 'flex',
            padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(44)}`,
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: theme.body.B5.fontFamily
        },
        archiveWrapper: {
            flex: 1,
            height: '100%',
            overflowY: 'scroll',
            padding: theme.spacing(3)
        },
        headingWrapper: {
            display: 'flex',
            gap: theme.spacing(2),
            alignItems: 'center'
        },
        archiveList: {
            padding: theme.spacing(4) + ' 0'
        },
        closeButton: {
            position: 'absolute',
            top: '4px',
            right: 0
        },
        input: {
            color: theme.palette.text.default + ' !important',
            fontSize: theme.spacing(2.5),
            fontWeight: 400,
            width: theme.layoutSpacing(300),
            background: theme.palette.background.pureWhite,
            borderRadius: 0,
            '& .MuiSelect-root': {
                padding: theme.spacing(2)
            },
            '&:before': {
                borderBottom: '1px solid ' + theme.palette.text.default
            },
            '&:after': {
                borderBottom: `2px solid ${theme.palette.text.default}`
            },
            '&:hover:not($disabled):not($focused):not($error):before': {
                borderBottom: `2px solid ${theme.palette.text.default}`
            },
            '& .MuiSvgIcon-root': {
                color: theme.palette.text.default,
                fontSize: theme.spacing(3.5)
            }
        },
        widgetHeading: {
            fontSize: theme.spacing(2),
            color: theme.palette.text.titleText
        },
        codeWrapper: {
            position: 'relative',
            marginTop: theme.spacing(2)
        },
        codeBlock: {
            width: '100%',
            display: 'block',
            color: theme.palette.text.default,
            fontSize: '1.5rem',
            maxHeight: theme.spacing(30),
            overflowY: 'scroll'
        },
        copyButton: {
            color: theme.palette.text.contrastText,
            position: 'absolute',
            top: 0,
            right: 0
        },
        sepratorLine: {
            width: 'calc(100% - 32px)',
            marginTop: 0,
            marginBottom: 0
        }
    }),
    {
        withTheme: true
    }
)(ArchivedUIaC);
