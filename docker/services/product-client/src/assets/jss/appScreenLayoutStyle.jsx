import { alpha } from '@material-ui/core';

const appScreenLayoutStyle = (theme) => ({
    layoutContainer: {
        borderRadius: theme.spacing(0.5),
        padding: theme.spacing(1),
        cursor: 'pointer',
        width: theme.spacing(30),
        backgroundColor: theme.palette.background.pureWhite,
        border: `1px solid ${theme.palette.border.grey}`,
        '&[disabled]': {
            pointerEvents: 'none',
            opacity: 1,
            borderStyle: 'dashed',
            '& $selectedCard': {
                borderStyle: 'dashed'
            }
        }
    },
    layoutSelectable: {
        '&:hover': {
            opacity: 0.7
        }
    },
    widgetSelectable: {
        '& $labelCard,$card': {
            '&:hover': {
                opacity: 0.7
            }
        }
    },
    widthResponsive: {
        width: '100%'
    },
    layoutContainerSelected: {
        border: '2px solid ' + theme.palette.primary.contrastText,
        borderRadius: theme.spacing(0.5),
        padding: theme.spacing(1),
        float: 'left',
        cursor: 'pointer',
        '&:hover': {
            opacity: '0.7'
        },
        width: theme.spacing(30)
    },
    gridItem: {
        padding: theme.spacing(0, 0.5),
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderRight: 'none'
        }
    },
    card: {
        display: 'inline-block',
        position: 'relative',
        width: '100%',
        margin: '0',
        background: theme.palette.primary.dark,
        minHeight: theme.spacing(6),
        color: 'inherit',
        border: '2px solid transparent'
    },
    cardSelected: {
        border: `1px solid ${theme.palette.text.default} !important`
    },
    labelCard: {
        display: 'inline-block',
        position: 'relative',
        width: '100%',
        margin: '0',
        background: alpha(theme.palette.primary.contrastText, 0.3),
        minHeight: theme.spacing(4),
        color: 'inherit',
        padding: `0 ${theme.layoutSpacing(2)} ${theme.layoutSpacing(4)}`
    },
    bigCard: {
        minHeight: theme.spacing(12),
        height: '100%'
    },
    halfBigCard: {
        minHeight: theme.spacing(6),
        height: '100%'
    },
    fullCard: {
        minHeight: theme.spacing(18),
        height: '100%'
    },
    halfCard: {
        minHeight: theme.spacing(9),
        height: '100%'
    },
    unsavedIndicator: {
        color: theme.palette.text.unsavedText,
        position: 'absolute',
        right: 0
    },
    gridItemStyle: {
        borderRight: `5px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderRight: 'none'
        }
    },
    gridChildItem: {
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        gap: 0,
        '&:last-child': {
            borderBottom: 'none'
        },
        '&.MuiGrid-item': {
            padding: `${theme.layoutSpacing(2)} 0`,
            '&:last-child': {
                paddingBottom: `${theme.layoutSpacing(4)}`
            }
        },
        minHeight: 'var(--itemHeight)',
        maxHeight: 'var(--itemHeight)',
        display: 'flex'
    },
    gridChildContainer: {
        padding: 0,
        margin: 0,
        minHeight: 'auto'
    },
    gridChildContainerVertical: {
        padding: 0,
        margin: 0,
        minHeight: '100%'
    },
    bottomParentDiv: {
        padding: '5px 0px',
        borderTop: `1px solid ${theme.palette.separator.grey}`,
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    topParentDiv: {
        padding: '0px 3px',
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        borderLeft: `1px solid ${theme.palette.separator.grey}`
    },
    kpiContianers: {
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    gridVerticalParentItemStyle: {
        gap: 0,
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderRight: 'none'
        },
        padding: `0 ${theme.layoutSpacing(2)}`
    },
    verticalChild: {
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderBottom: `none`
        },
        height: 'var(--itemHeight)'
    },
    gridItemCustomOneStyle: {
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderBottom: 'none',
            borderRight: 'none'
        },
        '&:nth-last-child(4)': {
            borderRight: 'none'
        },
        '&:nth-last-child(2)': {
            borderBottom: 'none'
        },
        '&:nth-last-child(3)': {
            borderBottom: 'none'
        }
    },
    gridItemCustomTwoStyle: {
        border: 'none',
        '&.MuiGrid-item': {
            padding: 0
        },
        '& > div': {
            borderRadius: 0,
            borderRight: `1px solid ${theme.palette.separator.grey}`
        },
        '&:nth-child(2n) > div': {
            borderRight: 'none'
        },
        '&:first-child': {
            borderBottom: `1px solid ${theme.palette.separator.grey}`
        },
        '&:nth-child(2)': {
            borderBottom: `1px solid ${theme.palette.separator.grey}`
        }
    }
});

export default appScreenLayoutStyle;
