const connSysRedesignModelComponentStyle = (theme) => ({
    dailogContent: {
        overflow: 'hidden',
        padding: '1rem',
        margin: '1rem',
        '&::-webkit-scrollbar': {
            width: '7px',
            height: '2rem'
        },
        '&::-webkit-scrollbar-button': {
            width: '7px',
            height: '8rem'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            height: '2rem'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#7F8CC9',
            borderRadius: '4px',
            height: '2rem'
        }
    },
    dialogCloseIcon: {
        position: 'absolute',
        top: '0',
        right: '0',
        '& svg': {
            color: theme.palette.text.default
        }
    },
    dialogTitle: {
        padding: '8px 32px'
    },
    dialogWrapper: {
        '& .MuiDialog-paper': {
            overflowY: 'hidden'
        }
    }
});

export default connSysRedesignModelComponentStyle;
