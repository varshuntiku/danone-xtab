import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Box, lighten, LinearProgress, CircularProgress, Typography } from '@material-ui/core';

function Databar(
    { value, color, textColor, dataBarType, maxPercentValue, padding, textVariant, size },
    CircularProgressProps
) {
    const StyledLinearProgress = withStyles((theme) => ({
        root: {
            height: maxPercentValue?.databarHeight || '1.9rem',
            width: maxPercentValue?.databarTotalWidth || '100%',
            backgroundColor:
                maxPercentValue?.databarBgColor ||
                lighten(color || theme.palette.primary.contrastText, 0.5),
            borderRadius: maxPercentValue?.databarBorderRadius || 3
        },
        bar: {
            backgroundColor: color || theme.palette.primary.contrastText
        }
    }))(LinearProgress);

    const ForeGroundCircularProgressBar = withStyles(() => ({
        root: {
            position: 'relative',
            zIndex: 1,
            color: color ? color['foregroundProgressBarColor'] : 'green',
            padding: padding || '6px'
        }
    }))(CircularProgress);

    const BackGroundCircularProgressBar = withStyles(() => ({
        root: {
            position: 'absolute',
            zIndex: 0,
            color: color ? color['backgroundProgressBarColor'] : 'lightgreen',
            padding: padding || '6px'
        }
    }))(CircularProgress);

    const TextTypography = withStyles({
        root: {
            color: textColor || '#FFFFFF',
            fontWeight: maxPercentValue?.databarFontWeight || 700,
            fontSize: maxPercentValue?.databarFontSize || '1.3rem'
        }
    })(Typography);

    return (
        // <SelectProgressBarType type={dataBarType}/>

        dataBarType == 'Circular' ? (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <BackGroundCircularProgressBar
                    thickness={8}
                    size={size || 40}
                    variant="determinate"
                    value={100}
                />
                <ForeGroundCircularProgressBar
                    thickness={8}
                    size={size || 40}
                    variant="determinate"
                    {...CircularProgressProps}
                    value={value}
                />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        padding: '10px 0px',
                        color: textColor || '#000000'
                    }}
                >
                    <Typography variant={textVariant || 'h6'}>{`${value}%`}</Typography>
                </Box>
            </Box>
        ) : (
            <Box position="relative" display="inline-flex" style={{ width: '100%' }}>
                <StyledLinearProgress variant="determinate" value={value} />
                <Box
                    top={0}
                    left={maxPercentValue?.databarLeftLabelPadding || 25}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="start"
                >
                    {/* Checking for custom Max Percent Value to display percent values inside progress bar */}
                    {maxPercentValue?.customMaxValue ? (
                        <TextTypography variant="body2">
                            <span>
                                {maxPercentValue?.noPercentageIcon ? `${value}` : `${value}%`}
                            </span>
                            <span
                                style={{
                                    color: maxPercentValue.customMaxValue?.color,
                                    marginLeft: 5
                                }}
                            >
                                {' '}
                                {maxPercentValue.customMaxValue?.noPercentageIcon
                                    ? `(${maxPercentValue.customMaxValue?.value})`
                                    : `(${maxPercentValue.customMaxValue?.value}%)`}{' '}
                            </span>
                        </TextTypography>
                    ) : (
                        <TextTypography variant="body2">
                            {' '}
                            {maxPercentValue?.noPercentageIcon
                                ? `${maxPercentValue?.databarLabel || value}`
                                : `${maxPercentValue?.databarLabel || value}%`}{' '}
                        </TextTypography>
                    )}
                </Box>
                {maxPercentValue?.databarTotalValue ? (
                    <TextTypography
                        variant="body2"
                        style={{
                            color: maxPercentValue?.databarTotalValueColor || 'black',
                            fontSize: maxPercentValue?.databarTotalValueFontSize || '1.3rem',
                            fontWeight: maxPercentValue?.databarTotalValueFontWeight || 700,
                            margin: maxPercentValue?.databarTotalValueMargin
                        }}
                    >
                        {`${maxPercentValue?.databarTotalValue}`}
                    </TextTypography>
                ) : null}
            </Box>
        )
    );
}

export default Databar;
