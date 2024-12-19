const appWidgetPowerBIStyle = (theme) => ({
    reportContainer: {
        height: '100% !important',
        width: '100% !important',
        display: 'flex',
        justifyContent: 'center',
        paddingRight: '10px',
        boxSizing: 'inherit !important',
        position: 'relative !important',
        '& > iframe': {
            borderWidth: '0',
            overflow: 'auto',
            height: '100% !important',
            width: '100% !important',
            top: '0 !important',
            position: 'relative !important',
            left: '0 !important',

            transform: 'scale(1) !important',
            '&::-webkit-scrollbar': {
                width: '0.5rem',
                height: '0.5rem'
            }
        }
    },

    // This part targets the iframe by its ID, not inside the class nesting

    reportHiddenContainer: {
        display: 'none'
    }
});

export default appWidgetPowerBIStyle;
