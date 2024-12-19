const userLoginStyles = (theme) => ({
    container: {
        position: 'relative',
        padding: theme.spacing(5) + ' ' + theme.spacing(10),
        width: '100%',
        border: 'solid 1px #979797',
        borderRadius: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(7),
        justifyContent: 'center',
        '& svg': {
            fill: theme.palette.primary.contrastText,
            height: theme.spacing(4),
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            [theme.breakpoints.down(768)]: {
                width: '15rem',
                alignSelf: 'center'
            }
        },
        '& img': {
            height: '40px',
            width: '135px',
            alignSelf: 'center'
        },
        '& .MuiButton-root': {
            width: theme.spacing(20),
            alignSelf: 'center',
            textTransform: 'capitalize',
            '& .MuiButton-label': {
                fontSize: theme.spacing(2),
                [theme.breakpoints.down('sm')]: {
                    fontSize: '1.8rem'
                },
                [theme.breakpoints.down('xs')]: {
                    fontSize: '2.2rem'
                }
            }
        },
        [theme.breakpoints.down('sm')]: {
            padding: '3rem 5rem'
        }
    },
    seperator: {
        color: '#999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing(1),
        '&::before': {
            content: '""',
            flex: '1',
            borderBottom: '1px solid'
        },
        '&::after': {
            content: '""',
            flex: '1',
            borderBottom: '1px solid'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.8rem'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '2.2rem'
        }
    }
});

export default userLoginStyles;
