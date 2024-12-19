import {
    IconButton,
    Popover,
    Box,
    ThemeProvider,
    Typography,
    alpha,
    makeStyles,
    Tooltip
} from '@material-ui/core';
import React, { useContext, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { CustomThemeContext } from '../../themes/customThemeContext';
import clsx from 'clsx';
import themeGenerator, { BgVariantParams } from 'themes/themeGenerator/themeGenerator';
import ThemePreviewScreen from '../Admin/ThemePreviewScreen';
import { useDebouncedEffect } from 'hooks/useDebounceEffect';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { grey } from '@material-ui/core/colors';
import { ChromePicker } from 'react-color';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { ReactComponent as LockIcon } from '../../assets/img/themeLock.svg';
import CloseIcon from '../../assets/Icons/CloseBtn';
const useStyles = makeStyles((theme) => ({
    themeEditorRoot: () => ({
        // background: params.darkColor,
        height: '100%',
        display: 'grid',
        gridTemplateAreas: `
'c b'
'g p'
`,
        gridTemplateColumns: 'auto 1fr',
        gridTemplateRows: 'auto 1fr'
    }),
    ctaColorSelector: {
        gridArea: 'c',
        padding: '2rem 5rem'
    },
    backgroundSelectorRoot: {
        gridArea: 'b',
        padding: '2rem 5rem'
    },
    graphColorSelector: {
        gridArea: 'g',
        padding: '0rem 5rem'
    },
    preview: {
        gridArea: 'p',
        padding: '0 5rem'
    },
    title: {
        fontSize: '1.8rem',
        color: theme.palette.text.default,
        fontWeight: '400',
        marginBottom: '1.2rem'
    },
    colorPickerRoot: {
        background: 'var(--color)',
        width: '30rem',
        height: '5.6rem',
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1rem 1rem 2rem',
        position: 'relative',
        justifyContent: 'center',
        '& svg': {
            color: 'white'
            // mixBlendMode: 'difference'
        },
        '& $colorPickerText': {
            visibility: 'hidden'
        },
        '&:hover $colorPickerText': {
            visibility: 'visible'
        },
        '& $editButton': {
            visibility: 'hidden'
        },
        '& $lockButtonV1': {
            visibility: 'hidden'
        },
        '& $lockButtonV3': {
            visibility: 'hidden'
        },
        '&:hover $editButton': {
            visibility: 'visible'
        },
        '&:hover $lockButtonV1': {
            visibility: 'visible'
        },
        '&:hover $lockButtonV3': {
            visibility: 'visible'
        }
    },
    editButton: {
        margin: 0.8,
        padding: '0.6rem',
        borderRadius: '50%',
        '&:hover': {
            backgroundColor: alpha(theme.palette.background.hover, 0.2)
        }
    },
    lockButtonV1: {
        margin: 0.8,
        padding: '0.6rem',
        borderRadius: '50%',
        '&:hover': {
            backgroundColor: 'transparent',
            mixBlendMode: 'difference'
        }
    },
    lockButtonV3: {
        margin: 0.8,
        padding: '0.6rem',
        borderRadius: '50%',
        '&:hover': {
            backgroundColor: 'transparent',
            mixBlendMode: 'difference'
        },
        '& svg': {
            width: '1.6rem',
            height: '1.6rem'
        }
    },
    colorPickerRoot2: {
        height: '5.6rem',
        width: '9rem',
        padding: '0',
        '& svg': {
            mixBlendMode: 'difference'
        }
    },
    colorPickerDisbaled: {},
    colorPickersWrapper: {
        display: 'flex',
        flexDirection: 'column',
        // borderRadius: '0.5rem',
        overflow: 'hidden'
    },
    colorPickerText: {
        zIndex: '2',
        fontSize: '1.4rem',
        color: 'white !important',
        fontWeight: '400'
    },
    backgroundsList: {
        display: 'flex',
        gap: '6rem',
        flexWrap: 'wrap'
    },
    colorPickersWrapper2: {
        display: 'flex',
        // borderRadius: '0.5rem',
        overflow: 'hidden',
        '&>div:not(:first-child)': {
            borderLeft: `2px solid ${alpha(grey[400], 0.4)}`
        }
    },
    backgroundItemRoot: {
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer'
    },
    bgCheckIcon: {},
    backgroundWrapper: {
        border: `1px solid ${alpha(grey[400], 0.7)}`

        // borderRadius: '0.5rem',
    },
    bgName: {
        fontSize: '1.8rem',
        color: theme.palette.text.default,
        fontWeight: '400',
        margin: '0.5rem 0'
    },
    backgroundItemSelected: {
        '& $backgroundWrapper': {
            border: `1px solid ${alpha(grey[600], 0.7)}`
        },
        '& $bgName': {
            fontWeight: '500'
        }
    },
    previewWrapper: {
        // aspectRatio: '16 / 9',
        width: '96rem',
        height: '54rem',
        overflow: 'hidden',
        // borderRadius: '1rem',
        border: `1px solid ${theme.palette.border.loginGrid}`,
        boxShadow: `none`
    },
    readOnlyBG: {
        cursor: 'default'
    },
    chromePickerContainer: {
        position: 'fixed',
        zIndex: 99999
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
    },
    chromePickerRoot: {
        borderRadius: '0.4rem',
        overflow: 'hidden',
        position: 'relative',
        transform: 'translate(+25%, +60%)',
        background: 'white',
        border: `1px solid ${alpha(theme.palette.border.loginGrid, 0.16)} `
    },
    themeItems: {
        display: 'flex'
    },
    themeItem: {
        fontSize: '1.4rem',
        paddingTop: '1rem',
        lineHeight: '1.6rem',
        letterSpacing: '0.35%',
        width: '9rem',
        textAlign: 'center',
        color: theme.palette.text.default
    },
    iconContainer: {
        position: 'relative',
        width: theme.layoutSpacing(30),
        height: theme.layoutSpacing(30),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        marginLeft: '1rem',
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            cursor: 'pointer'
        }
    },
    assumptionsIcon: {
        cursor: 'pointer',
        zIndex: 2,
        height: '2rem !important',
        width: '2rem !important',
        '& svg': {
            fill: `${theme.palette.primary.contrastText} !important`
        }
    },
    infoContainer: {
        display: 'flex',
        // gap: '0.5rem',
        alignItems: 'center',
        justifyContent: 'start'
    },
    iconButton: {
        textTransform: 'none'
    },
    popOverContainer: {
        marginTop: '0.5rem'
    },
    popOver: {
        padding: '1.67rem',
        backgroundColor: theme.palette.background.modelBackground,
        maxWidth: theme.spacing(60)
    },
    popOverTitle: {
        display: 'flex',
        width: '100% !important',
        justifyContent: 'space-between',
        paddingBottom: '1.67rem',
        alignItems: 'center',
        position: 'relative',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    popOverTitleText: {
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontSize: '1.67rem',
        color: theme.palette.text.titleText
    },
    popOverContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
    },
    contentText: {
        color: theme.palette.text.default,
        maxHeight: theme.spacing(29),
        lineHeight: theme.layoutSpacing(24),
        fontSize: '1.67rem',
        overflow: 'hidden',
        overflowWrap: 'break-word',
        fontWeight: '400'
    },
    contentTextBlock: {
        flex: 1,
        lineHeight: theme.layoutSpacing(24),
        overflow: 'hidden',
        overflowWrap: 'break-word',
        fontWeight: '400'
    },

    contentTextBold: {
        fontSize: '1.67rem',
        lineHeight: theme.layoutSpacing(24),
        fontWeight: '500'
    },
    circleStyle: {
        width: '1rem', // Size of the circle
        height: '1rem',
        borderRadius: '50%', // Makes the div circular
        backgroundColor: 'black', // Circle color
        marginRight: '1rem', // Spacing between circle and text
        display: 'inlineBlock' // Allows the circle to sit inline with text
    },
    closeIcon: {
        fontSize: '0.5rem !important',
        position: 'absolute',
        // maxWidth: theme.spacing(3),
        right: 0,
        marginRight: `-${theme.spacing(1)}`,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`,
            padding: '2px'
        }
    },
    bullet: {
        marginTop: '1rem',
        marginRight: '1.6rem',
        borderRadius: '50%',
        width: '0.7rem',
        height: '0.7rem',
        backgroundColor: theme.palette.text.contrastText
    },
    gridPointContainer: {
        display: 'flex',
        alignItems: 'start'
    },
    toolTipText: {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: '1.3rem',
        lineHeight: '1.5rem',
        color: '#FFFFFF'
    },
    toolTip: {
        background: theme.palette.background.tooltipBackground
    }
}));

function CircularBullet() {
    const classes = useStyles();

    return <Box className={classes.bullet} />;
}

export default function ThemeEditor({ themeData, mode, readOnly, defaultObject, onChange }) {
    const [anchorEl, setAnchor] = useState(null);
    const [popOver, setPopOver] = useState(false);
    const themeModeData = themeData?.modes?.find((el) => el.mode === mode) || {};
    let { bg_variant, contrast_color, chart_colors, params } = themeModeData;
    const custom_params = { ...BgVariantParams['custom']?.[mode], ...params };
    params =
        bg_variant === 'custom'
            ? custom_params
            : { ...params, ...BgVariantParams[bg_variant]?.[mode] };

    const classes = useStyles(params);
    const handleCTAChange = (v) => {
        themeModeData.contrast_color = v;
        onChange(themeData);
    };

    const handleChartColorChange = (i, v) => {
        chart_colors[i] = v;
        themeModeData.chart_colors = [...chart_colors];
        onChange(themeData);
    };

    const handleBackgroundSelect = (variant) => {
        themeModeData.bg_variant = variant;
        onChange(themeData);
    };

    const handleBgColorChange = (data) => {
        themeModeData.params = {
            ...params,
            ...data
        };
        onChange(themeData);
    };

    // const onChangeTextColor = (color) => {
    //     themeModeData.params = {
    //         ...params,
    //         ...{
    //             textColor: color
    //         }
    //     };
    //     onChange(themeData);
    // };
    const onClickInfo = (event) => {
        setPopOver(true);
        setAnchor(event.currentTarget);
    };

    const onCloseInfo = () => {
        setPopOver(false);
        setAnchor(null);
    };

    return (
        <div className={classes.themeEditorRoot}>
            <div aira-label="cta color selectors" className={classes.ctaColorSelector}>
                <div className={classes.infoContainer}>
                    <Typography variant="subtitle1" className={classes.title} gutterBottom>
                        Primary Color
                    </Typography>
                    <div className={classes.iconContainer}>
                        <IconButton
                            className={classes.iconButton}
                            size="small"
                            aria-label={'Label'}
                            onClick={onClickInfo}
                        >
                            <InfoOutlinedIcon
                                fontSize="small"
                                className={clsx(classes.assumptionsIcon)}
                            />
                        </IconButton>
                        {popOver && anchorEl && (
                            <PopOver
                                popOver={true}
                                anchorEl={anchorEl}
                                onClose={onCloseInfo}
                                classes={classes}
                                title="Primary Color"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                }}
                            >
                                <span>
                                    Primary color represents the brand color and is used for key
                                    elements like action buttons, selected tab, active side nav
                                    state & primary icons, ensuring it&apos;s easy to see and read
                                    against the background.
                                </span>
                            </PopOver>
                        )}
                    </div>
                </div>

                <div className={classes.colorPickersWrapper}>
                    <ColorPicker
                        disabled={readOnly}
                        classes={classes}
                        color={contrast_color}
                        onChange={handleCTAChange}
                    />
                </div>
            </div>
            <div aira-label="graph colors selectors" className={classes.graphColorSelector}>
                <Typography variant="subtitle1" className={classes.title} gutterBottom>
                    Graph Colors
                </Typography>
                <div className={classes.colorPickersWrapper}>
                    {chart_colors?.map((el, i) => (
                        <ColorPicker
                            disabled={readOnly}
                            key={i}
                            classes={classes}
                            color={el}
                            onChange={handleChartColorChange.bind(null, i)}
                        />
                    ))}
                </div>
            </div>

            <div aria-label="background selector" className={classes.backgroundSelectorRoot}>
                <div className={classes.backgroundsList}>
                    {/* render it  if it's not a readonly theme, render it if it's a default object */}
                    {(!readOnly || defaultObject) && (
                        <div>
                            <BackgroundColorItem
                                readOnly={readOnly}
                                selected={bg_variant == 'v3'}
                                gridColor={BgVariantParams['v3'][mode].gridColor}
                                darkColor={BgVariantParams['v3'][mode].darkColor}
                                textColor={BgVariantParams['v3'][mode].textColor}
                                secondaryColor={BgVariantParams['v3'][mode].secondaryColor}
                                label="NucliOS Default"
                                updateColorDisabled
                                classes={classes}
                                onSelect={readOnly ? null : handleBackgroundSelect.bind(null, 'v3')}
                            />
                        </div>
                    )}
                    {/*render it if it's an user defined theme(cloned), meaning->  render it  if it's not readOnly and  not the defaultObject(not the Nuclios default theme)/}*/}
                    {(!readOnly || (readOnly && !defaultObject)) && (
                        <BackgroundColorItem
                            readOnly={readOnly}
                            selected={bg_variant == 'custom'}
                            gridColor={custom_params?.gridColor}
                            darkColor={custom_params?.darkColor}
                            textColor={custom_params?.textColor}
                            secondaryColor={custom_params?.secondaryColor}
                            label="Custom"
                            updateColorDisabled={readOnly}
                            classes={classes}
                            onSelect={readOnly ? null : handleBackgroundSelect.bind(null, 'custom')}
                            onColorChange={handleBgColorChange}
                        />
                    )}
                    {/* {bg_variant === 'custom' ? (
                        <div
                            className={clsx(
                                classes.backgroundItemRoot,
                                bg_variant !== 'custom' && classes.backgroundItemSelected
                            )}
                            style={{ marginLeft: '-4rem' }}
                        >
                            <Typography variant="subtitle2" className={classes.bgName}>
                                Text Color
                            </Typography>
                            <div className={classes.backgroundWrapper}>
                                <div className={classes.colorPickersWrapper2}>
                                    <ColorPicker
                                        disabled={readOnly}
                                        classes={classes}
                                        variant="v3"
                                        color={params?.textColor}
                                        onChange={onChangeTextColor}
                                    />
                                </div>
                            </div>

                        </div>
                    ) : null} */}
                </div>
            </div>
            <div airia-label="preview" className={classes.preview}>
                <Typography variant="subtitle1" className={classes.title} gutterBottom>
                    Preview Application
                </Typography>
                <div className={classes.previewWrapper}>
                    <PreviewThemeComp
                        bg_variant={bg_variant}
                        mode={mode}
                        contrast_color={contrast_color}
                        chart_colors={chart_colors}
                        params={params}
                    />
                </div>
            </div>
        </div>
    );
}

const PopOver = (props) => {
    const { popOver, children, onClose, anchorEl, title, classes, anchorOrigin, transformOrigin } =
        props;

    return (
        <Popover
            open={popOver}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            className={classes.popOverContainer}
        >
            <div className={classes.popOver}>
                {title && (
                    <div className={classes.popOverTitle}>
                        <Typography className={classes.popOverTitleText}>
                            {title?.length > 0 ? title.trim() : 'Info'}
                        </Typography>
                        <IconButton
                            aria-label="close"
                            className={classes.closeIcon}
                            onClick={() => onClose()}
                        >
                            <CloseIcon className={classes.closeIcon} />
                        </IconButton>
                    </div>
                )}
                <div className={classes.popOverContent}>
                    <Typography className={classes.contentText}>{children}</Typography>
                </div>
            </div>
        </Popover>
    );
};

function BackgroundColorItem({
    selected,
    readOnly,
    secondaryColor,
    darkColor,
    gridColor,
    textColor,
    updateColorDisabled,
    label,
    classes,
    onSelect,
    onColorChange
}) {
    const [anchorEl, setAnchor] = useState(null);
    const [popOver, setPopOver] = useState(false);

    const onClickInfo = (event) => {
        setPopOver(true);
        setAnchor(event.currentTarget);
    };

    const onCloseInfo = () => {
        setPopOver(false);
        setAnchor(null);
    };

    return (
        <div
            className={clsx(
                classes.backgroundItemRoot,
                selected && classes.backgroundItemSelected,
                readOnly && classes.readOnlyBG
            )}
            onClick={onSelect}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                {selected && !readOnly && (
                    <RadioButtonCheckedIcon
                        RadioButtonUncheckedIcon
                        fontSize="large"
                        className={classes.bgCheckIcon}
                    />
                )}
                {!selected && !readOnly && (
                    <RadioButtonUncheckedIcon fontSize="large" className={classes.bgCheckIcon} />
                )}
                <Typography variant="subtitle2" className={classes.bgName}>
                    {label}
                </Typography>
                <div className={classes.iconContainer}>
                    <IconButton
                        className={classes.iconButton}
                        size="small"
                        aria-label={'Label'}
                        onClick={onClickInfo}
                    >
                        <InfoOutlinedIcon
                            fontSize="small"
                            className={clsx(classes.assumptionsIcon)}
                        />
                    </IconButton>
                    {popOver && anchorEl && (
                        <PopOver
                            popOver={true}
                            anchorEl={anchorEl}
                            onClose={onCloseInfo}
                            classes={classes}
                            title={
                                label == 'NucliOS Default'
                                    ? 'NucliOS Default Colors'
                                    : 'Custom Colors'
                            }
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'center',
                                horizontal: 'left'
                            }}
                        >
                            {label == 'NucliOS Default' ? (
                                <div className={classes.contentText}>
                                    <div className={classes.gridPointContainer}>
                                        {' '}
                                        <CircularBullet />
                                        <div className={classes.contentTextBlock}>
                                            {' '}
                                            <span className={classes.contentTextBold}>
                                                Theme Customization
                                            </span>{' '}
                                            NucliOS default color theme is fixed and cannot be
                                            modified.
                                        </div>
                                    </div>
                                    <div className={classes.gridPointContainer}>
                                        {' '}
                                        <CircularBullet />
                                        <div className={classes.contentTextBlock}>
                                            {' '}
                                            <span className={classes.contentTextBold}>
                                                Background:
                                            </span>{' '}
                                            The chosen background color will be applied throughout
                                            the application
                                        </div>
                                    </div>
                                    <div className={classes.gridPointContainer}>
                                        {' '}
                                        <CircularBullet />
                                        <div className={classes.contentTextBlock}>
                                            {' '}
                                            <span className={classes.contentTextBold}>
                                                Secondary:
                                            </span>{' '}
                                            This color is applied to filter options when selected,
                                            as well as hyperlink texts.
                                        </div>
                                    </div>
                                    <div className={classes.gridPointContainer}>
                                        {' '}
                                        <CircularBullet />
                                        <div className={classes.contentTextBlock}>
                                            <span className={classes.contentTextBold}>
                                                Grid Lines:
                                            </span>{' '}
                                            To distinguish grid lines clearly, the selected grid
                                            color will be applied
                                        </div>{' '}
                                    </div>
                                    <div className={classes.gridPointContainer}>
                                        {' '}
                                        <CircularBullet />
                                        <div className={classes.contentTextBlock}>
                                            {' '}
                                            <span className={classes.contentTextBold}>
                                                Text:
                                            </span>{' '}
                                            All textual elements will adopt the specified text
                                            color, ensuring readability and consistency
                                        </div>{' '}
                                    </div>
                                </div>
                            ) : (
                                <div className={classes.contentText}>
                                    <div className={classes.gridPointContainer}>
                                        {' '}
                                        <CircularBullet />
                                        <div className={classes.contentTextBlock}>
                                            {' '}
                                            <span className={classes.contentTextBold}>
                                                Background:
                                            </span>{' '}
                                            The chosen background color will be applied throughout
                                            the application
                                        </div>
                                    </div>
                                    <div className={classes.gridPointContainer}>
                                        {' '}
                                        <CircularBullet />
                                        <div className={classes.contentTextBlock}>
                                            <span className={classes.contentTextBold}>
                                                Secondary Color:
                                            </span>{' '}
                                            This color is applied to filter options when selected,
                                            as well as hyperlink texts
                                        </div>{' '}
                                    </div>
                                    <div className={classes.gridPointContainer}>
                                        {' '}
                                        <CircularBullet />
                                        <div className={classes.contentTextBlock}>
                                            <span className={classes.contentTextBold}>
                                                Grid Lines:
                                            </span>{' '}
                                            To distinguish grid lines clearly, the selected grid
                                            color will be applied
                                        </div>{' '}
                                    </div>
                                    <div className={classes.gridPointContainer}>
                                        {' '}
                                        <CircularBullet />
                                        <div className={classes.contentTextBlock}>
                                            {' '}
                                            <span className={classes.contentTextBold}>
                                                Text:
                                            </span>{' '}
                                            All textual elements will adopt the specified text
                                            color, ensuring readability and consistency
                                        </div>{' '}
                                    </div>
                                </div>
                            )}
                        </PopOver>
                    )}
                </div>
            </div>
            <div className={classes.backgroundWrapper}>
                <div className={classes.colorPickersWrapper2}>
                    <ColorPicker
                        disabled={updateColorDisabled}
                        classes={classes}
                        variant="v3"
                        color={darkColor}
                        onChange={(v) => {
                            onColorChange({ darkColor: v });
                        }}
                    />

                    <ColorPicker
                        disabled={updateColorDisabled}
                        classes={classes}
                        variant="v3"
                        color={secondaryColor}
                        onChange={(v) => {
                            onColorChange({ secondaryColor: v });
                        }}
                    />
                    <ColorPicker
                        disabled={updateColorDisabled}
                        classes={classes}
                        variant="v3"
                        color={gridColor}
                        onChange={(v) => {
                            onColorChange({ gridColor: v });
                        }}
                    />
                    <ColorPicker
                        disabled={updateColorDisabled}
                        classes={classes}
                        variant="v3"
                        color={textColor}
                        onChange={(v) => onColorChange({ textColor: v })}
                    />
                </div>
            </div>
            <div className={classes.themeItems}>
                {['Backgound', 'Secondary', 'Grid', 'Text'].map((el, index) => (
                    <Typography key={index} className={classes.themeItem}>
                        {el}
                    </Typography>
                ))}
            </div>
        </div>
    );
}

function ColorPicker({ color, disabled, classes, variant = 'v1', onChange }) {
    const [open, setOpen] = useState();

    return (
        <div
            className={clsx(
                classes.colorPickerRoot,
                variant === 'v3' ? classes.colorPickerRoot2 : null,
                disabled && classes.colorPickerDisbaled
            )}
            style={{ '--color': color }}
        >
            {variant === 'v1' ? (
                <>
                    <Typography variant="subtitle2" className={classes.colorPickerText}>
                        {color}
                    </Typography>
                    <div style={{ flex: 1 }}></div>
                </>
            ) : null}
            {disabled ? (
                <Tooltip
                    classes={{ tooltip: classes.toolTip }}
                    title={
                        <Typography className={classes.toolTipText}>
                            Clone theme to edit the color.
                        </Typography>
                    }
                    arrow
                >
                    <IconButton
                        className={variant === 'v1' ? classes.lockButtonV1 : classes.lockButtonV3}
                        size="medium"
                    >
                        {' '}
                        <LockIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            ) : (
                <IconButton
                    className={classes.editButton}
                    title="edit"
                    size="medium"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    {' '}
                    <EditIcon fontSize="large" />
                </IconButton>
            )}

            {open ? (
                <div className={classes.chromePickerContainer}>
                    <div
                        className={classes.cover}
                        onClick={() => {
                            setOpen(false);
                        }}
                    ></div>
                    <div className={classes.chromePickerRoot}>
                        <ChromePicker
                            disableAlpha
                            color={color}
                            onChange={(e) => {
                                onChange(e.hex);
                            }}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function PreviewThemeComp({ bg_variant, mode, contrast_color, chart_colors, params }) {
    const [{ materialTheme, chartTheme }, setTheme] = useState(
        themeGenerator(bg_variant, mode, contrast_color, chart_colors, params)
    );
    const [themeUpdateCount, setThemeUpdateCount] = useState(0);
    const { themeMode } = useContext(CustomThemeContext);

    useDebouncedEffect(
        () => {
            setTheme(themeGenerator(bg_variant, mode, contrast_color, chart_colors, params));
            setThemeUpdateCount((s) => ++s);
        },
        [bg_variant, mode, contrast_color, chart_colors, params],
        100
    );

    return (
        <CustomThemeContext.Provider
            value={{ plotTheme: chartTheme }}
            key={themeUpdateCount + themeMode}
        >
            <ThemeProvider theme={materialTheme}>
                <ThemePreviewScreen />
            </ThemeProvider>
        </CustomThemeContext.Provider>
    );
}
