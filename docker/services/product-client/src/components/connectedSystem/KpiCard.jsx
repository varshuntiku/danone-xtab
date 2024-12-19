import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import CustomProgressRendererComponent from '../Experimental/progressRendererComponent/progressRendererComponent';
import createPlotlyComponent from 'react-plotly.js/factory';
import CalenderTodayOutlined from '@material-ui/icons/CalendarTodayOutlined';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import clsx from 'clsx';
import InfoPopup from './InfoPopup';

function KpiCard(props) {
    const Plotly = window.Plotly;
    const Plot = createPlotlyComponent(Plotly);
    const kpiData = props?.item;
    const [showPopUp, setShowPopUp] = useState(false);
    const useStyles = makeStyles((theme) => ({
        cardBanner: {
            width: theme.spacing(1.4),
            height: '50%',
            borderRadius: '16.25rem',
            backgroundImage: kpiData?.bannerBlue
                ? 'linear-gradient(to right, #06A2C5  40% , rgba(2, 224, 254,0.2))'
                : 'linear-gradient(to right, #B68F08 40% , rgba(182, 143, 8, 0.2))',
            opacity: '0.8',
            marginLeft: '-10px',
            position: 'absolute',
            left: theme.spacing(1),
            top: theme.spacing(3)
        },
        title: {
            fontSize: props?.title?.fontSize || theme.spacing(1.75),
            [theme.breakpoints.up('lg')]: {
                fontSize: props?.title?.fontSizeLg || theme.spacing(2.25)
            },
            [theme.breakpoints.up('xl')]: {
                fontSize: props?.title?.fontSizeXl || theme.spacing(2.5)
            },
            color: props?.title?.color || `${theme.palette.text.titleText}`,
            width: props?.title?.width || '100%',
            fontWeight: props?.title?.fontWeight || 'bold',
            paddingLeft: props?.title?.paddingLeft || '2rem',
            marginTop: props?.title?.marginTop || '1rem',
            letterSpacing: props?.title?.letterSpacing || '0px',
            opacity: props?.title?.opacity || 1
        },
        subTitle: {
            textTransform: 'uppercase',
            fontSize: '2.5rem',
            color: theme.palette.text.default,
            width: '100%',
            fontWeight: 'bold',
            marginLeft: '2rem !important',
            marginTop: '0.7rem'
        },
        descriptiveHeading: {
            color: props?.descriptiveHeading?.color || theme.palette.text.titleText,
            fontSize: props?.descriptiveHeading?.fontSize || theme.spacing(1),
            [theme.breakpoints.up('lg')]: {
                fontSize: props?.descriptiveHeading?.fontSizeLg || theme.spacing(1.25)
            },
            [theme.breakpoints.up('xl')]: {
                fontSize: props?.descriptiveHeading?.fontSizeXl || theme.spacing(1.5)
            },
            '@media (min-width: 768px) and (max-width: 1500px) ': {
                fontSize: '1.5rem'
            },
            '@media (min-width:1500px) and (max-width: 1900px)': {
                fontSize: '1.6rem'
            },
            letterSpacing: '1px',
            fontWeight: props?.descriptiveHeading?.fontWeight || 500,
            paddingBottom: props?.descriptiveHeading?.paddingBottom || '1rem',
            paddingTop: props?.descriptiveHeading?.paddingTop || '0rem',
            paddingLeft: props?.descriptiveHeading?.paddingLeft || '2rem',
            opacity: props?.descriptiveHeading?.opacity || 1
        },
        descriptiveSubHeading: {
            color: props?.descriptiveSubHeading?.color || `${theme.palette.text.titleText}`,
            fontSize: props?.descriptiveSubHeading?.fontSize || theme.spacing(1),
            [theme.breakpoints.up('lg')]: {
                fontSize: props?.descriptiveSubHeading?.fontSizeLg || theme.spacing(1.25)
            },
            [theme.breakpoints.up('xl')]: {
                fontSize: props?.descriptiveSubHeading?.fontSizeXl || theme.spacing(1.5)
            },
            fontWeight: 300,
            paddingLeft: '2rem',
            opacity: props?.descriptiveSubHeading?.opacity || 1,
            display: 'flex',
            alignItems: 'center'
        },
        typeOneText: {
            color: props?.typeOneText?.color || `${theme.palette.text.titleText}`,
            fontSize: theme.spacing(1.25),
            [theme.breakpoints.up('lg')]: {
                fontSize: props?.typeOneText?.fontSize || theme.spacing(1.75)
            },
            letterSpacing: '1px',
            fontWeight: 500,
            paddingBottom: '0rem',
            paddingTop: '0rem',
            paddingLeft: props?.typeOneText?.paddingLeft || '2rem',
            opacity: 0.9
        },
        typeTwoText: {
            color: props?.typeTwoText?.color || `${theme.palette.text.titleText}`,
            fontSize: theme.spacing(2.75),
            [theme.breakpoints.up('lg')]: {
                fontSize: props?.typeTwoText?.fontSize || theme.spacing(3.25)
            },
            [theme.breakpoints.up('xl')]: {
                fontSize: props?.typeTwoText?.fontSize || theme.spacing(3.5)
            },
            letterSpacing: '1px',
            fontWeight: 200,
            paddingBottom: '0rem',
            paddingTop: '0rem',
            paddingLeft: props?.typeTwoText?.paddingLeft || '2rem',
            opacity: 1
        },
        rightHeading: {
            color: props?.rightHeading?.color || theme.palette.text.default,
            fontSize: props?.rightHeading?.fontSize || theme.spacing(2.5),
            [theme.breakpoints.up('lg')]: {
                fontSize: props?.rightHeading?.fontSizeLg || theme.spacing(3.5)
            },
            [theme.breakpoints.up('xl')]: {
                fontSize: props?.rightHeading?.fontSizeXl || theme.spacing(3.75)
            },
            fontWeight: 200,
            marginLeft: 'auto',
            opacity: props?.rightHeading?.opacity || 0.8,
            paddingRight: '1rem',
            display: 'flex',
            alignItems: 'center'
        },
        cardContainer: {
            width: props?.width || '100%',
            height: props?.height || '100%',
            minWidth: props?.minWidth || '100%',
            position: 'relative',
            borderRadius: props?.borderRadius || '0.8rem',
            border: props?.border || `2px solid ${theme.palette.border.goalCardBorder}`,
            background: props?.background || theme.palette.background.linearBackground,
            paddingBottom: '0.5rem',
            marginLeft: props?.cardMarginLeft || '1rem',
            marginRight: props?.cardMarginRight || '0rem',
            paddingLeft: props?.cardPaddingLeft || '0rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            boxShadow: props?.cardBoxShadow || 'none',
            backdropFilter: 'blur(3.5px)'
        },
        topDiv: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            width: '100%'
        },
        bottomDiv: {
            display: 'flex',
            flexDirection: 'row',
            height: props?.rightHeight || '100%',
            paddingBottom: props?.bottomPadding || '1rem',
            width: '100%',
            flexWrap: 'nowrap',
            marginTop: props?.bottomDivMarginTop || '0rem'
        },
        infoIcon: {
            cursor: 'pointer',
            width: '2.2rem',
            height: '2.2rem',
            position: 'absolute',
            color: theme.palette.text.default,
            top: 5,
            right: 5
        },
        calenderIcon: {
            width: '1.5rem',
            height: '1.5rem',
            paddingRight: '0.25rem',
            color: theme.palette.text.default,
            opacity: 0.6
        },
        arrowUpwardIcon: {
            width: '3rem',
            height: '5rem',
            color: theme.ConnectedSystemDashboard.kpiCard.upArrow,
            opacity: 1
        },
        arrowDownwardIcon: {
            width: '2rem',
            height: '2rem',
            paddingRight: '0.25rem',
            color: theme.ConnectedSystemDashboard.kpiCard.downArrow,
            opacity: 1
        },
        connSystemCardPlot: {
            height: props?.graphHeight || theme.spacing(15),
            width: props?.graphWidth || theme.spacing(20),
            marginLeft: props?.graphMarginLeft || '1rem',
            marginTop: props?.graphmarginTop || '1rem',
            '& .js-fill': {
                fill: 'url(#graph-gradient) !important'
            }
        },
        graphLabel: {
            color: theme.palette.text.default,
            opacity: '0.8',
            fontWeight: 500,
            fontSize: theme.spacing(1.4),
            textAlign: 'left',
            letterSpacing: '0px',
            maxWidth: '90%',
            paddingLeft: '1rem'
        },
        rightContainer: {
            width: props?.rightWidth || '100%',
            height: props?.rightHeight || '100%',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
            justifyContent: 'flex-end',
            paddingLeft: props?.rightContainer?.paddingLeft || '1rem',
            paddingBottom: props?.rightContainerBottomPadding || '0rem',
            marginLeft: props?.rightContainer?.marginLeft || '0rem'
        },
        leftContainer: {
            width: props?.leftWidth || '100%',
            height: props?.leftHeight || '100%',
            display: 'flex',
            flexDirection: 'column',
            marginTop: props?.leftContainer?.marginTop || 'auto',
            justifyContent: props?.leftContainer?.justifyContent || 'flex-end'
        },
        plotlyHolder: {
            width: '100%',
            height: '100%',
            marginLeft: props?.marginLeft || '1rem'
        },
        legend: {
            display: 'flex',
            marginLeft: '2rem',
            gap: '5px',
            marginTop: '1rem',
            alignItems: 'center'
        },
        lengendBox: {
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '3px',
            background: '#4560D7'
        },
        lengendText: {
            color: theme.palette.text.default,
            fontSize: '1.42rem',
            fontStyle: 'normal',
            fontWeight: '300'
        },
        cardDesc: {
            fontSize: '1.5rem',
            marginLeft: '2rem',
            color: theme.palette.text.default
        },
        cardVal: {
            fontSize: '3rem',
            marginLeft: '2rem',
            color: theme.palette.text.default
        },
        fullWidthBottom: {
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            marginLeft: '1rem',
            marginRight: '1rem',
            marginBottom: '1rem',
            flexWrap: 'nowrap',
            height: '100%'
        },
        labelText: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '7rem',
            '& div': {
                fontSize: '1.5rem',
                color: theme.ConnectedSystemDashboard.kpiCard.labelText,
                textAlign: 'left',
                fontWeight: 400
            }
        },
        valueText: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent:
                props.item?.rightLevel?.data[0].type === 'plotly' ? 'flex-end' : 'space-between',
            '& div': {
                fontSize: '2.7rem',
                color: theme.ConnectedSystemDashboard.kpiCard.labelText,
                textAlign: 'right',
                fontWeight: 200
            }
        },
        limitTextWidth: {
            '& div': {
                maxWidth: '7rem'
            }
        },
        bottomDetail: {
            fontSize: '1.2rem',
            color: theme.palette.text.default,
            marginLeft: '13%'
        }
    }));
    const classes = useStyles();

    const textType = (textType) => {
        switch (textType) {
            case 'type1':
                return classes.typeOneText;
            case 'type2':
                return classes.typeTwoText;
            case 'sub_text':
                return classes.descriptiveSubHeading;
            default:
                return classes.descriptiveHeading;
        }
    };
    const itemRenderer = (item, index = 1) => {
        switch (item?.type) {
            case 'progressRenderer':
                return (
                    <CustomProgressRendererComponent
                        params={item?.progressData}
                        style={{ display: 'flex' }}
                        key={`progressRenderer " ${index}`}
                    />
                );

            case 'legend':
                return (
                    <div className={classes.legend} key={'legend ' + index}>
                        <div
                            className={classes.lengendBox}
                            style={{ backgroundColor: item.legendColor }}
                        ></div>
                        <div className={classes.lengendText}>{item.legendText}</div>
                    </div>
                );

            case 'plotly':
                return (
                    <div
                        className={`${classes.plotlyHolder} ${props.customPlotlyWrapperClasses}`}
                        key={'plotly ' + index}
                    >
                        <Plot
                            data={item?.data}
                            layout={{
                                margin: { l: 0, r: 0, t: 0, b: 0 },
                                paper_bgcolor: 'rgb(0,0,0,0)',
                                plot_bgcolor: 'rgb(0,0,0,0)',
                                yaxis: props?.layout?.yaxis
                                    ? { visible: props?.layout?.yaxis }
                                    : { visible: false },
                                xaxis: props?.layout?.xaxis
                                    ? { visible: props?.layout?.xaxis }
                                    : { visible: false },
                                shapes: item?.shapes,
                                annotations: item?.annotations,
                                grid: { rows: 1, columns: 2 },
                                showlegend: item?.showLegend || false,
                                autosize: true,
                                width: props?.layoutWidth,
                                height: props?.layoutHeight,
                                legend: item?.legend,
                                coloraxis: {
                                    colorscale: item?.data[0]?.colorscale,
                                    cmin: item?.data[0]?.cmin,
                                    cmax: item?.data[0]?.cmax,
                                    colorbar: {
                                        len: 1.1,
                                        thicknessmode: 'fraction',
                                        thickness: 0.03,
                                        y: 0.65,
                                        tickfont: item?.data[0]?.tickfont,
                                        outlinewidth: 0,
                                        x: 0.49
                                    }
                                }
                            }}
                            config={{
                                displayModeBar: false,
                                responsive: true,
                                staticPlot: true
                            }}
                            className={`${classes.connSystemCardPlot} ${props?.customPlotlyClasses}`}
                            useResizeHandler={true}
                        />
                        {item?.label && (
                            <Typography className={classes.graphLabel}>{item?.label}</Typography>
                        )}
                    </div>
                );

            case 'text':
                return (
                    <Typography className={textType(item?.text_Type)} key={'text ' + index}>
                        {item?.icon && <CalenderTodayOutlined className={classes.calenderIcon} />}
                        {item?.data}
                    </Typography>
                );
            case 'right_heading':
                return (
                    <Typography className={classes.rightHeading} key={'right_heading ' + index}>
                        {item?.icon && <ArrowUpwardIcon className={classes.arrowUpwardIcon} />}
                        {item?.data}
                    </Typography>
                );
            case 'card-desc':
                return (
                    <div className={classes.cardDesc} key={'card-desc ' + index}>
                        {item?.data}
                    </div>
                );
            case 'card-value':
                return (
                    <div className={classes.cardVal} key={'card-value ' + index}>
                        {item?.data}
                    </div>
                );
        }
    };

    const showInfo = () => {
        setShowPopUp(!showPopUp);
    };
    const onCloseInfo = () => {
        setShowPopUp(!showPopUp);
    };
    return (
        <div className={classes.cardContainer}>
            {kpiData?.banner && <div className={classes.cardBanner}></div>}
            {kpiData?.info_icon && (
                <InfoIcon
                    className={classes.infoIcon}
                    onClick={kpiData?.showInfoPopup ? showInfo : null}
                />
            )}
            <div className={classes.topDiv}>
                {kpiData?.label && (
                    <Typography className={classes.title}>{kpiData?.label}</Typography>
                )}
                {kpiData?.subTitle && (
                    <Typography className={classes.subTitle}>{kpiData?.subTitle}</Typography>
                )}
            </div>
            {!props.bottomFullWidth ? (
                <div className={classes.bottomDiv}>
                    {kpiData?.leftLevel && (
                        <div className={classes.leftContainer}>
                            {kpiData?.leftLevel?.data?.map((item, index) =>
                                itemRenderer(item, index)
                            )}
                            {props?.bottomDetail && (
                                <div
                                    className={classes.bottomDetail}
                                >{`Total Models ${kpiData?.totalModels}`}</div>
                            )}
                        </div>
                    )}

                    {kpiData?.rightLevel && (
                        <div className={classes.rightContainer}>
                            {kpiData?.rightLevel?.data?.map((item, index) =>
                                itemRenderer(item, index)
                            )}
                            {kpiData?.info_icon && kpiData?.showInfoPopup && (
                                <InfoPopup
                                    onClose={onCloseInfo}
                                    openDialog={showPopUp}
                                    infoData={kpiData?.infoData}
                                />
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className={classes.fullWidthBottom}>
                    <div
                        className={clsx(
                            classes.labelText,
                            props.item?.leftLevel?.data.length > 2 ? classes.limitTextWidth : null
                        )}
                    >
                        {props.item?.leftLevel?.data?.map((el, i) => (
                            <div key={i}>{el.data}</div>
                        ))}
                    </div>
                    <div className={classes.valueText}>
                        {props.item?.rightLevel?.data[0].type === 'plotly' ? (
                            <div>{itemRenderer(props?.item?.rightLevel?.data[0])}</div>
                        ) : (
                            props.item?.rightLevel?.data.map((el, i) => (
                                <div key={i}>{el.data}</div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default KpiCard;
