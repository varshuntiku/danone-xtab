const mouseTrailerBackgroundStyles = (theme) => {
    const isDark = localStorage.getItem('codx-products-theme') === 'dark';
    const backgroundColor = isDark
        ? 'rgba(255, 255, 255, 0.15) 13.3%, rgba(255, 255, 255, 0.05) 86.55%)'
        : 'rgba(234, 237, 243, 0.9) 2.32%, rgba(234, 237, 243, 0.36) 100.61%)';
    return {
        container: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backdropFilter: 'blur(5px)',
            '--gradient-x': 0,
            '--gradient-y': 0,
            '&::before': {
                content: '""',
                background:
                    'radial-gradient(' +
                    theme.spacing(65) +
                    ' circle at var(--gradient-x) var(--gradient-y), ' +
                    backgroundColor,
                borderRadius: 'inherit',
                position: 'absolute',
                height: '100%',
                width: '100%',
                left: 0,
                top: 0
            }
        }
    };
};

export default mouseTrailerBackgroundStyles;
