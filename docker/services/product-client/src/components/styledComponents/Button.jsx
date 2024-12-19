import React from 'react';
import { Button, createTheme, ThemeProvider } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';

function Button1({ ...props }) {
    const t = useTheme();
    const theme = createTheme({
        palette: {
            primary: { 500: t.palette.primary.contrastText }
        }
    });
    return (
        <ThemeProvider theme={theme}>
            <Button color="primary" {...props} />
        </ThemeProvider>
    );
}

export default Button1;
