import React from 'react';
import { makeStyles, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    toolBarText: {
        color: theme.palette.text.default,
        fontWeight: 500,
        fontSize: '1.5rem'
    }
}));
export default function CodxLegendsIcons({ elementProps, ...props }) {
    const { options, width, height, theme } = elementProps;
    const classes = useStyles(props);
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: elementProps?.margin
            }}
        >
            {options.map((el) => {
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: '1rem',
                            gridGap: '0.6rem'
                        }}
                        key={el.value}
                    >
                        <div
                            style={{
                                width: width,
                                height: height,
                                backgroundColor:
                                    theme && el?.themeColor ? el.themeColor[theme] : el.value
                            }}
                        ></div>
                        <Typography className={classes.toolBarText}>{el.label}</Typography>
                    </Box>
                );
            })}
        </Box>
    );
}
