import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import appWidgetPowerBIStyle from 'assets/jss/appWidgetPowerBIStyle.jsx';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import { getEmbedData } from 'services/powerbi_apis.js';
import { Slider } from '@material-ui/core';
import { AddOutlined, RemoveOutlined } from '@material-ui/icons';
import CustomSnackbar from 'components/CustomSnackbar.jsx';

const styles = (theme) => ({
    ...appWidgetPowerBIStyle(theme),
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
    zoomControls: {
        gap: '4px',
        bottom: 10,
        left: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        cursor: 'pointer',
        position: 'sticky',
        marginRight: '3px'
    },
    zoominandout: {
        fontSize: '2rem'
    },
    slider: {
        padding: '0px !important',
        color: '#220047', // Customize the slider's color
        height: 9, // Increased height of the slider track
        width: 90,
        top: '4.3px', // Width of the slider
        '& .MuiSlider-track': {
            height: 3,
            backgroundColor: '#220047'
        },
        '& .MuiSlider-thumb': {
            height: 15, // Increased size of the thumb
            width: 7,
            borderRadius: '10%',
            backgroundColor: '#220047',
            border: '0.5px solid #220047', // Add a border to the thumb
            '&:hover': {
                backgroundColor: '#220047'
            }
        },
        '& .MuiSlider-rail': {
            backgroundColor: '#220047'
        }
    }
});

