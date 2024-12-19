import React, { Component } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { TextField, Button, Typography, Card, Grid, IconButton } from '@material-ui/core';
import createPlotlyComponent from 'react-plotly.js/factory';
import ReportDetailsStyle from 'assets/jss/reportDetailsStyle.jsx';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { withStyles } from '@material-ui/core/styles';
import { ArrowBackIos } from '@material-ui/icons';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';
import Snackbar from '@material-ui/core/Snackbar';
import PreviewStories from 'layouts/PreviewReports.jsx';
import LinearProgressBar from 'components/LinearProgressBar.jsx';

import { ReactComponent as ShareIcon } from 'assets/img/share.svg';
import { ReactComponent as DownloadIcon } from 'assets/img/download.svg';
import { ReactComponent as DeleteIcon } from 'assets/img/delete.svg';

import { getStory, updateStory } from 'services/reports.js';

// let _ = require("underscore");
// const Plotly = window.Plotly;
// const Plot = createPlotlyComponent(Plotly);

let text_color = '#ffffff';
let background_color = '#091f3a';
var local_storage_theme = localStorage.getItem('codx-products-theme');
if (!local_storage_theme) {
    local_storage_theme = 'dark';
}
if (local_storage_theme === 'dark') {
    text_color = '#ffffff';
    background_color = '#091f3a';
} else {
    text_color = '#000000';
    background_color = '#ffffff';
}

var thumbnail_layout = {
    showlegend: false,

    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    },
    plot_bgcolor: background_color,
    paper_bgcolor: background_color,
    xaxis: {
        autorange: true,
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false
    },
    yaxis: {
        autorange: true,
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false
    }
};

