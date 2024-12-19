import { alpha, makeStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const minervaWizardStyle = makeStyles((theme) => ({
    inputLabel: {
        color: theme.palette.text.default,
        padding: theme.spacing(1),
        fontSize: '1.5rem'
    },
    inputRoot: {
        '& label.Mui-focused': {
            color: theme.palette.text.default
        },
        '& .MuiInput-underline:after': {
            borderBottom: `1px solid ${alpha(theme.palette.text.revamp, 0.4)}`
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: `${alpha(theme.palette.text.default, 0.7)} !important`
        },
        '& .MuiFilledInput-underline.Mui-focused:after': {
            borderBottomColor: theme.palette.border.inputOnFoucs,
            borderWidth: '1px'
        },
        '& .MuiInput:after': {
            borderBottomColor: 'transparent'
        },
        '& svg': {
            color: theme.palette.text.default
        },
        padding: theme.spacing(1),
        background: theme.palette.background.tableSelcted,
        borderRadius: theme.spacing(0.5),
        color: theme.palette.text.default,
        marginBottom: theme.spacing(2),
        '& .MuiFormHelperText-root': {
            color: theme.palette.error.dark,
            fontSize: '1.25rem',
            fontStyle: 'italic'
        }
    },
    input: {
        color: theme.palette.text.default + ' !important',
        fontSize: '1.5rem'
    },
    formControl: {
        marginTop: theme.spacing(1)
    },
    menu: {
        '& * .Mui-selected': {
            backgroundColor: theme.palette.primary.dark,
            margin: theme.spacing(2),
            border: '1px dashed ' + theme.palette.text.default
        }
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
    fontSize2: {
        fontSize: '1.4rem'
    },
    fontSize3: {
        fontSize: '1.2rem'
    },
    pale: {
        fontWeight: 100
    },
    iconContainer: {
        '& svg': {
            fontSize: '3rem',
            color: theme.palette.primary.main
        },
        '& .MuiStepIcon-text': {
            fontSize: '10px',
            fill: theme.palette.text.default
        },
        '& .MuiStepIcon-active': {
            color: theme.palette.primary.contrastText,
            '& .MuiStepIcon-text': {
                fill: theme.palette.primary.dark
            },

            '&:host': {
                position: 'absolute',
                content: '""',
                top: 0,
                left: 0,
                transform: 'scale(1.01)',
                background: 'red'
            }
        },
        '& .MuiStepIcon-completed': {
            color: theme.palette.primary.contrastText
        }
    },
    clickable: {
        cursor: 'pointer'
    },
    darkStroke: {
        stroke: theme.palette.primary.dark
    },
    tick: {
        color: theme.palette.primary.dark
    },
    header: {
        fontWeight: '600',
        opacity: '0.8'
    },
    stepperFormContainer: {
        padding: '5rem',
        background: theme.palette.background.hover,
        margin: '5rem 8rem 0rem',
        height: '100%',
        overflow: 'auto'
    },
    button: {
        margin: '0em 2em',
        width: '11em'
    },
    separator: {
        borderLeft: '1px solid',
        opacity: 0.2,
        borderColor: theme.palette.text.titleText
    },
    separator2: {
        height: '100%',
        borderRight: '1px solid ' + theme.palette.text.titleText + '32'
    },
    dropdownBackground: {
        background: theme.palette.background.paper
    },
    documentList: {
        maxHeight: '25rem',
        overflow: 'auto',
        '& .MuiTypography-root': {
            fontSize: '1.6rem',
            color: alpha(theme.palette.text.default, 0.7)
        },
        '& .MuiListItemText-secondary': {
            fontSize: '1.2rem',
            opacity: '0.7'
        },
        '& .MuiListItem-root:hover': {
            background: theme.palette.background.hover
        }
    },
    deletedDoc: {
        background: alpha(red[500], 0.2) + ' !important'
    }
}));

export default minervaWizardStyle;
