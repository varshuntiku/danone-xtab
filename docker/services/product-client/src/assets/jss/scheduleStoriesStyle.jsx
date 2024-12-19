const scheduleStoriesStyle = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        }
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    dialogPaper: {
        minHeight: '70vh',
        minWidth: '50%'
    },
    title: {
        fontSize: theme.spacing(3.5),
        letterSpacing: '1.5px',
        color: theme.palette.text.titleText,
        opacity: '0.8'
    },
    button: {
        borderRadius: theme.spacing(1.875),
        fontSize: theme.spacing(2.5),
        lineHeight: theme.spacing(2),
        textTransform: 'none',
        fontWeight: '500'
    },
    summary: {
        fontSize: theme.spacing(2.5),
        letterSpacing: '1.5px',
        opacity: '0.75',
        color: theme.palette.text.titleText,
        padding: theme.spacing(1.2)
    },

    heading: {
        width: theme.spacing(23.75),
        textAlign: 'right',
        paddingTop: '1rem'
    },
    dateHeading: {
        width: theme.spacing(23.75),
        textAlign: 'right',
        paddingTop: '3rem'
    },
    errors: {
        fontSize: '1.8rem',
        color: 'red',
        paddingTop: '5px',
        paddingLeft: '5px'
    },
    daysErrors: {
        fontSize: '1.8rem',
        color: 'red',
        paddingLeft: '22rem'
    },
    clause: {
        display: 'flex',
        // alignItems: 'center',
        fontSize: theme.spacing(2.5),
        letterSpacing: '1.5px',
        color: theme.palette.text.titleText,
        opacity: '0.75',
        padding: theme.spacing(1.2),

        '& .MuiInputBase-root': {
            color: theme.palette.text.titleText,
            fontSize: '1.6rem'
        },
        '& label.Mui-focused': {
            color: theme.palette.text.titleText
        },
        '& .MuiFormLabel-root': {
            color: theme.palette.text.titleText
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.text.titleText
            },
            '&:hover fieldset': {
                borderColor: theme.palette.text.titleText
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.text.titleText
            }
        }
    },

    scheduleInfo: {
        width: '90%',
        display: 'block',
        paddingLeft: '22.5rem',
        fontSize: theme.spacing(2.5),
        letterSpacing: '1.5px',
        color: theme.palette.text.titleText,
        opacity: '0.75'
    },

    occurance: {
        '& .MuiInputBase-root': {
            width: 70
            // marginLeft: 15,
        },
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        }
    },

    frequency: {
        flex: 1,
        maxWidth: '300px',
        marginLeft: 15,

        '& .MuiFormLabel-root': {
            fontSize: '1.8rem'
        },
        '& legend': {
            fontSize: '1.4rem'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '25px',
            color: theme.palette.text.titleText
        }
    },

    startDate: {
        width: 150,
        marginLeft: 15
    },

    endDate: {
        width: 150,
        marginLeft: 15
    },

    formControl: {
        marginLeft: 15,
        minWidth: 200,
        '& .MuiFormLabel-root': {
            fontSize: '1.8rem'
        },
        '& legend': {
            fontSize: '1.4rem'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '25px',
            color: theme.palette.text.titleText
        }
    },

    storyCheckbox: {
        transform: 'scale(1.5)'
    },
    pd10: {
        padding: '10px'
    },
    weekList: {
        display: 'flex',
        paddingLeft: '19rem',
        margin: 'unset'
    },
    days: {
        display: 'flex',
        padding: '8px',
        justifyContent: 'center',
        margin: '5px',
        width: '32px',
        cursor: 'pointer'
    },
    active: {
        backgroundColor: 'rgb(5 162 140 / 20%)',
        borderRadius: '20px'
    }
});

export default scheduleStoriesStyle;
