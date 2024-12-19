import { alpha } from '@material-ui/core';

const flowConfiguratorStyle = (theme) => ({
    pageWrapper: {
        overflow: 'hidden',
        height: '100%'
    },
    bodyWrapper: {
        // background: '#d9e0ec',
        width: '100%',
        padding: '0.5rem 2rem',
        height: '90%'
        // display: 'grid',
        // gridTemplateColumns: '1fr 2fr 1fr 1fr',
        // gridTemplateRows: 'auto',
        // gridTemplateAreas:
        //     '"tabsWrapper . . .""categoryFormWrapper categoryFormWrapper . buttonsWrapper""reactflowWrapper reactflowWrapper reactflowWrapper formsWrapper"',
        // columnGap: '1.5rem',
        // rowGap: '1.5rem'
    },
    footerWrapper: {
        '& div': {
            bottom: '5px'
        }
    },
    reactflowWrapper: {
        height: '100%',
        width: '100%',
        border: '1px solid #3277b3',
        borderRadius: '4px',
        background: theme.palette.text.white
        // gridArea: 'reactflowWrapper'
    },
    formsWrapper: {
        paddingRight: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        justifyContent: 'center',
        // gridArea: 'formsWrapper',
        // zIndex: '1000',
        '& input': {
            fontSize: '1.42rem'
        },
        '& textarea': {
            fontSize: '1.42rem'
        },
        '& label': {
            fontSize: '1.42rem',
            color: theme.palette.text.black
        },
        '& .MuiFormLabel-root.Mui-focused': {
            fontSize: '1.42rem',
            color: theme.palette.text.black
        }
    },
    nodesFormWrapper: {
        // background: theme.palette.text.white,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.8rem',
        padding: '1.5rem',
        borderRadius: '4px',
        '& input': {
            fontSize: '1.42rem'
        },
        '& textarea': {
            fontSize: '1.42rem'
        },
        '& label': {
            fontSize: '1.42rem',
            color: theme.palette.text.black
        },
        '& .MuiFormLabel-root.Mui-focused': {
            fontSize: '1.42rem',
            color: theme.palette.text.black
        }
    },
    nodesActionWrapper: {
        padding: '1.5rem'
    },
    inputCheckbox: {
        paddingLeft: theme.spacing(1),
        '& .MuiFormControlLabel-label': {
            color: theme.palette.text.revamp,
            fontSize: theme.layoutSpacing(15),
            fontFamily: theme.body.B1.fontFamily,
            letterSpacing: theme.layoutSpacing(0.35),
            marginLeft: theme.layoutSpacing(-8),
            '&.Mui-disabled': {
                color: alpha(theme.palette.text.default, 0.7)
            }
        },
        '& svg': {
            width: '2rem',
            height: '2rem'
        },
        '&[readOnly]': {
            pointerEvents: 'none'
        },
        '&.Mui-disabled': {
            '& svg': {
                opacity: 0.7
            }
        }
    },
    customInputCheckbox: {
        marginTop: theme.layoutSpacing(24)
    },
    categoryFormWrapper: {
        width: '100%',
        // gridArea: 'categoryFormWrapper',
        background: 'white',
        padding: '1rem',
        borderRadius: '4px'
    },
    categoryDropdownsWrapper: {
        display: 'flex',
        gap: '2rem'
    },
    tabsWrapper: {
        gridArea: 'tabsWrapper',
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: '2rem',
        borderBottom: '1px solid #3277b3',
        fontWeight: 500,
        width: 'auto'
    },
    tab: {
        padding: '0.8rem 2rem',
        cursor: 'pointer',
        '&:hover': {
            opacity: 0.5
        }
    },
    selectedTab: {
        borderBottom: '1px solid #4560D7',
        color: '#4560D7',
        background: '#4560D722'
    },
    subSectionsTabs: {
        minHeight: 'auto',
        '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.dark,
            height: '100%',
            zIndex: -1,
            borderRadius: theme.spacing(1, 1, 0, 0)
        },
        '& .MuiTab-root': {
            borderRadius: theme.spacing(1, 1, 0, 0),
            minHeight: '4.8rem',
            padding: theme.spacing(1, 2)
        },
        '& .Mui-selected': {
            color: `${theme.palette.primary.contrastText} !important`
        }
    },
    subSectionTabContent: {
        marginBottom: theme.spacing(7.5),
        minHeight: theme.spacing(40)
    },
    subFormHeading: {
        marginLeft: theme.spacing(2.5),
        marginTop: theme.spacing(0.5)
    },
    nodeFormToolbar: {
        position: 'fixed',
        left: theme.spacing(5),
        bottom: theme.spacing(2.5)
    },
    nodeFormToolbarButton: {
        marginRight: theme.spacing(1)
    },
    nodeSolutionsBody: {
        margin: theme.spacing(0.5, 2)
    },
    nodeSolutionsHeader: {
        backgroundColor: theme.palette.background.tableHeader,
        padding: theme.spacing(1)
    },
    nodeSolutionsHeaderItem: {
        paddingLeft: theme.spacing(2)
    },
    nodeSolutionsRow: {
        margin: theme.spacing(1, 0),
        paddingBottom: theme.spacing(1),
        borderBottom: '1px solid ' + theme.palette.border.grey
    },
    nodeWrapper: {
        display: 'flex',
        gap: '1rem'
    },
    buttonsWrapper: {
        width: '100%',
        textAlign: 'right',
        // gridArea: 'buttonsWrapper',
        justifySelf: 'end',
        paddingRight: '5rem',
        '& button': {
            marginLeft: '2rem'
        }
    },
    hideNode: {
        '& .react-flow__handle': {
            opacity: 0
        }
    },
    switchStyle: {
        '& label': {
            marginLeft: '0.1rem'
        }
    },
    node: {
        width: '100%',
        height: '100%',
        borderRadius: '5px',
        border: '1px solid #000',
        backgroundColor: '#fff',
        padding: '10px',
        boxSizing: 'border-box'
    },
    resizeControl: {
        width: '10px',
        height: '10px',
        borderRadius: '100%'
    },
    rotateHandle: {
        position: 'absolute',
        width: '10px',
        height: '10px',
        background: '#3367d9',
        left: '50%',
        top: '-30px',
        borderRadius: '100%',
        transform: 'translate(-50%, -50%)',
        cursor: 'alias',
        '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            width: '1px',
            height: '30px',
            background: '#3367d9',
            left: '4px',
            top: '5px'
        }
    }
});

export default flowConfiguratorStyle;
