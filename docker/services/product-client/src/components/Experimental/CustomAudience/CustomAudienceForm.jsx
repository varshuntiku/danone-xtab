import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import ShowChartIcon from '@material-ui/icons/ShowChart';
// import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AppWidgetPlot from '../../AppWidgetPlot';
// import SendPromptIcon from 'assets/Icons/SendPrompt';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Editor from '@monaco-editor/react';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CustomSnackbar from '../../CustomSnackbar';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { Button, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%'
    },
    formHeaderContainer: {
        height: '5%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.default,
        fontSize: '2rem'
    },
    headerIcon: {
        width: '3rem',
        height: '3rem',
        padding: '.5rem',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF12',
        borderRadius: '4px',
        color: '#6DF0C2'
    },
    formHeader: {
        margin: '0px',
        paddingLeft: '1rem',
        fontSize: '3rem',
        fontWeight: '300'
    },
    userProfileLogo: {
        width: '4rem',
        height: '4rem',
        padding: '.5rem',
        marginLeft: 'auto',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF12',
        borderRadius: '50%',
        color: '#6DF0C2'
    },
    formFirstLayer: {
        height: '12%',
        width: '100%',
        marginTop: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    },
    audienceNameFieldContainer: {
        height: '70%',
        width: '90%'
    },
    analyseAudienceContainer: {
        width: '10%',
        display: 'flex',
        cursor: 'pointer'
    },
    analyseAudienceIcon: {
        fontSize: '2rem',
        color: '#6DF0C2',
        borderBottom: '1px solid #6DF0C2',
        borderLeft: '1px solid #6DF0C2'
    },
    analyseAudienceLabel: {
        fontSize: '1.6rem',
        color: '#6DF0C2',
        paddingLeft: '1rem'
    },
    audienceNameLabelContainer: {
        display: 'flex'
    },
    audienceNameLabel: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        fontWeight: '300'
    },
    labelRequiredSign: {
        color: '#FB6363',
        fontSize: '2rem',
        fontWeight: '300',
        paddingLeft: '0.2rem'
    },
    audienceNameWithEdit: {
        height: '100%',
        display: 'flex'
        // alignItems: 'center'
    },
    audienceName: {
        color: theme.palette.text.default,
        fontSize: '2rem'
    },
    audienceNameEditIcon: {
        fontSize: '3rem',
        color: '#6DF0C2',
        paddingLeft: '1rem',
        cursor: 'pointer'
    },
    audienceNameInput: {
        backgroundColor: '#183351',
        color: theme.palette.text.default,
        width: '35%',
        height: '60%',
        fontWeight: '300',
        borderRadius: '4px',
        border: 'none',
        '&:focus': {
            outline: 'none'
        }
    },
    audienceNameCheckIcon: {
        fontSize: '3.5rem',
        paddingLeft: '1rem',
        paddingTop: '1.5rem',
        cursor: 'pointer'
    },
    audienceNameCloseIcon: {
        fontSize: '3.5rem',
        paddingLeft: '1rem',
        paddingTop: '1.5rem',
        cursor: 'pointer'
    },
    imageSectionContainer: {
        height: '25%',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    imageUploadBox: {
        height: '83%',
        width: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6DF0C2',
        fontSize: '2rem',
        borderRadius: '4px',
        backgroundColor: '#183351',
        cursor: 'pointer'
    },
    imageContainer: {
        height: '100%',
        width: '100%',
        position: 'relative'
    },
    imageView: {
        height: '100%',
        width: '100%',
        objectFit: 'contain'
    },
    imageRemoveIcon: {
        right: '0px',
        top: '0px',
        position: 'absolute',
        color: '#6DF0C2',
        backgroundColor: 'grey',
        borderRadius: '50%'
    },
    kpiLayerContainer: {
        height: '22%',
        width: '100%'
        // display: 'flex',
        // alignItems: 'center'
    },
    kpiHeaderContainer: {
        display: 'flex',
        width: '100%'
    },
    kpiHeader: {
        width: '90%',
        fontSize: '1.6rem',
        color: theme.palette.text.default
    },
    downloadReportContainer: {
        width: '10%',
        display: 'flex',
        cursor: 'pointer'
    },
    downloadReportIcon: {
        fontSize: '2rem',
        color: '#6DF0C2'
    },
    kpiContainer: {
        height: '80%',
        paddingTop: '2rem',
        display: 'flex',
        alignItems: 'center'
    },
    kpiCard: {
        height: '100%',
        width: '24.5%',
        marginRight: '0.5%',
        display: 'flex',
        backgroundColor: '#183351',
        borderRadius: '4px'
    },
    kpiCardLeftSection: {
        width: '60%'
    },
    kpiCardRightSection: {
        width: '40%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2%'
    },
    kpiCardTitle: {
        height: '35%',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '2rem',
        fontWeight: '300',
        marginLeft: '20%',
        display: 'flex',
        alignItems: 'center'
    },
    kpiCardValue: {
        height: '30%',
        fontSize: '3rem',
        color: theme.palette.text.default,
        display: 'flex'
    },
    kpiCardSubValue: {
        height: '35%',
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        marginLeft: '20%',
        display: 'flex',
        alignItems: 'flex-start'
    },
    kpiCardValueDirection: {
        width: '20%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    kpiCardValueDirectionIcon: {
        fontSize: '3rem'
    },
    kpiCardValueText: {
        width: '80%'
    },
    rulesLayerContainer: {
        // maxHeight: '34%',
        width: '100%'
    },
    ruleContainer: {
        height: '90%',
        width: '100%',
        paddingTop: '2rem'
    },
    emptyRuleBox: {
        height: '25rem',
        width: '100%',
        // display: 'flex',
        backgroundColor: '#183351',
        position: 'relative'
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    emptyRuleText: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-40%, -50%)',
        fontSize: '1.6rem',
        color: theme.palette.text.default
    },
    addNewRuleIcon: {
        fontSize: '2rem',
        color: '#6DF0C2'
    },
    addNewRuleText: {
        fontSize: '1.6rem',
        color: '#6DF0C2'
        // paddingLeft: '1rem'
    },
    addNewRuleButtonContainer: {
        display: 'flex',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer'
    },
    submitButtonContainer: {
        height: '5%',
        width: '100%',
        marginTop: '1%'
    },
    submitButton: {
        height: '100%',
        float: 'right',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        cursor: 'pointer',
        borderRadius: '4px'
    },
    newRulesTableContainer: {
        Height: '100%'
    },
    // input: {
    //     minWidth: '100%',
    //     width: 'auto',
    //     fontSize: '1.8rem',
    //     backgroundColor: theme.palette.background.details,
    //     color: theme.palette.text.titleText,
    //     border: 'none',
    //     outline: 'none',
    //     padding: '2rem',
    //     marginRight: '1rem',
    //     paddingLeft: '1.2rem',
    //     position: 'relative',
    //     '&::placeholder': {
    //         color: theme.palette.text.default,
    //         opacity: 0.75
    //     },
    //     paddingRight:'6rem'
    // },
    input: {
        minWidth: '100%',
        width: 'auto',
        fontSize: '1.8rem',
        backgroundColor: theme.palette.background.details,
        color: theme.palette.text.default,
        marginRight: '1rem',
        padding: '0.8rem',
        '& .MuiSvgIcon-root': {
            fontSize: '3rem',
            color: theme.palette.text.titleText
        }
    },
    inputLabel: {
        color: theme.palette.text.default,
        fontSize: '1.8rem'
    },
    dialogPaper: {
        border: '1px solid ' + theme.palette.border.dialogBorder,
        minHeight: '73vh',
        minWidth: '50%',
        background: theme.palette.background.dialogBody,
        backdropFilter: 'blur(2rem)'
    },
    sendIcon: {
        position: 'absolute',
        top: '1.3rem',
        right: '2rem',
        cursor: 'pointer'
    },
    // table style
    heading: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.titleText,
        padding: '2rem',
        fontSize: '1.6rem',
        borderBottom: '1px solid rgba(224, 224, 224, 1)'
    },
    body: {
        padding: '1rem',
        fontSize: '1.6rem',
        textAlign: 'left',
        fontWeight: '400',
        lineHeight: '1.43',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        letterSpacing: '0.01071em',
        verticalAlign: 'inherit',
        color: theme.palette.text.titleText
    },
    actionIcon: {
        fontSize: '2.5rem',
        fill: theme.palette.primary.contrastText,
        cursor: 'pointer',
        marginLeft: '1rem'
    },
    actionEditIcon: {
        fontSize: '2.5rem',
        fill: theme.palette.primary.contrastText,
        cursor: 'pointer'
    },
    footer: {
        color: theme.palette.primary.contrastText,
        padding: '2rem',
        fontSize: '1.6rem',
        cursor: 'pointer'
    },
    addRuleIcon: {
        fontSize: '2.5rem',
        fill: theme.palette.primary.contrastText,
        marginRight: '1.5rem'
    },
    DialogTitle: {
        fontSize: '1.35rem',
        color: theme.palette.text.titleText
    },
    DialogActionContainer: {
        marginBottom: '1rem',
        marginRight: '1rem'
    }
}));