function Thumbnail(props) {
    const vis_data = JSON.parse(props.data);
    const Plot = createPlotlyComponent(window.Plotly);
    return (
        <Card>
            <CardContent>
                <Plot
                    data={vis_data.data}
                    config={{ displayModeBar: false, staticPlot: true, scrollZoom: true }}
                    className={props.classes.thumbnailPlot}
                    layout={thumbnail_layout}
                    useResizeHandler={true}
                />
            </CardContent>
        </Card>
    );
}
class ReportDetails extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            activeIndex: 0,
            story_data: '',
            undoHistory: null,
            updateStatus: false,
            open: true,
            loading: true,
            previewStories: false,
            reportDetailsModel: {
                update: [],
                delete: [],
                add: []
            }
        };
    }

    componentDidMount() {
        getStory({
            story_id: this.props.match.params.story_id,
            callback: this.onResponseGetStory
        });
    }

    onResponseGetStory = (response_data) => {
        this.setState({
            story_data: response_data,
            loading: false
        });
    };

    deletecharts = (e, index, content_id) => {
        e.stopPropagation();
        var story_data = { ...this.state.story_data };
        var reportDetailsModel = { ...this.state.reportDetailsModel };
        delete story_data.content[content_id];
        reportDetailsModel.delete.push(content_id);

        if (!this.state.undoHistory) {
            this.setState({ undoHistory: this.state.story_data });
        }

        this.setState({
            story_data: story_data,
            reportDetailsModel: reportDetailsModel
        });
    };

    getRequestPayload = () => {
        return {
            email: localStorage.getItem('user_email_id'),
            story_id: this.state.story_data.story_id,
            app_id: this.state.story_data.app_id,
            name: this.state.story_data.name,
            description: this.state.story_data.description,
            update: [],
            delete: [...this.state.reportDetailsModel.delete],
            add: []
        };
    };

    onResponseupdateStory = () => {
        this.setState({
            updateStatus: true,
            undoHistory: null,
            reportDetailsModel: {
                update: [],
                delete: [],
                add: []
            }
        });
    };

    revertChanges = () => {
        if (this.state.undoHistory) {
            this.setState({
                story_data: this.state.undoHistory,
                undoHistory: null
            });
        }
    };

    updateStoryData = () => {
        var payload = this.getRequestPayload();

        updateStory({
            payload: payload,
            callback: this.onResponseupdateStory
        });
    };

    handleOnClickThumbnail = (index) => {
        this.setState({
            activeIndex: index
        });
    };

    goBack = () => {
        this.props.history.goBack();
    };

    renderPreviewReports = () => {
        this.setState({
            previewStories: true
        });
    };

    closeRenderedPreviewReports = () => {
        this.setState({
            previewStories: false
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.state.loading ? (
                    <LinearProgressBar />
                ) : (
                    <div>
                        {this.state.story_data ? (
                            <div>
                                <div className={classes.navbar}>
                                    <IconButton
                                        aria-label="ArrowBackIos"
                                        className={classes.alignLeft}
                                        onClick={() => this.goBack()}
                                    >
                                        <ArrowBackIos className={classes.backIcon} />
                                    </IconButton>
                                    <Typography className={classes.pageTitle} variant="h3">
                                        {this.state.story_data.name}
                                    </Typography>
                                    <div className={classes.alignRight}>
                                        <Button
                                            aria-label="save"
                                            className={classes.navButtons}
                                            onClick={() => this.updateStoryData()}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            aria-label="undo"
                                            className={classes.navButtons}
                                            onClick={() => this.revertChanges()}
                                        >
                                            Undo
                                        </Button>
                                        <Button
                                            aria-label="preview"
                                            className={classes.navButtons}
                                            onClick={() => this.renderPreviewReports()}
                                        >
                                            Preview Story
                                        </Button>
                                        <span className={classes.icons}>
                                            <DownloadIcon className={classes.navIcons} />
                                            <ShareIcon className={classes.navIcons} />
                                        </span>
                                    </div>
                                </div>
                                <div className={classes.main}>
                                    <Grid container className={classes.root} spacing={3}>
                                        <Grid item xs={2}>
                                            <div className={classes.thumbnail}>
                                                <GridList cellHeight={'100%'} cols={1}>
                                                    {Object.values(
                                                        this.state.story_data.content
                                                    ).map((tile, index) => (
                                                        <GridListTile
                                                            aria-label="thumbnail"
                                                            key={index}
                                                            cols={1}
                                                            onClick={() =>
                                                                this.handleOnClickThumbnail(index)
                                                            }
                                                            className={
                                                                index === this.state.activeIndex
                                                                    ? classes.active
                                                                    : ''
                                                            }
                                                        >
                                                            <GridListTileBar
                                                                title={tile.name}
                                                                titlePosition="top"
                                                                actionIcon={
                                                                    <IconButton
                                                                        className={
                                                                            classes.deleteIcon
                                                                        }
                                                                        onClick={(event) =>
                                                                            this.deletecharts(
                                                                                event,
                                                                                index,
                                                                                tile.content_id
                                                                            )
                                                                        }
                                                                        aria-label="Delete"
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                }
                                                                actionPosition="right"
                                                                className={classes.titleBar}
                                                            />
                                                            <Thumbnail
                                                                data={tile.value}
                                                                {...this.props}
                                                            />
                                                        </GridListTile>
                                                    ))}
                                                </GridList>
                                            </div>
                                        </Grid>

                                        <Grid item xs={7}>
                                            <Card className={classes.slideContent}>
                                                <CardHeader
                                                    className={classes.cardheadingtext}
                                                    title={
                                                        this.state.story_data.content[
                                                            this.state.activeIndex
                                                        ]?.name
                                                    }
                                                />
                                                <div className={classes.cardMetaData}>
                                                    {Object.keys(
                                                        this.state.story_data.content[
                                                            this.state.activeIndex
                                                        ]?.metadata || {}
                                                    ).map((keyName, i) => (
                                                        <div
                                                            key={'cardMetaData' + i}
                                                            className={
                                                                classes.filterOptionContainer
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    classes.filterOptionHeader
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="inherit"
                                                                    noWrap
                                                                >
                                                                    {keyName + ' : '}
                                                                </Typography>
                                                            </span>
                                                            <span
                                                                className={
                                                                    classes.filterOptionValue
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="inherit"
                                                                    noWrap
                                                                >
                                                                    {
                                                                        this.state.story_data
                                                                            .content[
                                                                            this.state.activeIndex
                                                                        ].metadata[keyName]
                                                                    }
                                                                </Typography>
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <CardContent>
                                                    <AppWidgetPlot
                                                        params={JSON.parse(
                                                            this.state.story_data.content[
                                                                this.state.activeIndex
                                                            ]?.value || null
                                                        )}
                                                        graph_height={'half'}
                                                        size_nooverride={false}
                                                        color_nooverride={false}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={3}
                                            key={3}
                                            className={classes.reportDescription}
                                        >
                                            <Typography
                                                className={classes.headingtext}
                                                variant="h2"
                                            >
                                                {'Name:'}
                                            </Typography>
                                            <TextField
                                                value={
                                                    this.state.story_data.content[
                                                        this.state.activeIndex
                                                    ]?.name
                                                }
                                                disabled
                                                variant="outlined"
                                                inputProps={{
                                                    style: {
                                                        color: text_color,
                                                        fontSize: '13px'
                                                    }
                                                }}
                                                id="name"
                                            />
                                            <hr />
                                            <Typography
                                                className={classes.headingtext}
                                                variant="h2"
                                            >
                                                {'Header:'}
                                            </Typography>
                                            <TextField
                                                disabled
                                                multiline
                                                fullWidth="true"
                                                size="large"
                                                value={
                                                    this.state.story_data.content[
                                                        this.state.activeIndex
                                                    ]?.description['header']
                                                }
                                                inputProps={{
                                                    style: {
                                                        height: '100px',
                                                        padding: '10px',
                                                        fontSize: '13px',
                                                        color: text_color
                                                    }
                                                }}
                                                id="header"
                                            />
                                            <hr />
                                            <Typography
                                                className={classes.headingtext}
                                                variant="h2"
                                            >
                                                {'Footer:'}
                                            </Typography>
                                            <TextField
                                                disabled
                                                multiline
                                                fullWidth="true"
                                                size="large"
                                                value={
                                                    this.state.story_data.content[
                                                        this.state.activeIndex
                                                    ]?.description['footer']
                                                }
                                                inputProps={{
                                                    style: {
                                                        height: '100px',
                                                        padding: '10px',
                                                        fontSize: '13px',
                                                        color: text_color
                                                    }
                                                }}
                                                id="footer"
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {'This Story has no content to display. Please add contents!'}
                            </div>
                        )}
                    </div>
                )}
                {this.state.updateStatus ? (
                    <Snackbar
                        autoHideDuration={2000}
                        open={this.state.open}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                        }}
                        message={'Updated Successfully'}
                        onClose={() => this.setState({ open: false })}
                    />
                ) : null}

                {this.state.story_data && this.state.previewStories ? (
                    <PreviewStories
                        {...this.props}
                        story_data={this.state.story_data}
                        onClose={this.closeRenderedPreviewReports}
                    ></PreviewStories>
                ) : null}
            </div>
        );
    }
}

export default withStyles(
    (theme) => ({
        ...ReportDetailsStyle(theme)
    }),
    { withTheme: true }
)(ReportDetails);
