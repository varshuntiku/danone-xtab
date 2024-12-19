import { Button, Grid, ThemeProvider, Typography, alpha, makeStyles } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import ThemePreviewScreen from './ThemePreviewScreen';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { CustomThemeContext } from 'themes/customThemeContext';
import clsx from 'clsx';
import CheckIcon from '@material-ui/icons/Check';
// import { Themes } from '../../themes/customThemeContext';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '-2rem',
        paddingRight: 0
    },
    themeSelectorContainer: {
        borderTop: `1px solid ${alpha(theme.palette.primary.light, 0.7)}`,
        flex: 1
    },
    themeListContainer: {
        width: '25rem',
        maxHeight: '58rem',
        overflowY: 'scroll'
    },
    themePreviewContainer: {
        borderLeft: `1px solid ${alpha(theme.palette.primary.light, 0.7)}`,
        padding: '1rem',
        paddingRight: '0'
    },
    themeOption: {
        color: theme.palette.text.default,
        borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.7)}`,
        fontSize: '1.4rem',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        paddingLeft: '2.5rem',
        cursor: 'pointer',
        '&:hover': {
            background: theme.palette.background.hover
        },
        '& svg': {
            color: theme.palette.primary.contrastText,
            fontSize: '2rem'
        }
    },
    themeIcon: {
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '2px',
        background: `var(--theme-color, ${theme.palette.primary.contrastText})`,
        display: 'inline-block'
    },
    title: {
        color: theme.palette.text.default,
        fontSize: '1.6rem',
        marginLeft: '1rem'
    },
    selectedTheme: {
        background: theme.palette.background.selected
    },
    previewWrapper: {
        aspectRatio: '16 / 10',
        overflow: 'hidden',
        borderRadius: '0.8rem',
        border: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
        boxShadow: `0px 0.5rem 1rem 0.5rem rgb(0 0 0 / 10%)`
    },
    iconColor: {
        fill: theme.palette.text.secondaryText
    }
}));

function ColorThemeSelector({ appliedThemeId, onNext, onApplyTheme }) {
    const classes = useStyles();
    const [selectedThemeId, setSelectedThemeId] = useState(appliedThemeId);
    const { theme, themeMode, Themes } = useContext(CustomThemeContext);

    const handleThemeClick = (id) => {
        setSelectedThemeId(id);
    };

    return (
        <div className={classes.root}>
            <Typography variant="h4" className={classes.title} gutterBottom>
                Choose a color theme
            </Typography>
            <Grid container className={classes.themeSelectorContainer}>
                <Grid item xs="auto" className={classes.themeListContainer}>
                    <Grid container wrap="wrap">
                        {Themes.map((el, index) => (
                            <Grid
                                key={'key' + index}
                                item
                                xs={12}
                                title={appliedThemeId === el.id ? 'current application theme' : ''}
                                onClick={handleThemeClick.bind(null, el.id)}
                                className={clsx(
                                    classes.themeOption,
                                    el.id === selectedThemeId && classes.selectedTheme
                                )}
                            >
                                <span
                                    className={classes.themeIcon}
                                    style={{
                                        '--theme-color': el.modes.find(
                                            (tm) => tm.mode === themeMode
                                        )?.contrast_color
                                    }}
                                />
                                <Typography variant="inherit">{el.name}</Typography>
                                <div style={{ flex: 1 }}></div>
                                {selectedThemeId === el.id ? <CheckIcon /> : null}
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs className={classes.themePreviewContainer}>
                    <Grid container spacing="2">
                        {(Themes.find((el) => el.id === selectedThemeId) || Themes[0]).modes.map(
                            (el, index) => (
                                <Grid item xs={6} key={`${el.mode}${index}`} title={el.mode}>
                                    <div className={classes.previewWrapper}>
                                        <DynamicThemeWrapper
                                            themeMode={el.mode}
                                            themeId={selectedThemeId}
                                            key={selectedThemeId + ' ' + theme.themeMode}
                                        >
                                            <ThemePreviewScreen />
                                        </DynamicThemeWrapper>
                                    </div>
                                </Grid>
                            )
                        )}
                    </Grid>
                    <div style={{ display: 'flex', gap: '1rem', padding: '2rem 0' }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={onApplyTheme.bind(null, selectedThemeId)}
                            aria-label="Apply theme"
                        >
                            Apply Theme
                        </Button>
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon className={classes.iconColor} />}
                            size="small"
                            onClick={onNext}
                            aria-label="Next"
                        >
                            Next
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

function DynamicThemeWrapper({ themeMode, themeId, children }) {
    const { getTheme, themeMode: mainThemeMode } = useContext(CustomThemeContext);
    const [{ theme, plotTheme }, setTheme] = useState(getTheme(themeMode, themeId));

    useEffect(() => {
        setTheme(getTheme(themeMode, themeId));
    }, [themeMode, themeId]);

    return (
        <CustomThemeContext.Provider value={{ plotTheme }}>
            <ThemeProvider theme={theme} key={themeMode + '-' + themeId + '-' + mainThemeMode}>
                {children}
            </ThemeProvider>
        </CustomThemeContext.Provider>
    );
}

export default React.memo(ColorThemeSelector);