class AppWidgetPowerBI extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            islogin:false,
            embedUrl: false,
            loading: true,
            datasetId: false,
            accessToken: false,
            notificationOpen:false,
           notification:{},
            zoomLevel: 0.75 // Default zoom level
            // selectedCountry: 'Mexico', // Default selected country
            // countries: ['Mexico', 'USA', 'Canada', 'UK', 'Russia'] // Sample countries
        };
    }

    componentDidMount() {
        const { workspaceId, reportId } = this.props.params;
        getEmbedData({
            workspaceId: workspaceId,
            reportId: reportId,
            callback: this.onResponseGetEmbedURL
        });

        window.addEventListener('resize', this.handleWindowResize);
    }

    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.handleWindowResize);
    // }

    handleWindowResize = () => {
        this.setState({ loading: true }, () => {
            this.reloadReport();
        });
    };

    reloadReport = () => {
        const { workspaceId, reportId, previewCallback } = this.props.params;
        if (previewCallback) {
            this.report.getActivePage().then((activePage) => {
                activePage.getVisuals().then((visuals) => {
                    previewCallback(visuals);
                });
            });
        }
        getEmbedData({
            workspaceId: workspaceId,
            reportId: reportId,
            callback: this.onResponseGetEmbedURL
        });
    };

    onResponseGetEmbedURL = (response_data) => {
        if (response_data.status==='error') {
            this.setState({ islogin: true ,
                notificationOpen: true,
                notification: {
                    message: 'Login failed. Please check your credentials.',
                    severity: 'error',
                    autoHideDuration: 3000
                }
            });
        }
        else{
        this.setState({
            loading: false,
            datasetId: response_data['datasetId'],
            embedUrl: response_data['embedUrl'],
            accessToken: response_data['accessToken']
        });}
    };

    onReportLoad = async () => {
        const { previewCallback, selected_filters, screen_filters_values } = this.props;

        if (previewCallback) {
            this.report.getActivePage().then((activePage) => {
                activePage.getVisuals().then((visuals) => {
                    previewCallback(visuals);
                });
            });
        }

        try {
            const filtersArray = [];

            const tableNames = screen_filters_values.table_name || [];

            screen_filters_values.dataValues.forEach((item, index) => {
                const columnKey = item.widget_tag_key;
                const filterValue = selected_filters[columnKey];

                const tableName = tableNames[index];

                if (filterValue) {
                    const filter = {
                        $schema: 'http://powerbi.com/product/schema#basic',
                        target: {
                            table: tableName,
                            column: columnKey
                        },
                        operator: 'In',
                        values: Array.isArray(filterValue) ? filterValue : [filterValue]
                    };

                    filtersArray.push(filter);
                } else {
                    console.warn('No filter value found for widget key: ${columnKey}');
                }
            });

            if (filtersArray.length > 0) {
                await this.report.updateFilters(models.FiltersOperations.ReplaceAll, filtersArray);
            } else {
                console.warn('No valid filters to apply.');
            }
        } catch (errors) {
            console.error('Error replacing filters: ', errors);
        }

        this.setZoomLevel(this.state.zoomLevel);
    };

    setZoomLevel = (zoomLevel) => {
        if (this.report) {
            this.report
                .setZoom(zoomLevel)
                .then(() => this.setState({ zoomLevel }))
                .catch((error) => console.log('Error setting zoom level:', error));
        }
    };

    incrementZoom = () => {
        const newZoomLevel = Math.min(this.state.zoomLevel + 0.05, 1);
        this.setZoomLevel(newZoomLevel);
    };

    decrementZoom = () => {
        const newZoomLevel = Math.max(this.state.zoomLevel - 0.05, 0.1);
        this.setZoomLevel(newZoomLevel);
    };

    handleZoomLevelChange = (event, newValue) => {
        this.setZoomLevel(newValue / 100);
    };

    render() {
        const { classes, params, previewCallback } = this.props;
const{islogin}=this.state

        let embedType = 'report';

if (params.pageName && params.visualName) {
    if (params.pageName !== 'undefined' && params.visualName !== 'undefined') {
        embedType = 'visual';
    }
}
        const width =
            params.pageName === 'undefined' || params.visualName === 'undefined' ? '100%' : '';
        const height =
            params.pageName === 'undefined' || params.visualName === 'undefined' ? '100%' : '';

        return (
            <>
            {islogin &&
                        (

                                <CustomSnackbar
                                        open={
                                            this.state.notificationOpen && this.state.notification?.message
                                                ? true
                                                : false
                                        }
                                        autoHideDuration={
                                            this.state.notification?.autoHideDuration === undefined
                                                ? 3000
                                                : this.state.notification?.autoHideDuration
                                        }
                                        onClose={() => this.setState({ notificationOpen: false })}
                                        severity={this.state.notification?.severity || 'error'}
                                        message={this.state.notification?.message}
                                    />

                        )}
                {this.state.loading ? (
                    previewCallback ? (
                        ''
                    ) : (
                        <CodxCircularLoader size={30} center />
                    )
                ) : (
                    <div
                        className={
                            previewCallback ? classes.reportHiddenContainer : classes.container
                        }
                    >

                        <PowerBIEmbed
                            embedConfig={{
                                type: embedType,
                                id: params.reportId,
                                accessToken: this.state.accessToken,
                                embedUrl: this.state.embedUrl,
                                tokenType: models.TokenType.Aad,
                                width: width,
                                height: height,
                                settings: {
                                    background: models.BackgroundType.Transparent,
                                    layoutType: models.LayoutType.MobileLandscape,
                                    zoomLevel: this.state.zoomLevel,
                                    panes: {
                                        filters: {
                                            expandable: false,
                                            visible: false
                                        }
                                    }
                                },

                                pageName: params.pageName,
                                visualName: params.visualName
                            }}
                            eventHandlers={
                                new Map([
                                    [
                                        'loaded',
                                        () => {
                                            console.log('Report loaded');
                                            this.onReportLoad();
                                        }
                                    ],
                                    [
                                        'rendered',
                                        () => {
                                            console.log('Report rendered');
                                        }
                                    ],
                                    ['error', (event) => console.log(event.detail)],
                                    ['visualClicked', () => console.log('visual clicked')],
                                    ['pageChanged', (event) => console.log(event)]
                                ])
                            }
                            cssClassName={
                                previewCallback
                                    ? classes.reportHiddenContainer
                                    : classes.reportContainer
                            }
                            getEmbeddedComponent={(embeddedReport) => {
                                this.report = embeddedReport;
                            }}
                        />
                        <div
                            className={
                                previewCallback
                                    ? classes.reportHiddenContainer
                                    : classes.zoomControls
                            }
                        >
                            <RemoveOutlined
                                className={
                                    previewCallback
                                        ? classes.reportHiddenContainer
                                        : classes.zoominandout
                                }
                                onClick={this.decrementZoom}
                                aria-label="decrease zoom"
                            />
                            <Slider
                                className={classes.slider}
                                size="small"
                                value={this.state.zoomLevel ? this.state.zoomLevel * 100 : 100}
                                onChange={this.handleZoomLevelChange}
                                aria-labelledby="zoom-slider"
                                min={10}
                                max={200}
                                step={1}
                                marks
                            />
                            <AddOutlined
                                className={
                                    previewCallback
                                        ? classes.reportHiddenContainer
                                        : classes.zoominandout
                                }
                                onClick={this.incrementZoom}
                                aria-label="increase zoom"
                            />
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default withStyles(styles, { useTheme: true })(AppWidgetPowerBI);