const graphData = {
    data: [
        {
            marker: {
                color: '#94a8ff'
            },
            x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            y: [10, 13, 20, 29, 18, 15, 12, 27, 26, 11, 16, 23, 14, 19, 22],
            type: 'bar'
        }
    ],
    layout: {
        template: {
            data: {
                histogram2dcontour: [
                    {
                        type: 'histogram2dcontour',
                        colorbar: {
                            outlinewidth: 0,
                            ticks: ''
                        },
                        colorscale: [
                            [0, '#0d0887'],
                            [0.1111111111111111, '#46039f'],
                            [0.2222222222222222, '#7201a8'],
                            [0.3333333333333333, '#9c179e'],
                            [0.4444444444444444, '#bd3786'],
                            [0.5555555555555556, '#d8576b'],
                            [0.6666666666666666, '#ed7953'],
                            [0.7777777777777778, '#fb9f3a'],
                            [0.8888888888888888, '#fdca26'],
                            [1, '#f0f921']
                        ]
                    }
                ],
                choropleth: [
                    {
                        type: 'choropleth',
                        colorbar: {
                            outlinewidth: 0,
                            ticks: ''
                        }
                    }
                ],
                histogram2d: [
                    {
                        type: 'histogram2d',
                        colorbar: {
                            outlinewidth: 0,
                            ticks: ''
                        },
                        colorscale: [
                            [0, '#0d0887'],
                            [0.1111111111111111, '#46039f'],
                            [0.2222222222222222, '#7201a8'],
                            [0.3333333333333333, '#9c179e'],
                            [0.4444444444444444, '#bd3786'],
                            [0.5555555555555556, '#d8576b'],
                            [0.6666666666666666, '#ed7953'],
                            [0.7777777777777778, '#fb9f3a'],
                            [0.8888888888888888, '#fdca26'],
                            [1, '#f0f921']
                        ]
                    }
                ],
                heatmap: [
                    {
                        type: 'heatmap',
                        colorbar: {
                            outlinewidth: 0,
                            ticks: ''
                        },
                        colorscale: [
                            [0, '#0d0887'],
                            [0.1111111111111111, '#46039f'],
                            [0.2222222222222222, '#7201a8'],
                            [0.3333333333333333, '#9c179e'],
                            [0.4444444444444444, '#bd3786'],
                            [0.5555555555555556, '#d8576b'],
                            [0.6666666666666666, '#ed7953'],
                            [0.7777777777777778, '#fb9f3a'],
                            [0.8888888888888888, '#fdca26'],
                            [1, '#f0f921']
                        ]
                    }
                ],
                heatmapgl: [
                    {
                        type: 'heatmapgl',
                        colorbar: {
                            outlinewidth: 0,
                            ticks: ''
                        },
                        colorscale: [
                            [0, '#0d0887'],
                            [0.1111111111111111, '#46039f'],
                            [0.2222222222222222, '#7201a8'],
                            [0.3333333333333333, '#9c179e'],
                            [0.4444444444444444, '#bd3786'],
                            [0.5555555555555556, '#d8576b'],
                            [0.6666666666666666, '#ed7953'],
                            [0.7777777777777778, '#fb9f3a'],
                            [0.8888888888888888, '#fdca26'],
                            [1, '#f0f921']
                        ]
                    }
                ],
                contourcarpet: [
                    {
                        type: 'contourcarpet',
                        colorbar: {
                            outlinewidth: 0,
                            ticks: ''
                        }
                    }
                ],
                contour: [
                    {
                        type: 'contour',
                        colorbar: {
                            outlinewidth: 0,
                            ticks: ''
                        },
                        colorscale: [
                            [0, '#0d0887'],
                            [0.1111111111111111, '#46039f'],
                            [0.2222222222222222, '#7201a8'],
                            [0.3333333333333333, '#9c179e'],
                            [0.4444444444444444, '#bd3786'],
                            [0.5555555555555556, '#d8576b'],
                            [0.6666666666666666, '#ed7953'],
                            [0.7777777777777778, '#fb9f3a'],
                            [0.8888888888888888, '#fdca26'],
                            [1, '#f0f921']
                        ]
                    }
                ],
                surface: [
                    {
                        type: 'surface',
                        colorbar: {
                            outlinewidth: 0,
                            ticks: ''
                        },
                        colorscale: [
                            [0, '#0d0887'],
                            [0.1111111111111111, '#46039f'],
                            [0.2222222222222222, '#7201a8'],
                            [0.3333333333333333, '#9c179e'],
                            [0.4444444444444444, '#bd3786'],
                            [0.5555555555555556, '#d8576b'],
                            [0.6666666666666666, '#ed7953'],
                            [0.7777777777777778, '#fb9f3a'],
                            [0.8888888888888888, '#fdca26'],
                            [1, '#f0f921']
                        ]
                    }
                ],
                mesh3d: [
                    {
                        type: 'mesh3d',
                        colorbar: {
                            outlinewidth: 0,
                            ticks: ''
                        }
                    }
                ],
                scatter: [
                    {
                        fillpattern: {
                            fillmode: 'overlay',
                            size: 10,
                            solidity: 0.2
                        },
                        type: 'scatter'
                    }
                ],
                parcoords: [
                    {
                        type: 'parcoords',
                        line: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        }
                    }
                ],
                scatterpolargl: [
                    {
                        type: 'scatterpolargl',
                        marker: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        }
                    }
                ],
                bar: [
                    {
                        error_x: {
                            color: '#2a3f5f'
                        },
                        error_y: {
                            color: '#2a3f5f'
                        },
                        marker: {
                            line: {
                                color: '#E5ECF6',
                                width: 0.5
                            },
                            pattern: {
                                fillmode: 'overlay',
                                size: 10,
                                solidity: 0.2
                            }
                        },
                        type: 'bar'
                    }
                ],
                scattergeo: [
                    {
                        type: 'scattergeo',
                        marker: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        }
                    }
                ],
                scatterpolar: [
                    {
                        type: 'scatterpolar',
                        marker: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        }
                    }
                ],
                histogram: [
                    {
                        marker: {
                            pattern: {
                                fillmode: 'overlay',
                                size: 10,
                                solidity: 0.2
                            }
                        },
                        type: 'histogram'
                    }
                ],
                scattergl: [
                    {
                        type: 'scattergl',
                        marker: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        }
                    }
                ],
                scatter3d: [
                    {
                        type: 'scatter3d',
                        line: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        },
                        marker: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        }
                    }
                ],
                scattermapbox: [
                    {
                        type: 'scattermapbox',
                        marker: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        }
                    }
                ],
                scatterternary: [
                    {
                        type: 'scatterternary',
                        marker: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        }
                    }
                ],
                scattercarpet: [
                    {
                        type: 'scattercarpet',
                        marker: {
                            colorbar: {
                                outlinewidth: 0,
                                ticks: ''
                            }
                        }
                    }
                ],
                carpet: [
                    {
                        aaxis: {
                            endlinecolor: '#2a3f5f',
                            gridcolor: 'white',
                            linecolor: 'white',
                            minorgridcolor: 'white',
                            startlinecolor: '#2a3f5f'
                        },
                        baxis: {
                            endlinecolor: '#2a3f5f',
                            gridcolor: 'white',
                            linecolor: 'white',
                            minorgridcolor: 'white',
                            startlinecolor: '#2a3f5f'
                        },
                        type: 'carpet'
                    }
                ],
                table: [
                    {
                        cells: {
                            fill: {
                                color: '#EBF0F8'
                            },
                            line: {
                                color: 'white'
                            }
                        },
                        header: {
                            fill: {
                                color: '#C8D4E3'
                            },
                            line: {
                                color: 'white'
                            }
                        },
                        type: 'table'
                    }
                ],
                barpolar: [
                    {
                        marker: {
                            line: {
                                color: '#E5ECF6',
                                width: 0.5
                            },
                            pattern: {
                                fillmode: 'overlay',
                                size: 10,
                                solidity: 0.2
                            }
                        },
                        type: 'barpolar'
                    }
                ],
                pie: [
                    {
                        automargin: true,
                        type: 'pie'
                    }
                ]
            },
            layout: {
                autotypenumbers: 'strict',
                colorway: [
                    '#636efa',
                    '#EF553B',
                    '#00cc96',
                    '#ab63fa',
                    '#FFA15A',
                    '#19d3f3',
                    '#FF6692',
                    '#B6E880',
                    '#FF97FF',
                    '#FECB52'
                ],
                font: {
                    color: '#2a3f5f'
                },
                hovermode: 'closest',
                hoverlabel: {
                    align: 'left'
                },
                paper_bgcolor: 'white',
                plot_bgcolor: '#E5ECF6',
                polar: {
                    bgcolor: '#E5ECF6',
                    angularaxis: {
                        gridcolor: 'white',
                        linecolor: 'white',
                        ticks: ''
                    },
                    radialaxis: {
                        gridcolor: 'white',
                        linecolor: 'white',
                        ticks: ''
                    }
                },
                ternary: {
                    bgcolor: '#E5ECF6',
                    aaxis: {
                        gridcolor: 'white',
                        linecolor: 'white',
                        ticks: ''
                    },
                    baxis: {
                        gridcolor: 'white',
                        linecolor: 'white',
                        ticks: ''
                    },
                    caxis: {
                        gridcolor: 'white',
                        linecolor: 'white',
                        ticks: ''
                    }
                },
                coloraxis: {
                    colorbar: {
                        outlinewidth: 0,
                        ticks: ''
                    }
                },
                colorscale: {
                    sequential: [
                        [0, '#0d0887'],
                        [0.1111111111111111, '#46039f'],
                        [0.2222222222222222, '#7201a8'],
                        [0.3333333333333333, '#9c179e'],
                        [0.4444444444444444, '#bd3786'],
                        [0.5555555555555556, '#d8576b'],
                        [0.6666666666666666, '#ed7953'],
                        [0.7777777777777778, '#fb9f3a'],
                        [0.8888888888888888, '#fdca26'],
                        [1, '#f0f921']
                    ],
                    sequentialminus: [
                        [0, '#0d0887'],
                        [0.1111111111111111, '#46039f'],
                        [0.2222222222222222, '#7201a8'],
                        [0.3333333333333333, '#9c179e'],
                        [0.4444444444444444, '#bd3786'],
                        [0.5555555555555556, '#d8576b'],
                        [0.6666666666666666, '#ed7953'],
                        [0.7777777777777778, '#fb9f3a'],
                        [0.8888888888888888, '#fdca26'],
                        [1, '#f0f921']
                    ],
                    diverging: [
                        [0, '#8e0152'],
                        [0.1, '#c51b7d'],
                        [0.2, '#de77ae'],
                        [0.3, '#f1b6da'],
                        [0.4, '#fde0ef'],
                        [0.5, '#f7f7f7'],
                        [0.6, '#e6f5d0'],
                        [0.7, '#b8e186'],
                        [0.8, '#7fbc41'],
                        [0.9, '#4d9221'],
                        [1, '#276419']
                    ]
                },
                xaxis: {
                    gridcolor: 'white',
                    linecolor: 'white',
                    ticks: '',
                    title: {
                        standoff: 15
                    },
                    zerolinecolor: 'white',
                    automargin: true,
                    zerolinewidth: 2
                },
                yaxis: {
                    gridcolor: 'white',
                    linecolor: 'white',
                    ticks: '',
                    title: {
                        standoff: 15
                    },
                    zerolinecolor: 'white',
                    automargin: true,
                    zerolinewidth: 2
                },
                scene: {
                    xaxis: {
                        backgroundcolor: '#E5ECF6',
                        gridcolor: 'white',
                        linecolor: 'white',
                        showbackground: true,
                        ticks: '',
                        zerolinecolor: 'white',
                        gridwidth: 2
                    },
                    yaxis: {
                        backgroundcolor: '#E5ECF6',
                        gridcolor: 'white',
                        linecolor: 'white',
                        showbackground: true,
                        ticks: '',
                        zerolinecolor: 'white',
                        gridwidth: 2
                    },
                    zaxis: {
                        backgroundcolor: '#E5ECF6',
                        gridcolor: 'white',
                        linecolor: 'white',
                        showbackground: true,
                        ticks: '',
                        zerolinecolor: 'white',
                        gridwidth: 2
                    }
                },
                shapedefaults: {
                    line: {
                        color: '#2a3f5f'
                    }
                },
                annotationdefaults: {
                    arrowcolor: '#2a3f5f',
                    arrowhead: 0,
                    arrowwidth: 1
                },
                geo: {
                    bgcolor: 'white',
                    landcolor: '#E5ECF6',
                    subunitcolor: 'white',
                    showland: true,
                    showlakes: true,
                    lakecolor: 'white'
                },
                title: {
                    x: 0.05
                },
                mapbox: {
                    style: 'light'
                }
            }
        },
        xaxis: {
            showticklabels: false,
            visible: false
        },
        yaxis: {
            showticklabels: false,
            visible: false
        }
    }
};

