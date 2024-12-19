import React from 'react';
import {
    TextField,
    Box,
    Typography,
    Collapse,
    IconButton,
    InputAdornment,
    makeStyles
} from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    instructionContainer: {
        width: '100%',
        padding: 2,
        border: `1px solid ${theme.palette.text.default}80`,
        borderRadius: 2,
        margin: 0,
        marginBottom: '1rem',
        fontSize: '4rem',
        position: 'relative'
    },
    fontClassAdv: {
        fontSize: '2rem',
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        marginLeft: '2rem',
        width: '90%',
        '& span.MuiTypography-body1': {
            fontSize: '1.5rem',
            color: theme.palette.text.default,
            marginLeft: '0rem'
        }
    },
    unitClass: {
        '& .MuiTypography-body1': {
            fontSize: '1.5rem',
            fontFamily: theme.title.h1.fontFamily,
            color: theme.palette.text.default
        }
    },
    fontClass: {
        fontSize: '2rem',
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        marginLeft: '2rem',
        width: '90%',
        '& span.MuiTypography-body1': {
            fontSize: '1.5rem',
            color: theme.palette.text.default,
            marginLeft: '0rem'
        },
        '& p.MuiTypography-body2': {
            fontSize: '1.5rem',
            color: theme.palette.text.default,
            marginLeft: '0rem'
        },
        '& .MuiInputLabel-outlined': {
            fontSize: '2rem',
            color: theme.palette.text.default,
            marginLeft: '0rem'
        },
        '& .MuiOutlinedInput-input': {
            fontSize: '1.5rem',
            color: theme.palette.text.default,
            marginLeft: '0rem',
            lineHeight: '1.75rem'
        },
        marginTop: '2rem'
    },
    starIcon: {
        height: '2rem',
        width: '2rem !important',
        color: 'gold',
        '& .MuiListItemIcon-root': {
            minWidth: '20px'
        }
    },
    collapseContainer: {
        position: 'absolute',
        bottom: '110%',
        left: '0%',
        zIndex: 100,
        width: '100%',
        background: theme.palette.background.modelBackground,
        padding: '1rem'
    },
    textField: {
        marginTop: '2rem'
    },
    expandIcon: {
        transform: 'rotate(180deg)'
    }
}));
const AdvancedSettings = (props) => {
    const [expanded, setExpanded] = React.useState(false);
    const classes = useStyles();
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleInputChange = (e, type) => {
        e.preventDefault();
        switch (type) {
            case 'gs':
                props.setGs(e.target.value);
                break;
            case 'steps':
                props.setSteps(e.target.value);
                break;
            case 'ccs':
                props.setCcs(e.target.value);
                break;
            case 'negativePrompt':
                props.setNegativePrompt(e.target.value);
                break;
            default:
                break;
        }
    };
    return (
        <Box className={classes.instructionContainer}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography className={classes.fontClassAdv}>Advanced Settings</Typography>
                <IconButton
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMore className={!expanded && classes.expandIcon} />
                </IconButton>
            </Box>
            <Collapse
                className={classes.collapseContainer}
                in={expanded}
                timeout="auto"
                unmountOnExit
            >
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Negative Prompt"
                    label="Negative Prompt"
                    defaultValue="blurry, bad anatomy, bad hands, three hands, three legs, bad arms, missing legs, missing arms, poorly drawn face, bad face, fused face, cloned face, worst face, three crus, extra crus, fused crus, worst feet, three feet, fused feet, fused thigh, three thigh, fused thigh, extra thigh, worst thigh, missing fingers, extra fingers, ugly fingers, long fingers, horn, extra eyes, huge eyes, 2girl, amputation, disconnected limbs, cartoon, cg, 3d, unreal, animate."
                    className={classes.fontClass}
                    onChange={(e) => handleInputChange(e, 'negativePrompt')}
                />
                <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    label="guidance scale"
                    defaultValue={10}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment className={classes.unitClass} position="end">
                                units
                            </InputAdornment>
                        )
                    }}
                    className={classes.fontClass}
                    onChange={(e) => handleInputChange(e, 'gs')}
                />
                <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    label="steps"
                    defaultValue={30}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment className={classes.unitClass} position="end">
                                units
                            </InputAdornment>
                        )
                    }}
                    className={classes.fontClass}
                    onChange={(e) => handleInputChange(e, 'steps')}
                />
                <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    label="controlnet conditioning scale"
                    defaultValue={0.5}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment className={classes.unitClass} position="end">
                                units
                            </InputAdornment>
                        )
                    }}
                    className={classes.fontClass}
                    onChange={(e) => handleInputChange(e, 'ccs')}
                />
            </Collapse>
        </Box>
    );
};

export default AdvancedSettings;
