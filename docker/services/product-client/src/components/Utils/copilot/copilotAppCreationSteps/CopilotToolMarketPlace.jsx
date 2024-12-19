import {
    Button,
    Chip,
    Dialog,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import copilotConfiguratorStyle from '../styles/copilotConfiguratorStyle';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import SearchBar from 'components/CustomSearchComponent/SearchComponent';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from 'assets/Icons/CloseBtn';
import clsx from 'clsx';
import MarkdownRenderer from 'components/MarkdownRenderer';
import { getPublishedToolsDocs } from 'services/copilot';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { ReactComponent as WarningIcon } from 'assets/img/warningIcon.svg';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CopilotToolConfiguratorContext from '../context/CopilotToolConfiguratorContextProvider';

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        width: theme.layoutSpacing(1200),
        height: theme.layoutSpacing(782),
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        borderColor: theme.palette.background.modelBackground
    },
    root: {
        margin: 0,
        padding: theme.layoutSpacing(20),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        }
    },
    titleWrapper: {
        background: theme.palette.background.modelBackground,
        padding: `0 ${theme.layoutSpacing(16)}`
    },
    innerTitle: {
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        padding: `${theme.layoutSpacing(20)} ${theme.layoutSpacing(4)}`,
        height: theme.layoutSpacing(76),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        '& .MuiGrid-container': {
            margin: 0
        },
        '& .MuiGrid-item': {
            padding: 0,
            alignItems: 'center'
        }
    },
    title: {
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 'normal',
        fontSize: theme.layoutSpacing(22),
        letterSpacing: theme.layoutSpacing(1),
        color: theme.palette.text.revamp
    },
    closeButton: {
        '& span': {
            fill: theme.palette.text.contrastText
        }
    },
    dialogContent: {
        padding: theme.layoutSpacing(0, 16),
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiGrid-container': {
            height: '100%'
        }
    },
    skillSetListGrid: {
        paddingTop: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(20),
        borderRight: '1px solid ' + theme.palette.border.loginGrid,
        height: '100%',
        display: 'flex'
    },
    listHeader: {
        color: theme.palette.text.revamp
    },
    toolListAction: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginTop: theme.layoutSpacing(18.27),

        '& #customSearchSelector .MuiFormControl-root .MuiFormControl-root .MuiOutlinedInput-root':
            {
                borderRadius: theme.layoutSpacing(1),

                '& .MuiInputAdornment-root svg': {
                    fill: theme.palette.text.contrastText
                },
                '& fieldset': {
                    borderColor: theme.palette.border.grey
                },

                '&.Mui-focused': {
                    border: 0,

                    '& fieldset': {
                        borderColor: theme.palette.border.inputFocus
                    }
                }
            }
    },
    toolFilterBtn: {
        borderRadius: theme.layoutSpacing(4),
        border: `1px solid ${theme.palette.border.grey}`,
        padding: theme.layoutSpacing(9.3312)
    },
    toolList: {
        marginTop: theme.layoutSpacing(18.24),
        overflowY: 'auto',
        height: '100%'
    },
    toolListItem: {
        height: theme.layoutSpacing(52),
        cursor: 'pointer'
    },
    selectedToolListItem: {
        background: theme.palette.background.navLinkBackground,
        borderRadius: theme.layoutSpacing(4),

        '& .MuiListItemText-root': {
            '& .MuiListItemText-primary': {
                fontWeight: 500,
                fontFamily: 'Graphik'
            }
        }
    },
    skillSetDetailGrid: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%'
    },
    toolDetails: {
        overflowY: 'auto',
        padding: theme.layoutSpacing(24),
        flex: 1,

        '& .MuiDivider-root': {
            marginTop: theme.layoutSpacing(20),
            marginLeft: theme.layoutSpacing(-24),
            marginBottom: theme.layoutSpacing(20),
            backgroundColor: theme.palette.border.loginGrid
        },
        '& #markdownRenderer': {
            marginTop: theme.layoutSpacing(28)
        }
    },
    toolTitle: {
        fontFamily: 'Graphik Compact',
        fontSize: theme.layoutSpacing(20),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(27),
        color: theme.palette.text.revamp,
        paddingBottom: theme.layoutSpacing(10)
    },

    sectionTitle: {
        fontFamily: 'Graphik',
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(19),
        color: theme.palette.text.revamp
    },
    // tagsSection: {
    //     paddingTop: theme.layoutSpacing(21)
    // },
    tagChips: {
        padding: theme.layoutSpacing(12, 0, 0, 0),
        '& .MuiChip-root': {
            padding: theme.layoutSpacing(5, 12)
        }
    },
    actionPanel: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
        padding: theme.layoutSpacing(16, 0)
    },
    noActiveToolDetail: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: theme.palette.text.revamp
    },
    markdownHeader: {
        fontFamily: 'Graphik',
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(19),
        color: theme.palette.text.revamp
    },
    selectedMenuItem: {
        backgroundColor: alpha(theme.palette.background.menuItemFocus, 0.6)
    },
    compatibilityInfo: {
        padding: theme.layoutSpacing(16, 0),
        '& .MuiTypography-root': {
            fontSize: theme.layoutSpacing(14),
            lineHeight: theme.layoutSpacing(20),
            letterSpacing: theme.layoutSpacing(0.5),
            fontWeight: 400,
            color: theme.palette.text.default,
            '& b': {
                textTransform: 'capitalize'
            },
            '& span': {
                textTransform: 'capitalize'
            },
            '& svg': {
                height: theme.layoutSpacing(24),
                width: theme.layoutSpacing(24),
                fill: theme.palette.text.default,
                color: theme.palette.text.default,
                verticalAlign: 'bottom'
            }
        }
    },
    compatible: {
        background: theme.palette.background.infoBg
    },
    incompatible: {
        background: theme.palette.background.warningBg,
        '& .MuiTypography-root': {
            color: theme.palette.text.purpleText,
            '& svg': {
                fill: theme.palette.text.purpleText,
                color: theme.palette.text.purpleText
            }
        }
    },
    toolListItemInactive: {
        opacity: 0.4
    },
    toolVersionInfo: {
        fontSize: theme.layoutSpacing(15),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(18),
        letterSpacing: theme.layoutSpacing(0.5),
        color: theme.palette.text.revamp,
        paddingBottom: theme.layoutSpacing(10)
    },
    backButton: {
        width: theme.layoutSpacing(24),
        height: theme.layoutSpacing(24),
        alignItems: 'center'
    },
    toolVersionTimeline: {
        marginTop: 0,
        height: '100%',
        overflowY: 'auto',
        background: alpha(theme.palette.text.white, 0.04),
        '& .MuiTimelineItem-root': {
            minHeight: theme.layoutSpacing(80)
        },
        '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none'
        },
        '& .MuiTimelineSeparator-root': {
            transform: 'translate(0, 1rem)'
        },
        '& .MuiTimelineDot-root': {
            marginTop: 0,
            marginBottom: 0,
            width: theme.layoutSpacing(8),
            height: theme.layoutSpacing(8),
            boxShadow: 'none',
            backgroundColor: theme.palette.background.timelineDot,
            border: `${theme.layoutSpacing(0.5)} solid ${theme.palette.border.timelineDot}`
        },
        '& .MuiTimelineConnector-root': {
            transform: `translate(${theme.layoutSpacing(-0.5)}, 0)`,
            backgroundColor: theme.palette.background.timelineDot,
            border: `1px solid ${alpha(theme.palette.text.white, 0.04)}`
        },
        '& .MuiTimelineContent-root': {
            cursor: 'pointer'
        }
    },
    toolVersionItemHeader: {
        fontSize: theme.layoutSpacing(15),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(19),
        letterSpacing: theme.layoutSpacing(0.5),
        color: theme.palette.text.revamp,
        display: 'flex',
        gap: theme.layoutSpacing(12),
        alignItems: 'center'
    },
    toolVersionItemDate: {
        fontSize: theme.layoutSpacing(12),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(19),
        letterSpacing: theme.layoutSpacing(0.5),
        color: theme.palette.border.dashboard
    },
    activeToolVersionItem: {
        '& .MuiTimelineContent-root': {
            backgroundColor: alpha(theme.palette.text.revamp, 0.1),
            marginLeft: theme.layoutSpacing(12),
            height: '70%',
            '& $toolVersionItemHeader': {
                fontWeight: 500
            }
        },
        '& .MuiTimelineDot-root': {
            // width: theme.layoutSpacing(12),
            // height: theme.layoutSpacing(12),
            backgroundColor:
                theme.props.mode === 'light'
                    ? theme.palette.background.table
                    : theme.palette.border.timelineDot,
            border: `${theme.layoutSpacing(0.5)} solid ${theme.palette.border.timelineDot}`
        }
    },
    toolVersionVerifyIcon: {
        color: theme.palette.icons.successIconFill
    },
    toolVersionListButton: {
        fontSize: theme.layoutSpacing(15),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(18),
        letterSpacing: theme.layoutSpacing(0.5),
        color: '#478BDB',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    toolInfoSection: {
        display: 'grid',
        gridTemplateColumns: '1fr auto'
    },
    toolVersionVerifyLabel: {
        backgroundColor: alpha(theme.palette.icons.successIconFill, 0.3),
        borderRadius: theme.layoutSpacing(2),
        padding: theme.layoutSpacing(8),
        display: 'flex',
        alignItems: 'center',
        gap: theme.layoutSpacing(4),
        fontFamily: 'Graphik Compact',
        fontSize: theme.layoutSpacing(13),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(17.29),
        letterSpacing: theme.layoutSpacing(1.5)
    },
    toolListloaderWarpper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '82%',
        position: 'absolute',
        background: theme.palette.background.selected,
        width: '97.29%'
    }
}));