const options = {
    contextmenu: true,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: 'always',
    minimap: {
        enabled: true
    },
    scrollbar: {
        horizontalSliderSize: 2,
        verticalSliderSize: 4
    },
    selectOnLineNumbers: false,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true
};

const fixRules = [
    {
        rule: 'Customers who purchased starter kit from gardening category in the last 4 weeks',
        query: `Select count(distinct(customer_id)) \nas 'number of customer' from customer_data \nwhere Date >=DATEADD(week, -4, GETDATE())`
    },
    {
        rule: 'Identify customers who purchased at least $75 worth items from gardening category',
        query: `Select count(distinct(customer_id)) \nas 'number of customers' from filtered_customer_data \nwhere category = 'gardening' and purchase_value > 75`
    },
    {
        rule: 'Determine geographic split of these customers',
        query: `Select count(distinct(customer_id)) \nas 'number of customers' from filtered_customer_data \ngroup by region`
    },
    {
        rule: 'classify the customers based on purchases from NY, LA region in garedening category',
        query: `Select count(distinct(customer_id)) \nas 'number of customers' from filtered_customer_data \nwhere region='NY' and region='LA' and category ='gardening'`
    },
    {
        rule: 'Determine the percentage distribution of customers who would purchase  "Lawn Mover"',
        query: `Select count(distinct(customer_id)) \nas 'number of customers' from filtered_customer_data \nwhere category = 'gardening' and sub_category = 'Lawn mover'`
    }
];

