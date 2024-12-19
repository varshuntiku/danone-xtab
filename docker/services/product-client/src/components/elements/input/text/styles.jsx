import { alpha } from '@material-ui/core';

const textInputStyles = (theme) => ({
    textField: {
        width: '100%',
        '& label, & label.Mui-focused': {
            color: theme.palette.text.default,
            fontSize: '1.7rem'
        }
    },
    underline: {
        '&:before': {
            borderBottom: `1px solid ${alpha(theme.palette.primary.contrastText, 0.4)}`
        },
        '&:after': {
            borderBottom: `2px solid ${theme.palette.primary.contrastText}`
        }
    },
    input: {
        fontSize: '1.7rem',
        color: theme.palette.text.default
    }
});

export default textInputStyles;
