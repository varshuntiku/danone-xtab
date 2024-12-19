import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { triggerActionHandler } from '../../../services/screen';
import clsx from 'clsx';
import { Grid, Paper } from '@material-ui/core';
import Widget from '../../Widget';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content'
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120
    },
    formControlLabel: {
        marginTop: theme.spacing(1)
    },
    dialogWrapper: {
        '& .MuiDialogContent-root': {
            // background: theme.palette.primary.main,
        }
    },
    dialogPaper: {
        background: theme.palette.primary.light
    },
    title: {
        fontSize: theme.spacing(3.5),
        letterSpacing: '1.5px',
        color: theme.palette.text.titleText,
        opacity: '0.8'
    },
    closeButton: {
        // position: 'absolute',
        // right: theme.spacing(1),
        // top: theme.spacing(1),
        // color: theme.palette.grey[500],
        float: 'right'
    },
    triggerButton: {},
    autoHeight: {
        height: 'max-content'
    },
    widgetWrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem'
    },
    fixedHeight: {
        height: '350px'
    },
    widgetTitle: {
        color: theme.palette.text.default,
        textTransform: 'uppercase'
    }
}));

export function WidgetListModal({ screen_id, app_id, params, action_type }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState();

    React.useEffect(() => {
        if (params.fetch_on_load) {
            triggerActionHandler({
                screen_id,
                app_id,
                payload: {
                    action_type,
                    params: null,
                    filter_state: JSON.parse(
                        sessionStorage.getItem('app_screen_filter_info_' + app_id + '_' + screen_id)
                    )
                },
                callback: (d) => {
                    setData(d);
                }
            });
        }
    }, [action_type, app_id, params.fetch_on_load, screen_id]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getItem = (item) => {
        switch (item?.type) {
            case 'widget':
                return <Widget data={item.data} />;
            default:
                if (item?.data) {
                    return <Widget data={item.data} />;
                } else {
                    return null;
                }
        }
    };

    return (
        <React.Fragment>
            <Button
                size="small"
                variant={params?.trigger_button?.variant || 'outlined'}
                className={clsx(params?.trigger_button?.class_name, classes.triggerButton)}
                onClick={handleClickOpen}
                startIcon={params?.trigger_button?.start_icon}
                aria-label="Open dialog"
            >
                {params?.trigger_button?.text || 'Click'}
            </Button>
            <Dialog
                className={classes.dialogWrapper}
                fullWidth={true}
                maxWidth={'md'}
                open={open}
                onClose={handleClose}
                aria-labelledby="widgte-list-dialog-title"
                fullScreen={true}
                classes={{
                    paper: classes.dialogPaper
                }}
                aria-describedby="widget-list-dialog-content"
            >
                <DialogTitle id="widget-list-dialog-title" onClose={handleClose}>
                    {params?.dialog?.title || 'Form'}
                </DialogTitle>
                <DialogContent id="widget-list-dialog-content">
                    <Grid container spacing={2}>
                        {data?.items?.map((item, i) => (
                            <Grid xs={12} {...item?.grid} item key={i}>
                                <Paper
                                    className={clsx(
                                        item?.autoHeight ? classes.autoHeight : classes.fixedHeight,
                                        classes.widgetWrapper
                                    )}
                                >
                                    <Typography variant="h4" className={classes.widgetTitle}>
                                        {item?.title}
                                    </Typography>
                                    <div style={{ flex: 1 }}>{getItem(item)}</div>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

const DialogTitle = (props) => {
    const classes = useStyles();
    const { children, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography {...other}>
            <Typography variant="h6" className={classes.title}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onClose}
                        title="close"
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                ) : null}
            </Typography>
        </MuiDialogTitle>
    );
};

// const Data = {
//     items: [
//         {
//             grid: {xs: 6},
//             title: "Plot test title here",
//             data: {
//                 data: [
//                     {
//                       "direction": "clockwise",
//                       "hole": 0.55,
//                       "labels": [
//                         "Market Share",
//                         "<span style=\"color: white\">-</span>"
//                       ],
//                       "marker": {
//                         "colors": [
//                           "#5faff9",
//                           "#fff"
//                         ],
//                         "line": {
//                           "color": "white",
//                           "width": 1
//                         }
//                       },
//                       "sort": false,
//                       "textinfo": "none",
//                       "textposition": "none",
//                       "type": "pie",
//                       "values": [
//                         32,
//                         68
//                       ]
//                     },
//                     {
//                       "direction": "clockwise",
//                       "hole": 0.7,
//                       "labels": [
//                         "Served Available Market",
//                         "<span style=\"color: white\">-</span>"
//                       ],
//                       "marker": {
//                         "colors": [
//                           "#e08244",
//                           "#fff"
//                         ],
//                         "line": {
//                           "color": "white",
//                           "width": 1
//                         }
//                       },
//                       "sort": false,
//                       "textinfo": "none",
//                       "textposition": "none",
//                       "type": "pie",
//                       "values": [
//                         76,
//                         24
//                       ]
//                     },
//                     {
//                       "direction": "clockwise",
//                       "hole": 0.85,
//                       "labels": [
//                         "Total Addressable Market",
//                         "<span style=\"color: white\">-</span>"
//                       ],
//                       "marker": {
//                         "colors": [
//                           "#3a3a3a",
//                           "#fff"
//                         ],
//                         "line": {
//                           "color": "white",
//                           "width": 1
//                         }
//                       },
//                       "sort": false,
//                       "textinfo": "none",
//                       "textposition": "none",
//                       "type": "pie",
//                       "values": [
//                         100,
//                         0
//                       ]
//                     }
//                 ],
//                 layout: {
//                     "legend": {
//                         "traceorder": "reversed"
//                     },
//                     "template": {
//                         "data": {
//                             "bar": [
//                                 {
//                                     "error_x": {
//                                         "color": "#2a3f5f"
//                                     },
//                                     "error_y": {
//                                         "color": "#2a3f5f"
//                                     },
//                                     "marker": {
//                                         "line": {
//                                             "color": "#E5ECF6",
//                                             "width": 0.5
//                                         }
//                                     },
//                                     "type": "bar"
//                                 }
//                             ],
//                             "barpolar": [
//                                 {
//                                     "marker": {
//                                         "line": {
//                                             "color": "#E5ECF6",
//                                             "width": 0.5
//                                         }
//                                     },
//                                     "type": "barpolar"
//                                 }
//                             ],
//                             "carpet": [
//                                 {
//                                     "aaxis": {
//                                         "endlinecolor": "#2a3f5f",
//                                         "gridcolor": "white",
//                                         "linecolor": "white",
//                                         "minorgridcolor": "white",
//                                         "startlinecolor": "#2a3f5f"
//                                     },
//                                     "baxis": {
//                                         "endlinecolor": "#2a3f5f",
//                                         "gridcolor": "white",
//                                         "linecolor": "white",
//                                         "minorgridcolor": "white",
//                                         "startlinecolor": "#2a3f5f"
//                                     },
//                                     "type": "carpet"
//                                 }
//                             ],
//                             "choropleth": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "type": "choropleth"
//                                 }
//                             ],
//                             "contour": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "contour"
//                                 }
//                             ],
//                             "contourcarpet": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "type": "contourcarpet"
//                                 }
//                             ],
//                             "heatmap": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "heatmap"
//                                 }
//                             ],
//                             "heatmapgl": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "heatmapgl"
//                                 }
//                             ],
//                             "histogram": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "histogram"
//                                 }
//                             ],
//                             "histogram2d": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "histogram2d"
//                                 }
//                             ],
//                             "histogram2dcontour": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "histogram2dcontour"
//                                 }
//                             ],
//                             "mesh3d": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "type": "mesh3d"
//                                 }
//                             ],
//                             "parcoords": [
//                                 {
//                                     "line": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "parcoords"
//                                 }
//                             ],
//                             "pie": [
//                                 {
//                                     "automargin": true,
//                                     "type": "pie"
//                                 }
//                             ],
//                             "scatter": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatter"
//                                 }
//                             ],
//                             "scatter3d": [
//                                 {
//                                     "line": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatter3d"
//                                 }
//                             ],
//                             "scattercarpet": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scattercarpet"
//                                 }
//                             ],
//                             "scattergeo": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scattergeo"
//                                 }
//                             ],
//                             "scattergl": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scattergl"
//                                 }
//                             ],
//                             "scattermapbox": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scattermapbox"
//                                 }
//                             ],
//                             "scatterpolar": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatterpolar"
//                                 }
//                             ],
//                             "scatterpolargl": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatterpolargl"
//                                 }
//                             ],
//                             "scatterternary": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatterternary"
//                                 }
//                             ],
//                             "surface": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "surface"
//                                 }
//                             ],
//                             "table": [
//                                 {
//                                     "cells": {
//                                         "fill": {
//                                             "color": "#EBF0F8"
//                                         },
//                                         "line": {
//                                             "color": "white"
//                                         }
//                                     },
//                                     "header": {
//                                         "fill": {
//                                             "color": "#C8D4E3"
//                                         },
//                                         "line": {
//                                             "color": "white"
//                                         }
//                                     },
//                                     "type": "table"
//                                 }
//                             ]
//                         },
//                         "layout": {
//                             "annotationdefaults": {
//                                 "arrowcolor": "#2a3f5f",
//                                 "arrowhead": 0,
//                                 "arrowwidth": 1
//                             },
//                             "coloraxis": {
//                                 "colorbar": {
//                                     "outlinewidth": 0,
//                                     "ticks": ""
//                                 }
//                             },
//                             "colorscale": {
//                                 "diverging": [
//                                     [
//                                         0,
//                                         "#8e0152"
//                                     ],
//                                     [
//                                         0.1,
//                                         "#c51b7d"
//                                     ],
//                                     [
//                                         0.2,
//                                         "#de77ae"
//                                     ],
//                                     [
//                                         0.3,
//                                         "#f1b6da"
//                                     ],
//                                     [
//                                         0.4,
//                                         "#fde0ef"
//                                     ],
//                                     [
//                                         0.5,
//                                         "#f7f7f7"
//                                     ],
//                                     [
//                                         0.6,
//                                         "#e6f5d0"
//                                     ],
//                                     [
//                                         0.7,
//                                         "#b8e186"
//                                     ],
//                                     [
//                                         0.8,
//                                         "#7fbc41"
//                                     ],
//                                     [
//                                         0.9,
//                                         "#4d9221"
//                                     ],
//                                     [
//                                         1,
//                                         "#276419"
//                                     ]
//                                 ],
//                                 "sequential": [
//                                     [
//                                         0,
//                                         "#0d0887"
//                                     ],
//                                     [
//                                         0.1111111111111111,
//                                         "#46039f"
//                                     ],
//                                     [
//                                         0.2222222222222222,
//                                         "#7201a8"
//                                     ],
//                                     [
//                                         0.3333333333333333,
//                                         "#9c179e"
//                                     ],
//                                     [
//                                         0.4444444444444444,
//                                         "#bd3786"
//                                     ],
//                                     [
//                                         0.5555555555555556,
//                                         "#d8576b"
//                                     ],
//                                     [
//                                         0.6666666666666666,
//                                         "#ed7953"
//                                     ],
//                                     [
//                                         0.7777777777777778,
//                                         "#fb9f3a"
//                                     ],
//                                     [
//                                         0.8888888888888888,
//                                         "#fdca26"
//                                     ],
//                                     [
//                                         1,
//                                         "#f0f921"
//                                     ]
//                                 ],
//                                 "sequentialminus": [
//                                     [
//                                         0,
//                                         "#0d0887"
//                                     ],
//                                     [
//                                         0.1111111111111111,
//                                         "#46039f"
//                                     ],
//                                     [
//                                         0.2222222222222222,
//                                         "#7201a8"
//                                     ],
//                                     [
//                                         0.3333333333333333,
//                                         "#9c179e"
//                                     ],
//                                     [
//                                         0.4444444444444444,
//                                         "#bd3786"
//                                     ],
//                                     [
//                                         0.5555555555555556,
//                                         "#d8576b"
//                                     ],
//                                     [
//                                         0.6666666666666666,
//                                         "#ed7953"
//                                     ],
//                                     [
//                                         0.7777777777777778,
//                                         "#fb9f3a"
//                                     ],
//                                     [
//                                         0.8888888888888888,
//                                         "#fdca26"
//                                     ],
//                                     [
//                                         1,
//                                         "#f0f921"
//                                     ]
//                                 ]
//                             },
//                             "colorway": [
//                                 "#636efa",
//                                 "#EF553B",
//                                 "#00cc96",
//                                 "#ab63fa",
//                                 "#FFA15A",
//                                 "#19d3f3",
//                                 "#FF6692",
//                                 "#B6E880",
//                                 "#FF97FF",
//                                 "#FECB52"
//                             ],
//                             "font": {
//                                 "color": "#2a3f5f"
//                             },
//                             "geo": {
//                                 "bgcolor": "white",
//                                 "lakecolor": "white",
//                                 "landcolor": "#E5ECF6",
//                                 "showlakes": true,
//                                 "showland": true,
//                                 "subunitcolor": "white"
//                             },
//                             "hoverlabel": {
//                                 "align": "left"
//                             },
//                             "hovermode": "closest",
//                             "mapbox": {
//                                 "style": "light"
//                             },
//                             "paper_bgcolor": "white",
//                             "plot_bgcolor": "#E5ECF6",
//                             "polar": {
//                                 "angularaxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 },
//                                 "bgcolor": "#E5ECF6",
//                                 "radialaxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 }
//                             },
//                             "scene": {
//                                 "xaxis": {
//                                     "backgroundcolor": "#E5ECF6",
//                                     "gridcolor": "white",
//                                     "gridwidth": 2,
//                                     "linecolor": "white",
//                                     "showbackground": true,
//                                     "ticks": "",
//                                     "zerolinecolor": "white"
//                                 },
//                                 "yaxis": {
//                                     "backgroundcolor": "#E5ECF6",
//                                     "gridcolor": "white",
//                                     "gridwidth": 2,
//                                     "linecolor": "white",
//                                     "showbackground": true,
//                                     "ticks": "",
//                                     "zerolinecolor": "white"
//                                 },
//                                 "zaxis": {
//                                     "backgroundcolor": "#E5ECF6",
//                                     "gridcolor": "white",
//                                     "gridwidth": 2,
//                                     "linecolor": "white",
//                                     "showbackground": true,
//                                     "ticks": "",
//                                     "zerolinecolor": "white"
//                                 }
//                             },
//                             "shapedefaults": {
//                                 "line": {
//                                     "color": "#2a3f5f"
//                                 }
//                             },
//                             "ternary": {
//                                 "aaxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 },
//                                 "baxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 },
//                                 "bgcolor": "#E5ECF6",
//                                 "caxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 }
//                             },
//                             "title": {
//                                 "x": 0.05
//                             },
//                             "xaxis": {
//                                 "automargin": true,
//                                 "gridcolor": "white",
//                                 "linecolor": "white",
//                                 "ticks": "",
//                                 "title": {
//                                     "standoff": 15
//                                 },
//                                 "zerolinecolor": "white",
//                                 "zerolinewidth": 2
//                             },
//                             "yaxis": {
//                                 "automargin": true,
//                                 "gridcolor": "white",
//                                 "linecolor": "white",
//                                 "ticks": "",
//                                 "title": {
//                                     "standoff": 15
//                                 },
//                                 "zerolinecolor": "white",
//                                 "zerolinewidth": 2
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         {
//             grid: {xs: 6},
//             data: {
//                 data: [
//                     {
//                       "direction": "clockwise",
//                       "hole": 0.55,
//                       "labels": [
//                         "Market Share",
//                         "<span style=\"color: white\">-</span>"
//                       ],
//                       "marker": {
//                         "colors": [
//                           "#5faff9",
//                           "#fff"
//                         ],
//                         "line": {
//                           "color": "white",
//                           "width": 1
//                         }
//                       },
//                       "sort": false,
//                       "textinfo": "none",
//                       "textposition": "none",
//                       "type": "pie",
//                       "values": [
//                         32,
//                         68
//                       ]
//                     },
//                     {
//                       "direction": "clockwise",
//                       "hole": 0.7,
//                       "labels": [
//                         "Served Available Market",
//                         "<span style=\"color: white\">-</span>"
//                       ],
//                       "marker": {
//                         "colors": [
//                           "#e08244",
//                           "#fff"
//                         ],
//                         "line": {
//                           "color": "white",
//                           "width": 1
//                         }
//                       },
//                       "sort": false,
//                       "textinfo": "none",
//                       "textposition": "none",
//                       "type": "pie",
//                       "values": [
//                         76,
//                         24
//                       ]
//                     },
//                     {
//                       "direction": "clockwise",
//                       "hole": 0.85,
//                       "labels": [
//                         "Total Addressable Market",
//                         "<span style=\"color: white\">-</span>"
//                       ],
//                       "marker": {
//                         "colors": [
//                           "#3a3a3a",
//                           "#fff"
//                         ],
//                         "line": {
//                           "color": "white",
//                           "width": 1
//                         }
//                       },
//                       "sort": false,
//                       "textinfo": "none",
//                       "textposition": "none",
//                       "type": "pie",
//                       "values": [
//                         100,
//                         0
//                       ]
//                     }
//                 ],
//                 layout: {
//                     "legend": {
//                         "traceorder": "reversed"
//                     },
//                     "template": {
//                         "data": {
//                             "bar": [
//                                 {
//                                     "error_x": {
//                                         "color": "#2a3f5f"
//                                     },
//                                     "error_y": {
//                                         "color": "#2a3f5f"
//                                     },
//                                     "marker": {
//                                         "line": {
//                                             "color": "#E5ECF6",
//                                             "width": 0.5
//                                         }
//                                     },
//                                     "type": "bar"
//                                 }
//                             ],
//                             "barpolar": [
//                                 {
//                                     "marker": {
//                                         "line": {
//                                             "color": "#E5ECF6",
//                                             "width": 0.5
//                                         }
//                                     },
//                                     "type": "barpolar"
//                                 }
//                             ],
//                             "carpet": [
//                                 {
//                                     "aaxis": {
//                                         "endlinecolor": "#2a3f5f",
//                                         "gridcolor": "white",
//                                         "linecolor": "white",
//                                         "minorgridcolor": "white",
//                                         "startlinecolor": "#2a3f5f"
//                                     },
//                                     "baxis": {
//                                         "endlinecolor": "#2a3f5f",
//                                         "gridcolor": "white",
//                                         "linecolor": "white",
//                                         "minorgridcolor": "white",
//                                         "startlinecolor": "#2a3f5f"
//                                     },
//                                     "type": "carpet"
//                                 }
//                             ],
//                             "choropleth": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "type": "choropleth"
//                                 }
//                             ],
//                             "contour": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "contour"
//                                 }
//                             ],
//                             "contourcarpet": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "type": "contourcarpet"
//                                 }
//                             ],
//                             "heatmap": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "heatmap"
//                                 }
//                             ],
//                             "heatmapgl": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "heatmapgl"
//                                 }
//                             ],
//                             "histogram": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "histogram"
//                                 }
//                             ],
//                             "histogram2d": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "histogram2d"
//                                 }
//                             ],
//                             "histogram2dcontour": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "histogram2dcontour"
//                                 }
//                             ],
//                             "mesh3d": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "type": "mesh3d"
//                                 }
//                             ],
//                             "parcoords": [
//                                 {
//                                     "line": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "parcoords"
//                                 }
//                             ],
//                             "pie": [
//                                 {
//                                     "automargin": true,
//                                     "type": "pie"
//                                 }
//                             ],
//                             "scatter": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatter"
//                                 }
//                             ],
//                             "scatter3d": [
//                                 {
//                                     "line": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatter3d"
//                                 }
//                             ],
//                             "scattercarpet": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scattercarpet"
//                                 }
//                             ],
//                             "scattergeo": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scattergeo"
//                                 }
//                             ],
//                             "scattergl": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scattergl"
//                                 }
//                             ],
//                             "scattermapbox": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scattermapbox"
//                                 }
//                             ],
//                             "scatterpolar": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatterpolar"
//                                 }
//                             ],
//                             "scatterpolargl": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatterpolargl"
//                                 }
//                             ],
//                             "scatterternary": [
//                                 {
//                                     "marker": {
//                                         "colorbar": {
//                                             "outlinewidth": 0,
//                                             "ticks": ""
//                                         }
//                                     },
//                                     "type": "scatterternary"
//                                 }
//                             ],
//                             "surface": [
//                                 {
//                                     "colorbar": {
//                                         "outlinewidth": 0,
//                                         "ticks": ""
//                                     },
//                                     "colorscale": [
//                                         [
//                                             0,
//                                             "#0d0887"
//                                         ],
//                                         [
//                                             0.1111111111111111,
//                                             "#46039f"
//                                         ],
//                                         [
//                                             0.2222222222222222,
//                                             "#7201a8"
//                                         ],
//                                         [
//                                             0.3333333333333333,
//                                             "#9c179e"
//                                         ],
//                                         [
//                                             0.4444444444444444,
//                                             "#bd3786"
//                                         ],
//                                         [
//                                             0.5555555555555556,
//                                             "#d8576b"
//                                         ],
//                                         [
//                                             0.6666666666666666,
//                                             "#ed7953"
//                                         ],
//                                         [
//                                             0.7777777777777778,
//                                             "#fb9f3a"
//                                         ],
//                                         [
//                                             0.8888888888888888,
//                                             "#fdca26"
//                                         ],
//                                         [
//                                             1,
//                                             "#f0f921"
//                                         ]
//                                     ],
//                                     "type": "surface"
//                                 }
//                             ],
//                             "table": [
//                                 {
//                                     "cells": {
//                                         "fill": {
//                                             "color": "#EBF0F8"
//                                         },
//                                         "line": {
//                                             "color": "white"
//                                         }
//                                     },
//                                     "header": {
//                                         "fill": {
//                                             "color": "#C8D4E3"
//                                         },
//                                         "line": {
//                                             "color": "white"
//                                         }
//                                     },
//                                     "type": "table"
//                                 }
//                             ]
//                         },
//                         "layout": {
//                             "annotationdefaults": {
//                                 "arrowcolor": "#2a3f5f",
//                                 "arrowhead": 0,
//                                 "arrowwidth": 1
//                             },
//                             "coloraxis": {
//                                 "colorbar": {
//                                     "outlinewidth": 0,
//                                     "ticks": ""
//                                 }
//                             },
//                             "colorscale": {
//                                 "diverging": [
//                                     [
//                                         0,
//                                         "#8e0152"
//                                     ],
//                                     [
//                                         0.1,
//                                         "#c51b7d"
//                                     ],
//                                     [
//                                         0.2,
//                                         "#de77ae"
//                                     ],
//                                     [
//                                         0.3,
//                                         "#f1b6da"
//                                     ],
//                                     [
//                                         0.4,
//                                         "#fde0ef"
//                                     ],
//                                     [
//                                         0.5,
//                                         "#f7f7f7"
//                                     ],
//                                     [
//                                         0.6,
//                                         "#e6f5d0"
//                                     ],
//                                     [
//                                         0.7,
//                                         "#b8e186"
//                                     ],
//                                     [
//                                         0.8,
//                                         "#7fbc41"
//                                     ],
//                                     [
//                                         0.9,
//                                         "#4d9221"
//                                     ],
//                                     [
//                                         1,
//                                         "#276419"
//                                     ]
//                                 ],
//                                 "sequential": [
//                                     [
//                                         0,
//                                         "#0d0887"
//                                     ],
//                                     [
//                                         0.1111111111111111,
//                                         "#46039f"
//                                     ],
//                                     [
//                                         0.2222222222222222,
//                                         "#7201a8"
//                                     ],
//                                     [
//                                         0.3333333333333333,
//                                         "#9c179e"
//                                     ],
//                                     [
//                                         0.4444444444444444,
//                                         "#bd3786"
//                                     ],
//                                     [
//                                         0.5555555555555556,
//                                         "#d8576b"
//                                     ],
//                                     [
//                                         0.6666666666666666,
//                                         "#ed7953"
//                                     ],
//                                     [
//                                         0.7777777777777778,
//                                         "#fb9f3a"
//                                     ],
//                                     [
//                                         0.8888888888888888,
//                                         "#fdca26"
//                                     ],
//                                     [
//                                         1,
//                                         "#f0f921"
//                                     ]
//                                 ],
//                                 "sequentialminus": [
//                                     [
//                                         0,
//                                         "#0d0887"
//                                     ],
//                                     [
//                                         0.1111111111111111,
//                                         "#46039f"
//                                     ],
//                                     [
//                                         0.2222222222222222,
//                                         "#7201a8"
//                                     ],
//                                     [
//                                         0.3333333333333333,
//                                         "#9c179e"
//                                     ],
//                                     [
//                                         0.4444444444444444,
//                                         "#bd3786"
//                                     ],
//                                     [
//                                         0.5555555555555556,
//                                         "#d8576b"
//                                     ],
//                                     [
//                                         0.6666666666666666,
//                                         "#ed7953"
//                                     ],
//                                     [
//                                         0.7777777777777778,
//                                         "#fb9f3a"
//                                     ],
//                                     [
//                                         0.8888888888888888,
//                                         "#fdca26"
//                                     ],
//                                     [
//                                         1,
//                                         "#f0f921"
//                                     ]
//                                 ]
//                             },
//                             "colorway": [
//                                 "#636efa",
//                                 "#EF553B",
//                                 "#00cc96",
//                                 "#ab63fa",
//                                 "#FFA15A",
//                                 "#19d3f3",
//                                 "#FF6692",
//                                 "#B6E880",
//                                 "#FF97FF",
//                                 "#FECB52"
//                             ],
//                             "font": {
//                                 "color": "#2a3f5f"
//                             },
//                             "geo": {
//                                 "bgcolor": "white",
//                                 "lakecolor": "white",
//                                 "landcolor": "#E5ECF6",
//                                 "showlakes": true,
//                                 "showland": true,
//                                 "subunitcolor": "white"
//                             },
//                             "hoverlabel": {
//                                 "align": "left"
//                             },
//                             "hovermode": "closest",
//                             "mapbox": {
//                                 "style": "light"
//                             },
//                             "paper_bgcolor": "white",
//                             "plot_bgcolor": "#E5ECF6",
//                             "polar": {
//                                 "angularaxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 },
//                                 "bgcolor": "#E5ECF6",
//                                 "radialaxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 }
//                             },
//                             "scene": {
//                                 "xaxis": {
//                                     "backgroundcolor": "#E5ECF6",
//                                     "gridcolor": "white",
//                                     "gridwidth": 2,
//                                     "linecolor": "white",
//                                     "showbackground": true,
//                                     "ticks": "",
//                                     "zerolinecolor": "white"
//                                 },
//                                 "yaxis": {
//                                     "backgroundcolor": "#E5ECF6",
//                                     "gridcolor": "white",
//                                     "gridwidth": 2,
//                                     "linecolor": "white",
//                                     "showbackground": true,
//                                     "ticks": "",
//                                     "zerolinecolor": "white"
//                                 },
//                                 "zaxis": {
//                                     "backgroundcolor": "#E5ECF6",
//                                     "gridcolor": "white",
//                                     "gridwidth": 2,
//                                     "linecolor": "white",
//                                     "showbackground": true,
//                                     "ticks": "",
//                                     "zerolinecolor": "white"
//                                 }
//                             },
//                             "shapedefaults": {
//                                 "line": {
//                                     "color": "#2a3f5f"
//                                 }
//                             },
//                             "ternary": {
//                                 "aaxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 },
//                                 "baxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 },
//                                 "bgcolor": "#E5ECF6",
//                                 "caxis": {
//                                     "gridcolor": "white",
//                                     "linecolor": "white",
//                                     "ticks": ""
//                                 }
//                             },
//                             "title": {
//                                 "x": 0.05
//                             },
//                             "xaxis": {
//                                 "automargin": true,
//                                 "gridcolor": "white",
//                                 "linecolor": "white",
//                                 "ticks": "",
//                                 "title": {
//                                     "standoff": 15
//                                 },
//                                 "zerolinecolor": "white",
//                                 "zerolinewidth": 2
//                             },
//                             "yaxis": {
//                                 "automargin": true,
//                                 "gridcolor": "white",
//                                 "linecolor": "white",
//                                 "ticks": "",
//                                 "title": {
//                                     "standoff": 15
//                                 },
//                                 "zerolinecolor": "white",
//                                 "zerolinewidth": 2
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     ]
// }