const defaultKPIs = [
    {
        direction: 'up',
        directionColor: 'rgba(109, 240, 194, 1)',
        title: 'Audience Size',
        titleColor: '',
        value: '9.5 K',
        valueColor: '',
        subValue: '2.2% YoY',
        subValueColor: 'rgba(109, 240, 194, 1)'
    },
    {
        direction: 'up',
        directionColor: 'rgba(109, 240, 194, 1)',
        title: 'Purchase Propensity',
        titleColor: '',
        value: '9.5 K',
        valueColor: '',
        subValue: '2% YoY',
        subValueColor: 'rgba(109, 240, 194, 1)'
    },
    {
        direction: 'down',
        directionColor: '#FF0000',
        title: 'Average Basket Size',
        titleColor: '',
        value: '$1300',
        valueColor: '',
        subValue: '-2.2% YoY/S2',
        subValueColor: '#FF0000'
    },
    {
        direction: 'up',
        directionColor: 'rgba(109, 240, 194, 1)',
        title: 'Purchase Value',
        titleColor: '',
        value: '14.4M',
        valueColor: '',
        subValue: '2% YoY',
        subValueColor: 'rgba(109, 240, 194, 1)'
    }
];

export default function CustomAudienceForm({ params, ...props }) {
    //Material UI Styling
    const classes = useStyles(params);

    const [isEditForm, setIsEditForm] = useState(false);
    const [selectedID, setSelectedID] = useState('');
    const [audienceFormHeader, setAudienceFormHeader] = useState('');
    const [audienceNameInputValue, setAudienceNameInputValue] = useState('');
    const [isAudienceNameEditModeEnable, setAudienceNameEditModeEnable] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [rule, setRule] = useState('');
    const [query, setQuery] = useState('');
    const [editRule, setEditRule] = useState({ edit: false, rule: null });
    const [rules, setRules] = useState([]);
    const [kpis, setKpis] = useState(defaultKPIs);
    const [notification, setNotification] = React.useState();
    const [notificationOpen, setNotificationOpen] = React.useState();

    useEffect(() => {
        if (Object.keys(props.selectedItem).length > 0) {
            setIsEditForm(true);
            setSelectedID(props.selectedItem.id);
            setAudienceFormHeader(props.selectedItem.title);
            setAudienceNameInputValue(props.selectedItem.title);
            setSelectedImage(props.selectedItem.img);
            setRules(props.selectedItem.rules ? props.selectedItem.rules : []);
            if ('kpis' in props.selectedItem) setKpis(props.selectedItem.kpis);
        }
    }, [props.selectedItem]);

    const [isAddNewRuleDialogueOpen, setIsAddNewRuleDialogueOpen] = useState(false);

    const onBackClick = () => {
        props.handleIsFormOpen(false);
    };

    const handleEditAudienceName = (type) => {
        if (type === 'edit') {
            setAudienceNameEditModeEnable(true);
        } else if (type === 'check') {
            setAudienceNameEditModeEnable(false);
            setAudienceFormHeader(audienceNameInputValue);
        } else if (type === 'close') {
            setAudienceNameEditModeEnable(false);
            setAudienceNameInputValue(audienceFormHeader);
        }
    };

    const handleAudienceName = (e) => {
        setAudienceNameInputValue(e.target.value);
    };

    const handleAddNewRuleDialogue = () => {
        setIsAddNewRuleDialogueOpen(!isAddNewRuleDialogueOpen);
        setRule('');
        setQuery('');
    };
    const addNewRule = () => {
        if (rule.trim() === '' || query.trim() === '') return;
        setRules([...rules, { id: Math.random(), rule, query }]);
        handleAddNewRuleDialogue();
        setNotification({ message: 'Added new Rule successfully' });
        setNotificationOpen(true);
    };

    const handleEditRule = (ruleRow) => {
        setRule(ruleRow.rule);
        setQuery(ruleRow.query);
        setIsAddNewRuleDialogueOpen(true);
        setEditRule({ edit: true, rule: ruleRow });
    };
    const updateRule = () => {
        const selectedRule = rules.find((el) => el.id === editRule.rule.id);
        selectedRule.query = query;
        selectedRule.rule = rule;
        setRules([...rules]);
        setEditRule({ edit: false, rule: null });
        handleAddNewRuleDialogue();
        setNotification({ message: 'Updated Rule successfully' });
        setNotificationOpen(true);
    };
    const deleteRule = (rule) => {
        setRules([...rules.filter((el) => el.id !== rule.id)]);
        setNotification({ message: 'Deleted Rule successfully' });
        setNotificationOpen(true);
    };

    const handleSubmit = () => {
        if (audienceNameInputValue && selectedImage) {
            let obj = {
                title: audienceNameInputValue,
                subtitle: props?.selectedItem?.subtitle
                    ? props?.selectedItem?.subtitle
                    : '10 Rates Applied',
                audienceSizeValue: props?.selectedItem?.audienceSizeValue
                    ? props?.selectedItem?.audienceSizeValue
                    : '9.5K',
                purchaseProspensityValue: props?.selectedItem?.purchaseProspensityValue
                    ? props?.selectedItem?.purchaseProspensityValue
                    : '9.5K',
                averageBasketValue: props?.selectedItem?.averageBasketValue
                    ? props?.selectedItem?.averageBasketValue
                    : '$1300',
                purchaseVlaue: props?.selectedItem?.purchaseVlaue
                    ? props?.selectedItem?.purchaseVlaue
                    : '$10.4M',
                img: selectedImage,
                rules: rules
            };
            if (selectedID) obj.id = selectedID;
            props.addUpdateData(obj, isEditForm);
        }
    };

    const handleGenerateQuery = (inputValue) => {
        let obj = fixRules.find((el) => el.rule === inputValue);
        setQuery(obj.query);
    };

    return (
        <div className={classes.root}>
            {/* Header Start */}
            <div className={classes.formHeaderContainer}>
                <ArrowBackIosOutlinedIcon onClick={onBackClick} className={classes.headerIcon} />
                <p className={classes.formHeader}>
                    {isEditForm ? audienceFormHeader : 'Create Custom Audience'}
                </p>
                {/* <PersonOutlinedIcon className={classes.userProfileLogo} /> */}
            </div>
            {/* Header End */}
            {/* Title Input Start */}
            <div className={classes.formFirstLayer}>
                <div className={classes.audienceNameFieldContainer}>
                    <div className={classes.audienceNameLabelContainer}>
                        <Typography className={classes.audienceNameLabel}>Audience Name</Typography>
                        <Typography className={classes.labelRequiredSign}>*</Typography>
                    </div>
                    {isAudienceNameEditModeEnable || !isEditForm ? (
                        <div className={classes.audienceNameWithEdit}>
                            <input
                                className={classes.audienceNameInput}
                                id="audienceNameInput"
                                onChange={handleAudienceName}
                                value={audienceNameInputValue}
                                placeholder={!isEditForm ? 'Add Audience Name' : ''}
                            />
                            {isEditForm ? (
                                <React.Fragment>
                                    <CheckIcon
                                        onClick={() => handleEditAudienceName('check')}
                                        className={classes.audienceNameCheckIcon}
                                    />
                                    <CloseIcon
                                        onClick={() => handleEditAudienceName('close')}
                                        className={classes.audienceNameCloseIcon}
                                    />
                                </React.Fragment>
                            ) : (
                                ''
                            )}
                        </div>
                    ) : (
                        <div className={classes.audienceNameWithEdit}>
                            <Typography className={classes.audienceName}>
                                {audienceNameInputValue}
                            </Typography>
                            <EditIcon
                                onClick={() => handleEditAudienceName('edit')}
                                className={classes.audienceNameEditIcon}
                            />
                        </div>
                    )}
                </div>
                <div className={classes.analyseAudienceContainer}>
                    <ShowChartIcon className={classes.analyseAudienceIcon} />
                    <Typography className={classes.analyseAudienceLabel}>
                        Analyse Audience
                    </Typography>
                </div>
            </div>
            {/* Title Input End */}
            {/* Image Section Start */}
            <div className={classes.imageSectionContainer}>
                <div className={classes.imageUploadBox}>
                    {/* Upload Image */}
                    {selectedImage ? (
                        <div className={classes.imageContainer}>
                            <img
                                className={classes.imageView}
                                src={
                                    typeof selectedImage === 'object'
                                        ? URL.createObjectURL(selectedImage)
                                        : selectedImage
                                }
                                alt="not found"
                            />
                            <br />
                            <CloseIcon
                                className={classes.imageRemoveIcon}
                                fontSize="large"
                                onClick={() => setSelectedImage(null)}
                            />
                        </div>
                    ) : (
                        <>
                            <input
                                type="file"
                                name="myImage"
                                id="image"
                                style={{ display: 'none' }}
                                onChange={(event) => {
                                    setSelectedImage(URL.createObjectURL(event.target.files[0]));
                                }}
                            />
                            <label for="image" style={{ cursor: 'pointer' }}>
                                Upload Image
                            </label>
                        </>
                    )}
                </div>
            </div>
            {/* Image Section Start */}
            {/* KPI Section Start */}
            {rules.length > 0 && isEditForm && (
                <div className={classes.kpiLayerContainer}>
                    <div className={classes.kpiHeaderContainer}>
                        <Typography className={classes.kpiHeader}>
                            Based On Rules Applied
                        </Typography>
                        <div className={classes.downloadReportContainer}>
                            <GetAppIcon className={classes.downloadReportIcon} />
                            <Typography className={classes.analyseAudienceLabel}>
                                Download Report
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.kpiContainer}>
                        {kpis.map((el, i) => (
                            <div className={classes.kpiCard} key={'kpi' + el.title + i}>
                                <div className={classes.kpiCardLeftSection}>
                                    <div className={classes.kpiCardTitle}>
                                        <Typography
                                            style={{
                                                fontSize: '2rem',
                                                color: el.titleColor ? el.titleColor : ''
                                            }}
                                        >
                                            {el.title}
                                        </Typography>
                                    </div>
                                    <div className={classes.kpiCardValue}>
                                        <div className={classes.kpiCardValueDirection}>
                                            {el.direction === 'up' ? (
                                                <ArrowUpwardIcon
                                                    className={classes.kpiCardValueDirectionIcon}
                                                    style={{
                                                        color: el.directionColor
                                                            ? el.directionColor
                                                            : ''
                                                    }}
                                                />
                                            ) : (
                                                <ArrowDownwardIcon
                                                    className={classes.kpiCardValueDirectionIcon}
                                                    style={{
                                                        color: el.directionColor
                                                            ? el.directionColor
                                                            : ''
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className={classes.kpiCardValueText}>
                                            <Typography
                                                style={{
                                                    fontSize: '3rem',
                                                    color: el.valueColor ? el.valueColor : ''
                                                }}
                                            >
                                                {el.value}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className={classes.kpiCardSubValue}>
                                        <Typography
                                            style={{
                                                backgroundColor: 'rgba(109, 240, 194, 0.2)',
                                                color: el.subValueColor
                                                    ? el.subValueColor
                                                    : 'rgba(109, 240, 194, 1)',
                                                fontSize: '2rem'
                                            }}
                                        >
                                            {el.subValue}
                                        </Typography>
                                    </div>
                                </div>
                                <div className={classes.kpiCardRightSection}>
                                    <AppWidgetPlot
                                        params={graphData}
                                        // size_nooverride={config.size_nooverride}
                                        // color_nooverride={config.color_nooverride}
                                        // trace_config={config.traces}
                                        // showDialog={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* KPI Section End */}
            {/* Rules Section Start */}
            <div className={classes.rulesLayerContainer}>
                <Typography className={classes.kpiHeader}>Applied Rules</Typography>
                <div className={classes.ruleContainer}>
                    {rules.length > 0 ? (
                        <div className={classes.newRulesTableContainer}>
                            <Grid container xs={12} direction="column">
                                <Grid
                                    container
                                    xs={12}
                                    id="heading"
                                    direction="row"
                                    className={classes.heading}
                                >
                                    <Grid item xs={2}>
                                        Sl.NO
                                    </Grid>
                                    <Grid item xs={8}>
                                        Rule
                                    </Grid>
                                    <Grid item xs={2}>
                                        Actions
                                    </Grid>
                                </Grid>
                                {rules.map((el, i) => (
                                    <Grid
                                        container
                                        xs={12}
                                        id="body"
                                        direction="row"
                                        className={classes.body}
                                        justifyContent="center"
                                        alignItems="center"
                                        key={'rule' + i}
                                    >
                                        <Grid item xs={2}>
                                            {i + 1}
                                        </Grid>
                                        <Grid item xs={8}>
                                            {el.rule}
                                        </Grid>
                                        <Grid
                                            container
                                            item
                                            xs={2}
                                            direction="row"
                                            justifyContent="flex-start"
                                        >
                                            <Grid item xs={1} onClick={() => handleEditRule(el, i)}>
                                                <CreateIcon className={classes.actionEditIcon} />
                                            </Grid>
                                            <Grid item xs={1} onClick={() => deleteRule(el, i)}>
                                                <DeleteIcon className={classes.actionIcon} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid
                                    container
                                    xs={6}
                                    id="footer"
                                    className={classes.footer}
                                    alignItems="center"
                                    onClick={handleAddNewRuleDialogue}
                                >
                                    <AddCircleOutlineIcon className={classes.addRuleIcon} />
                                    Add New Rule
                                </Grid>
                            </Grid>
                        </div>
                    ) : (
                        <div className={classes.emptyRuleBox}>
                            <Typography className={classes.emptyRuleText}>
                                It seems like you have not added any Rule yet.
                            </Typography>
                            <div
                                className={classes.addNewRuleButtonContainer}
                                onClick={handleAddNewRuleDialogue}
                            >
                                <AddCircleOutlineIcon className={classes.addNewRuleIcon} />
                                <Typography className={classes.addNewRuleText}>
                                    Add New Rule
                                </Typography>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Rules Section End */}
            {/* Submit Button Start */}
            <div className={classes.submitButtonContainer}>
                <button
                    className={classes.submitButton}
                    style={{
                        backgroundColor: audienceNameInputValue && selectedImage ? '#6DF0C2' : ''
                    }}
                    onClick={handleSubmit}
                >
                    Generate Custom Audience
                </button>
            </div>
            {/* Submit Button End */}
            {/* Rule Add/Update Dialogue Start */}
            <Dialog
                open={isAddNewRuleDialogueOpen}
                classes={{
                    paper: classes.dialogPaper
                }}
                onClose={handleAddNewRuleDialogue}
                aria-labelledby="custom-audience-form-title"
                aria-describedby="custom-audience-form-content"
            >
                <DialogTitle id="custom-audience-form-title">Add Rule</DialogTitle>
                <DialogContent style={{ padding: '2rem' }} id="custom-audience-form-content">
                    <Grid container direction="column" spacing={3}>
                        <Grid
                            container
                            item
                            xs={12}
                            direction="row"
                            className={classes.DialogTitle}
                        >
                            <Grid item xs={2}>
                                Customer Audience Name
                            </Grid>
                            <Grid item xs={10}>
                                {audienceNameInputValue}
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} direction="row" alignItems="center">
                            <Grid item xs={2} className={classes.inputLabel}>
                                Rule
                            </Grid>
                            <Grid item xs={10} style={{ position: 'relative' }}>
                                {/* <input
                                    className={classes.input}
                                    placeholder="Add your text"
                                    value={rule}
                                    onChange={(e) => setRule(e.target.value)}
                                />
                                <div
                                    className={classes.sendIcon}
                                    onClick={() => handleGenerateQuery(rule)}
                                >
                                    <SendPromptIcon
                                        height={20}
                                        width={20}
                                        color={'#6DF0C2'}
                                        className={classes.sendIcon}
                                    />
                                </div> */}
                                <Select
                                    value={rule}
                                    onChange={(e) => {
                                        setRule(e.target.value);
                                        handleGenerateQuery(e.target.value);
                                    }}
                                    displayEmpty
                                    defaultValue={rule}
                                    className={classes.input}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value="" disabled>
                                        Add your text
                                    </MenuItem>
                                    {fixRules.map((el, i) => (
                                        <MenuItem key={i} value={el.rule}>
                                            {el.rule}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={2}></Grid>
                            <Grid xs={10}>
                                <Editor
                                    key={'code_editor'}
                                    width="100%"
                                    height="40rem"
                                    language="sql"
                                    options={options}
                                    theme={
                                        localStorage.getItem('codx-products-theme', 'dark') ===
                                        'dark'
                                            ? 'vs-dark'
                                            : 'vs'
                                    }
                                    onChange={(value) => setQuery(value)}
                                    value={query}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.DialogActionContainer}>
                    <Button
                        variant="outlined"
                        onClick={handleAddNewRuleDialogue}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => (editRule.edit ? updateRule() : addNewRule())}
                        aria-label="Apply"
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Rule Add/Update Dialogue End */}
            {/* Snackbar Start */}
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
                link={notification?.link}
            />
            {/* Snackbar End */}
        </div>
    );
}
