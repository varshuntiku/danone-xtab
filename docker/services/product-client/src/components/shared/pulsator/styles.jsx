const pulsatorBackgroundStyles = (theme) => ({
    container: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        overflow: 'hidden'
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(var(--grid-x), 1fr)',
        gridTemplateRows: 'repeat(var(--grid-y), 1fr)',
        boxSizing: 'border-box',
        padding: theme.spacing(2)
    },
    '@keyframes glow': {
        '0%': {
            boxShadow: '0 0 0px var(--dot-color)',
            width: '5px',
            height: '5px'
        },
        '25%': {
            boxShadow:
                '0 0 5px 10px var(--dot-color), 0 0 10px 15px var(--dot-color), 0 0 15px var(--dot-color), 0 0 20px 10px var(--dot-color), 0 0 25px 12px var(--dot-color), 0 0 30px 15px var(--dot-color)',
            width: '10px',
            height: '10px'
        },
        '100%': {
            boxShadow: '0 0 0px var(--dot-color)',
            width: '5px',
            height: '5px'
        }
    },
    '@keyframes nextGlow': {
        '0%': { boxShadow: '0px 0px 0px 0px var(--dot-color)' },
        '50%': { boxShadow: '0px 0px 5px 5px var(--dot-color)' },
        '100%': { boxShadow: '0px 0px 0px 0px var(--dot-color)' }
    },
    '@keyframes beamHorizontalLeft': {
        '0%': { left: '-5vw', opacity: 0 },
        '50%': { opacity: 1 },
        '100%': { left: 'var(--left)', opacity: 0 }
    },
    '@keyframes beamHorizontalRight': {
        '0%': { left: '0px', opacity: 0 },
        '50%': { opacity: 1 },
        '100%': { left: 'var(--right)', opacity: 0 }
    },
    '@keyframes beamVerticalUp': {
        '0%': { top: '-5vw', opacity: 0 },
        '50%': { opacity: 1 },
        '100%': { top: 'var(--up)', opacity: 0 }
    },
    '@keyframes beamVerticalDown': {
        '0%': { top: '0px', opacity: 0 },
        '50%': { opacity: 1 },
        '100%': { top: 'var(--down)', opacity: 0 }
    },
    dots: {
        display: 'flex',
        width: '5px',
        height: '5px',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--color)',
        borderRadius: '10px',
        margin: 'auto',
        position: 'relative',
        transition: 'var(--animation-duration)'
    },
    noDot: {
        width: '0px',
        height: '0px'
    },
    next: {
        width: '5px',
        height: '5px',
        backgroundColor: 'var(--dot-color)',
        boxShadow: '0px 0px 2px 2px var(--dot-color)',
        animation: 'var(--animation-duration) $nextGlow'
    },
    beam: {
        position: 'absolute',
        width: '0',
        height: '0',
        borderRadius: '50%'
    },
    beamVerticalUp: {
        display: 'none'
    },
    beamVerticalDown: {
        display: 'none'
    },
    beamHorizontalLeft: {
        display: 'none'
    },
    beamHorizontalRight: {
        display: 'none'
    },
    glow: {
        animation: 'var(--animation-duration) $glow',
        backgroundColor: 'var(--dot-color)',
        '& $beamVerticalUp': {
            display: 'block',
            width: '4px',
            height: '5vw',
            borderRadius: '50%',
            boxShadow: '0px 0px 5px 2px var(--dot-color)',
            background: 'var(--dot-color)',
            animation: 'var(--animation-duration) $beamVerticalUp ease-out forwards'
        },
        '& $beamVerticalDown': {
            display: 'block',
            width: '4px',
            height: '5vw',
            borderRadius: '50%',
            boxShadow: '0px 0px 5px 2px var(--dot-color)',
            background: 'var(--dot-color)',
            animation: 'var(--animation-duration) $beamVerticalDown ease-out forwards'
        },
        '& $beamHorizontalLeft': {
            display: 'block',
            width: '5vw',
            height: '4px',
            borderRadius: '50%',
            boxShadow: '0px 0px 5px 2px var(--dot-color)',
            background: 'var(--dot-color)',
            animation: 'var(--animation-duration) $beamHorizontalLeft ease-out forwards'
        },
        '& $beamHorizontalRight': {
            display: 'block',
            width: '5vw',
            height: '4px',
            borderRadius: '50%',
            boxShadow: '0px 0px 5px 2px var(--dot-color)',
            background: 'var(--dot-color)',
            animation: 'var(--animation-duration) $beamHorizontalRight ease-out forwards'
        }
    }
});

export default pulsatorBackgroundStyles;