const DialogTitle = (props) => {
    const { children, classes, onClose, ...other } = props;

    return (
        <MuiDialogTitle
            disableTypography
            className={`${classes.root} ${classes.titleWrapper}`}
            {...other}
        >
            <div className={classes.innerTitle}>
                <Grid container spacing={2}>
                    <Grid item xs={true} style={{ display: 'flex' }}>
                        <Typography className={classes.title}>{children}</Typography>
                    </Grid>
                    <Grid item xs="auto">
                        {onClose ? (
                            <IconButton
                                aria-label="close"
                                className={classes.closeButton}
                                onClick={onClose}
                                title="close"
                            >
                                <CloseIcon />
                            </IconButton>
                        ) : null}
                    </Grid>
                </Grid>
            </div>
        </MuiDialogTitle>
    );
};
const cachedDocs = {};

export default function CopilotToolMarketPlace({
    is_test,
    orchestrator,
    openMarketplace,
    toolName,
    tool_version_registry_mapping_id,
    tool_version_config,
    showInfo,
    onAddSkill,
    onCloseMarketPlace
}) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();

    const toolConfigContext = useContext(CopilotToolConfiguratorContext);
    const {
        activeRegistryId,
        setActiveRegistryId,
        registryList,
        fetchCopilotToolRegistry,
        isLoadingPublishedTools,
        publishedTools
    } = toolConfigContext;

    const [open, setOpen] = useState(openMarketplace || false);
    const [search, setSearch] = useState('');
    const [activeTool, setActiveTool] = useState(
        toolName ? { name: toolName, tool_version_config: tool_version_config } : null
    );
    const [activeToolDocument, setActiveToolDocument] = useState('');
    const [anchorEl, setAnchorEL] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [baseToolList, setBaseToolList] = useState([]);
    const [selectedBaseTool, setSelectedBaseTool] = useState(null);
    const [toolVersionList, setToolVersionList] = useState([]);
    const [showToolVersions, setShowToolVersions] = useState(false);

    const toolRegistryList = is_test ? registryList : registryList?.filter((el) => !el.is_test);

    useEffect(() => {
        //sorting to get compatible tools on the top
        publishedTools
            ?.sort((a, b) => {
                const aHasOrchestrator = a?.orchestrators?.includes(orchestrator?.id) ? -1 : 1;
                const bHasOrchestrator = b?.orchestrators?.includes(orchestrator?.id) ? -1 : 1;
                return aHasOrchestrator - bHasOrchestrator;
            })
            .sort((b, a) => a.verified - b.verified);

        const baseToolIdsList = [...new Set(publishedTools?.map((item) => item.tool_id))];
        const filteredBaseToolList = baseToolIdsList.map((baseToolId) => {
            const baseTool = publishedTools?.find((obj) => obj.tool_id === baseToolId);
            const hasCompatibleToolVersion = getToolVersionsList(baseToolId)?.some((toolItem) => {
                return toolItem?.orchestrators?.includes(orchestrator?.id);
            });
            const hasVerifiedToolVersion = getToolVersionsList(baseToolId)?.some(
                (toolItem) => toolItem.verified
            );
            return {
                id: baseToolId,
                name: baseTool.tool_name,
                hasCompatibleToolVersion: hasCompatibleToolVersion,
                hasVerifiedToolVersion: hasVerifiedToolVersion
            };
        });
        setBaseToolList(filteredBaseToolList);
        if (!hasMounted) {
            setHasMounted(true);
            return;
        } else {
            handleBaseToolSelect(filteredBaseToolList?.[0]);
        }
    }, [publishedTools]);

    useEffect(() => {
        if (!showInfo) {
            fetchCopilotToolRegistry();
        }
    }, []);

    useEffect(() => {
        let _tool_version_registry_mapping_id = tool_version_registry_mapping_id;
        if (!_tool_version_registry_mapping_id) {
            const searchParams = new URLSearchParams(location.search);
            _tool_version_registry_mapping_id = +searchParams.get(
                'tool_version_registry_mapping_id'
            );
        }
        if (_tool_version_registry_mapping_id) {
            if (!showInfo) {
                const publishedToolData = publishedTools.find(
                    (obj) => obj.id === _tool_version_registry_mapping_id
                );
                handleBaseToolSelect(
                    { name: publishedToolData?.tool_name, id: publishedToolData?.tool_id },
                    publishedToolData?.tool_version_id
                );
            }
            fetchSkillSetDocument(_tool_version_registry_mapping_id, is_test);
        }
    }, [tool_version_registry_mapping_id, is_test]);

    const fetchSkillSetDocument = async (id, is_test = false) => {
        try {
            setIsLoading(true);
            if (!cachedDocs?.[id] || is_test) {
                const toolDoc = await getPublishedToolsDocs(id, is_test);
                cachedDocs[id] = toolDoc;
                setActiveToolDocument(toolDoc);
            } else {
                setActiveToolDocument(cachedDocs[id]);
            }
            setIsLoading(false);
        } catch (e) {
            /* empty */
        }
    };

    const handleClose = () => {
        setOpen(false);
        onCloseMarketPlace();
    };

    const handleSkillsetSearch = (val) => {
        setSearch(val);
    };

    const handleAddSkill = () => {
        const selectedSkill = activeTool;
        onAddSkill(selectedSkill);
    };

    // const handleToolItemSelect = async (toolItem) => {
    //     setActiveTool(toolItem);
    //     setActiveToolDocument('');
    //     fetchSkillSetDocument(toolItem.id);
    // };

    const handleToolVersionSelect = async (toolItem) => {
        setActiveTool(toolItem);
        setActiveToolDocument('');
        fetchSkillSetDocument(toolItem.id, toolItem.is_test);
    };

    const handleFilterClick = (e) => {
        setAnchorEL(e.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEL(null);
    };

    const handleRegistryClick = (item) => {
        setActiveRegistryId(item.id);
        handleFilterClose();
    };

    const handleBaseToolSelect = (item, selectedToolVersion = null) => {
        setSelectedBaseTool(item);
        const toolVersionList = getToolVersionsList(item?.id);
        const latestCompatibleToolVersionIndex = selectedToolVersion
            ? toolVersionList?.findIndex((toolItem) => {
                  return toolItem.tool_version_id == selectedToolVersion;
              })
            : toolVersionList?.findIndex((toolItem) => {
                  return toolItem?.orchestrators?.includes(orchestrator?.id);
              });
        const defaultSelectedVersion =
            latestCompatibleToolVersionIndex !== -1 ? latestCompatibleToolVersionIndex : 0;
        setToolVersionList(toolVersionList);
        handleToolVersionSelect(toolVersionList?.[defaultSelectedVersion]);
    };

    const getToolVersionsList = (baseToolId) => {
        return publishedTools
            ?.map((obj) => {
                if (obj.tool_id === baseToolId) {
                    return obj;
                }
            })
            .filter((item) => item) // to filter undefined elements
            .sort((a, b) => {
                // sort based on published tool id
                return b.id - a.id;
            });
    };

    const getToolVersionDate = (toolItem = null) => {
        if (!toolItem) {
            const toolVersionCreatedAt = activeTool?.tool_version_created_at
                ? activeTool?.tool_version_created_at
                : activeTool?.created_at;
            const toolCreationDate = new Date(Date.parse(toolVersionCreatedAt));
            return (
                String(toolCreationDate.getDate()).padStart(2, '0') +
                '-' +
                String(toolCreationDate.getMonth() + 1).padStart(2, '0') +
                '-' +
                toolCreationDate.getFullYear()
            );
        } else {
            const toolCreationDate = new Date(Date.parse(toolItem?.created_at));
            return (
                String(toolCreationDate.getDate()).padStart(2, '0') +
                '-' +
                String(toolCreationDate.getMonth() + 1).padStart(2, '0') +
                '-' +
                toolCreationDate.getFullYear()
            );
        }
    };

    const handleOpenToolVersionList = () => {
        setShowToolVersions(!showToolVersions);
    };

    const isCompatible = activeTool?.orchestrators?.includes(orchestrator?.id);

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={'md'}
            classes={{
                paper: classes.dialogPaper
            }}
        >
            <DialogTitle id="customized-dialog-title" onClose={handleClose} classes={classes}>
                {showInfo ? `${activeTool?.name}` : 'Add Skill Set'}
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {activeTool?.id && !showInfo ? (
                    <div
                        item
                        xs={12}
                        className={clsx(
                            classes.compatibilityInfo,
                            isCompatible ? classes.compatible : classes.incompatible
                        )}
                    >
                        {isCompatible ? (
                            <Typography variant="body1" align="center">
                                <InfoOutlinedIcon /> You are viewing the skill set supported by the
                                selected orchestrator type <b>{orchestrator?.name}</b>.
                            </Typography>
                        ) : (
                            <Typography variant="body1" align="center">
                                <WarningIcon /> This skill set is not supported by{' '}
                                <span>{orchestrator?.name}</span>. You will not be able to add this
                                skill set.
                            </Typography>
                        )}
                    </div>
                ) : null}
                <Grid container style={{ flex: 1, overflow: 'hidden' }}>
                    {!showInfo ? (
                        <Fragment>
                            <Grid
                                item
                                xs={4}
                                className={classes.skillSetListGrid}
                                direction={!showToolVersions ? 'column' : 'row'}
                                style={showToolVersions ? { paddingTop: 0 } : {}}
                            >
                                {!showToolVersions ? (
                                    <Fragment>
                                        <Typography
                                            variant="h3"
                                            className={clsx(
                                                configClasses.fontStyle3,
                                                classes.listHeader
                                            )}
                                        >
                                            List of available skill set
                                        </Typography>
                                        <div className={classes.toolListAction}>
                                            <SearchBar
                                                placeholder={'Search Here!'}
                                                onChangeWithDebounce={handleSkillsetSearch}
                                                value={search}
                                            />
                                            <IconButton
                                                aria-label="filter"
                                                className={classes.toolFilterBtn}
                                                onClick={handleFilterClick}
                                            >
                                                <FilterListIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleFilterClose}
                                                classes={{
                                                    list: configClasses.inputDropdownSelect
                                                }}
                                            >
                                                {toolRegistryList?.map((registry) => (
                                                    <MenuItem
                                                        key={registry.id}
                                                        onClick={() =>
                                                            handleRegistryClick(registry)
                                                        }
                                                        classes={{
                                                            root:
                                                                registry.id === activeRegistryId &&
                                                                classes.selectedMenuItem
                                                        }}
                                                    >
                                                        {registry.name}
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </div>
                                        <List className={classes.toolList}>
                                            {baseToolList
                                                .filter((el) =>
                                                    el.name
                                                        ?.toLowerCase()
                                                        .includes(search?.toLowerCase())
                                                )
                                                .map((tool) => (
                                                    <ListItem
                                                        key={tool.id}
                                                        className={clsx(
                                                            classes.toolListItem,
                                                            selectedBaseTool?.id === tool.id
                                                                ? classes.selectedToolListItem
                                                                : '',
                                                            tool.hasCompatibleToolVersion
                                                                ? ''
                                                                : classes.toolListItemInactive
                                                        )}
                                                        onClick={() => handleBaseToolSelect(tool)}
                                                    >
                                                        <ListItemText
                                                            primaryTypographyProps={{
                                                                variant: 'h4'
                                                            }}
                                                            primary={tool.name}
                                                            classes={{
                                                                primary: configClasses.listItemText
                                                            }}
                                                        />
                                                        {tool?.hasVerifiedToolVersion && (
                                                            <ListItemIcon>
                                                                <VerifiedUserIcon
                                                                    fontSize="large"
                                                                    className={
                                                                        classes.toolVersionVerifyIcon
                                                                    }
                                                                />
                                                            </ListItemIcon>
                                                        )}
                                                    </ListItem>
                                                ))}
                                        </List>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <IconButton
                                            className={classes.backButton}
                                            onClick={() => setShowToolVersions(false)}
                                        >
                                            <KeyboardArrowRightIcon fontSize="large" />
                                        </IconButton>
                                        <Timeline className={classes.toolVersionTimeline}>
                                            {toolVersionList?.map((item, index) => (
                                                <TimelineItem
                                                    key={item.id}
                                                    className={clsx(
                                                        activeTool?.id === item.id
                                                            ? classes.activeToolVersionItem
                                                            : '',
                                                        item?.orchestrators?.includes(
                                                            orchestrator?.id
                                                        )
                                                            ? ''
                                                            : classes.toolListItemInactive
                                                    )}
                                                >
                                                    <TimelineSeparator>
                                                        <TimelineDot />
                                                        {index + 1 !== toolVersionList.length ? (
                                                            <TimelineConnector />
                                                        ) : null}
                                                    </TimelineSeparator>
                                                    <TimelineContent
                                                        onClick={() =>
                                                            handleToolVersionSelect(item)
                                                        }
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className={
                                                                classes.toolVersionItemHeader
                                                            }
                                                        >
                                                            Version {item?.version}{' '}
                                                            {item?.verified && (
                                                                <VerifiedUserIcon
                                                                    fontSize="large"
                                                                    className={
                                                                        classes.toolVersionVerifyIcon
                                                                    }
                                                                />
                                                            )}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            className={classes.toolVersionItemDate}
                                                        >
                                                            {getToolVersionDate(item)}
                                                        </Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                            ))}
                                        </Timeline>
                                    </Fragment>
                                )}
                            </Grid>
                            <Grid item xs={8} className={classes.skillSetDetailGrid}>
                                {selectedBaseTool !== null && activeTool !== null ? (
                                    <Fragment>
                                        <div className={classes.toolDetails}>
                                            <div className={classes.toolInfoSection}>
                                                <div>
                                                    <Typography
                                                        variant="h3"
                                                        className={classes.toolTitle}
                                                    >
                                                        {selectedBaseTool?.name} Details
                                                    </Typography>
                                                    <Typography
                                                        variant="h3"
                                                        className={classes.toolVersionInfo}
                                                    >
                                                        Version {activeTool?.version} |{' '}
                                                        {getToolVersionDate()}
                                                    </Typography>
                                                    <a
                                                        onClick={handleOpenToolVersionList}
                                                        className={classes.toolVersionListButton}
                                                    >
                                                        {!showToolVersions
                                                            ? 'Click to check more versions'
                                                            : 'Hide other versions'}
                                                    </a>
                                                </div>
                                                <div>
                                                    {activeTool?.verified && (
                                                        <Typography
                                                            variant="h4"
                                                            className={
                                                                classes.toolVersionVerifyLabel
                                                            }
                                                        >
                                                            <VerifiedUserIcon
                                                                fontSize="large"
                                                                className={
                                                                    classes.toolVersionVerifyIcon
                                                                }
                                                            />{' '}
                                                            Verified By NucliOS
                                                        </Typography>
                                                    )}
                                                </div>
                                            </div>

                                            <Divider />

                                            {activeTool?.tool_version_config?.tags?.length ? (
                                                <Fragment>
                                                    <Typography
                                                        variant="h4"
                                                        className={classes.sectionTitle}
                                                    >
                                                        Tags
                                                    </Typography>
                                                    <div
                                                        className={clsx(
                                                            classes.tagChips,
                                                            configClasses.chips
                                                        )}
                                                    >
                                                        {activeTool?.tool_version_config?.tags?.map(
                                                            (tag) => {
                                                                return (
                                                                    <Chip key={tag} label={tag} />
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </Fragment>
                                            ) : null}
                                            {isLoading ? (
                                                <CodxCircularLoader center />
                                            ) : (
                                                <MarkdownRenderer
                                                    markdownContent={activeToolDocument}
                                                    classes={classes}
                                                />
                                            )}
                                        </div>
                                        <div className={classes.actionPanel}>
                                            <Button
                                                variant="outlined"
                                                onClick={handleClose}
                                                className={configClasses.button}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={handleAddSkill}
                                                className={configClasses.button}
                                                disabled={!isCompatible}
                                            >
                                                Add Skill Set
                                            </Button>
                                        </div>
                                    </Fragment>
                                ) : (
                                    <div className={classes.noActiveToolDetail}>
                                        <Typography variant="h3">
                                            Please select a skill from list of available skill set
                                        </Typography>
                                    </div>
                                )}
                            </Grid>
                            {isLoadingPublishedTools && (
                                <div className={classes.toolListloaderWarpper}>
                                    <CodxCircularLoader center />
                                </div>
                            )}
                        </Fragment>
                    ) : null}
                    {showInfo ? (
                        <Grid item xs={12} className={classes.skillSetDetailGrid}>
                            <div className={classes.toolDetails}>
                                {activeTool?.tool_version_config?.tags?.length ? (
                                    <Fragment>
                                        <Typography variant="h4" className={classes.sectionTitle}>
                                            Tags
                                        </Typography>
                                        <div
                                            className={clsx(classes.tagChips, configClasses.chips)}
                                        >
                                            {activeTool?.tool_version_config?.tags?.map((tag) => {
                                                return <Chip key={tag} label={tag} />;
                                            })}
                                        </div>
                                    </Fragment>
                                ) : null}
                                {isLoading ? (
                                    <CodxCircularLoader center />
                                ) : (
                                    <MarkdownRenderer
                                        markdownContent={activeToolDocument}
                                        classes={classes}
                                    />
                                )}
                            </div>
                        </Grid>
                    ) : null}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
