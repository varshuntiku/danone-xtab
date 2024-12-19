import { alpha } from '@material-ui/core';

const connectedSystemStakeholderStyle = (theme) => ({
    root: {
        // maxWidth: '100rem'
    },
    paper: {
        maxWidth: 'var(--widthParam)',
        '--widthParam': 'calc(var(--cellWidth) / 4)',
        width: 'calc(var(--cellWidth) - var(--widthParam))',
        display: 'flex',
        marginBottom: '.7rem',
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.default,
        border: '0.2px solid #02E0FE40',
        alignItems: 'center',
        background: 'linear-gradient(123deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)',
        borderRadius: '2px',
        boxShadow: '0px 10px 12px 0px rgba(9, 31, 58, 0.05)',
        backdropFilter: 'blur(10px)'
    },
    avatar: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    smallAvatar: {
        width: '4rem',
        height: '3rem',
        paddingRight: '0.5rem',
        background: 'transparent',
        '& .MuiSvgIcon-root': {
            width: '3rem',
            height: '3rem'
        }
    },
    sectionHeader: {
        width: 'max-content',
        padding: '1rem',
        fontSize: '1.7rem',
        color: theme.palette.border.buttonOutline,
        textTransform: 'uppercase',
        fontWeight: 400
    },
    stakeholdersSection: {
        // width: theme.spacing(185),
        height: '17rem',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            width: '0.5rem',
            height: '0.5rem'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent !important'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.background.scrollbar,
            borderColor: theme.palette.background.scrollbar,
            borderRadius: '0.5rem'
        },
        paddingRight: '.8rem',
        boxShadow: ' -15px 0px 25px -15px rgba(9, 31, 58, 0.08)'
    },
    stakeholdersSectionPortrait: {
        height: '17rem',
        overflowX: 'hidden',
        overflowY: 'scroll',
        width: 'max-content',
        paddingRight: '1rem',
        '&::-webkit-scrollbar': {
            width: '0.5rem'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent !important'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.background.scrollbar,
            borderColor: theme.palette.background.scrollbar,
            borderRadius: '0.5rem'
        }
    },
    userDetail: {
        alignSelf: 'center',
        fontSize: '1.6rem',
        fontWeight: 100
    },
    userRole: {
        fontWeight: 500
    },
    stakeholderItem: {
        display: 'flex',
        '& .MuiTableCell-root:not(:last-child)': {
            marginRight: '2rem'
        },
        maxWidth: 'inherit'
    }
});

export default connectedSystemStakeholderStyle;
