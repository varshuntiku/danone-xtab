import React, { lazy, Suspense, createContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import appScreenStyle from 'assets/jss/appScreenStyle.jsx';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { getWidgets, getScreenFilterValues, getScreenConfig } from 'services/screen.js';
import AppWidgetLabel from 'components/AppWidgetLabel.jsx';
import AppScreenFilters from 'components/AppScreenFilters.jsx';
import AppWidgetMultiSelectFilters from './AppWidgetMultiSelect/AppWidgetMultiSelect';
import { create_slug } from 'services/app.js';
import AppWidgetComponent from './AppWidgetComponent';
import ScreenActionsComponent from './screenActionsComponent/ScreenActionsComponent';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
    setScreenId,
    setActiveScreenId,
    getScreenWidgets,
    getGraphData,
    setActiveScreenWidgets,
    setActiveScreenDetails,
    setProgressBarDetails,
    setCurrentFilters,
    setFiltersUpdateStatus,
    setScreenLevelFilterState,
    setUpdatedWidgetsIds
} from 'store/index';
import { getFiltersById } from 'services/comments';
import CodxCircularLoader from './CodxCircularLoader';
import AppUserMessage from './AppUserMessage';
import { getFinalFilterObj } from '../util';
import IconButton from '@material-ui/core/IconButton';
const VideoJS = lazy(() => import('components/videojsStreamer.jsx'));
const ScreenStepper = lazy(() => import('./ScreenStepper'));
import StepperProgressBar from 'components/StepperProgressBar';
import { getProgressBar } from '../services/app';
// import AppScreenSocket from './AppScreenSocket';

import * as _ from 'underscore';
import SavedScenarioPopup from './SavedScenarioPopup';
import SavedScenariosPopup from './simulators/SavedScenariosPopup';

export const SavedScenarioContext = createContext();

class AppScreen extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.captureRef = React.createRef();
        this.scrollRef = React.createRef();
        const first_level_slug =
            props.match && props.match.params.first_level_slug
                ? props.match.params.first_level_slug
                : false;
        const second_level_slug =
            props.match && props.match.params.second_level_slug
                ? props.match.params.second_level_slug
                : false;
        const third_level_slug =
            props.match && props.match.params.third_level_slug
                ? props.match.params.third_level_slug
                : false;

        let screen_id = false;
        let screen_name = false;
        let preview_screen_id = this.props.preview_screen_id;
        let found_screen;
        if (preview_screen_id) {
            found_screen = props.app_info.screens.find(
                (screen) => parseInt(screen.id) === parseInt(preview_screen_id)
            );
        } else {
            let current_first_level = false;
            let current_second_level = false;
            const screens = this.props.appScreens?.length
                ? this.props.appScreens
                : this.props.app_info.screens;
            found_screen = _.find(screens, function (screen) {
                if (!screen.hidden) {
                    if (!screen.level) {
                        current_first_level = screen;
                        current_second_level = false;
                        return (
                            create_slug(screen.screen_name) === first_level_slug &&
                            !second_level_slug &&
                            !third_level_slug
                        );
                    } else if (screen.level === 1) {
                        current_second_level = screen;
                        return (
                            create_slug(current_first_level.screen_name) === first_level_slug &&
                            create_slug(current_second_level.screen_name) === second_level_slug &&
                            !third_level_slug
                        );
                    } else if (screen.level === 2 || screen.level === 3) {
                        return (
                            create_slug(current_first_level.screen_name) === first_level_slug &&
                            (current_second_level
                                ? create_slug(current_second_level.screen_name) ===
                                  second_level_slug
                                : true) &&
                            (current_second_level
                                ? create_slug(screen.screen_name) === third_level_slug
                                : create_slug(screen.screen_name) === second_level_slug)
                        );
                    }
                }
            });

        }
        if (found_screen) {
            console.log()
            screen_id = found_screen.id;
            screen_name = found_screen.screen_name;
            this.props.setActiveScreenDetails(found_screen);
        }

        this.state = {
            app_id: props.app_info && props.app_info.id ? props.app_info.id : false,
            screen_id: screen_id,
            screen_name: screen_name,
            screen_filters_values: false,
            selected_screen: found_screen,
            widgets: false,
            selected_filters: false,
            show_simulator: false,
            simulator_details: false,
            simulator_apply: false,
            loading: false,
            auto_refresh: found_screen?.screen_auto_refresh,
            action_settings: found_screen?.action_settings,
            alert_enable: props.app_info.modules?.alerts,
            data_items: [],
            stepperScreens: props?.stepperScreens?.[screen_id] || [],
            toggleCheck: false,
            notificationOpen: false,
            notification: null,
            filtersUpdated: false,
            simulatorTrigger: false,
            isPopupOpen: false,
            savedPopupParams: [],
            isSavedScenarioPopup: false,
            savedScenariosPopupParams: [],
            stepper_actions_completed: [],
            screen_navigation_data: [],
            isEditing: false,
            selectedScenario: null,
            scenerioname: null,
            edit: false,
            compareScenario:'',
            isKpiExpanded: true,
            currentIndex: 0,
            perSectionExpandStatus: [],
            currentScreenConfig: null
        };
    }
    setIsEditingParent = (isEditing) => {
        this.setState({ isEditing });
    };

    setCompareScenario = (value) => {
        this.setState({ compareScenario: value })
    }
    updateEditingFields = (isEditing, selectedScenario, scenerioname) => {
        this.setState({
            isEditing,
            selectedScenario,
            scenerioname
        });
    };
    openPopup = (params) => {
        this.setState({
            isPopupOpen: true,
            savedPopupParams: params
        });
    };

    openSavedScenarioPopup = (params, linkedScreen = false) => {
        this.setState({
            isSavedScenarioPopup: true,
            savedScenariosPopupParams: params,
            linkedScreenScenario: linkedScreen
        });
        this.props.shouldOpenLibraryHandler(true,false);
    };

    closePopup = (params) => {
        this.setState({ isPopupOpen: false, edit: params });
    };


    closeSavedScenarioPopup = () => {
        this.setState({ isSavedScenarioPopup: false })
        this.props.shouldOpenLibraryHandler(false);

    };

    downloadAsPDF = () => {
        const element = this.captureRef.current;
        const { theme } = this.props;
        if (element) {
            const originalOverflow = element.style.overflow;
            const originalBackgroundColor = element.style.backgroundColor;
            const originalChildOverflows = [];
            const hideChildScrollbars = (el) => {
                Array.from(el.children).forEach((child) => {
                    const computedStyle = window.getComputedStyle(child);
                    originalChildOverflows.push({
                        child,
                        overflowX: child.style.overflowX,
                        overflowY: child.style.overflowY
                    });
                    if (
                        computedStyle.overflowX === 'scroll' ||
                        computedStyle.overflowX === 'auto'
                    ) {
                        child.style.overflowX = 'hidden';
                    }
                    if (
                        computedStyle.overflowY === 'scroll' ||
                        computedStyle.overflowY === 'auto'
                    ) {
                        child.style.overflowY = 'hidden';
                    }
                    hideChildScrollbars(child);
                });
            };

            element.style.overflow = 'hidden';

            const scrollTop = element.scrollTop;
            const scrollLeft = element.scrollLeft;
            hideChildScrollbars(element);

            const contentWidth = element.scrollWidth;
            const contentHeight = element.scrollHeight;

            const backgroundColor = theme.palette.background.pureWhite;
            element.style.backgroundColor = backgroundColor;

            toPng(element, {
                bgcolor: backgroundColor,
                cacheBust: true,
                width: contentWidth,
                height: contentHeight,
                skipFonts: true
            })
                .then((imgData) => {
                    const pdf = new jsPDF('landscape', 'mm', 'a4');
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();

                    const scaleX = pageWidth / contentWidth;
                    const scaleY = pageHeight / contentHeight;
                    const scaleFactor = Math.min(scaleX, scaleY);

                    const imgWidth = contentWidth * scaleFactor;
                    const imgHeight = contentHeight * scaleFactor;

                    const marginX = (pageWidth - imgWidth) / 2;
                    const marginY = (pageHeight - imgHeight) / 4;

                    pdf.addImage(imgData, 'PNG', marginX, marginY, imgWidth, imgHeight);
                    pdf.save('ScreenContent.pdf');
                })
                .catch(() => {
                    return new Error('Error capturing the content as PDF');
                })
                .finally(() => {
                    element.style.overflow = originalOverflow;
                    element.style.backgroundColor = originalBackgroundColor;
                    originalChildOverflows.forEach(({ child, overflowX, overflowY }) => {
                        child.style.overflowX = overflowX;
                        child.style.overflowY = overflowY;
                    });

                    element.scrollTop = scrollTop;
                    element.scrollLeft = scrollLeft;
                });
        } else {
            return new Error('Element not found for capturing!');
        }
    };

    downloadAsPNG = () => {
        const element = this.captureRef.current;
        const { theme } = this.props;
        if (element) {
            const originalOverflow = element.style.overflow;
            const originalBackgroundColor = element.style.backgroundColor;
            const originalChildOverflows = [];

            const hideChildScrollbars = (el) => {
                Array.from(el.children).forEach((child) => {
                    const computedStyle = window.getComputedStyle(child);

                    originalChildOverflows.push({
                        child,
                        overflowX: child.style.overflowX,
                        overflowY: child.style.overflowY
                    });

                    if (
                        computedStyle.overflowX === 'scroll' ||
                        computedStyle.overflowX === 'auto'
                    ) {
                        child.style.overflowX = 'hidden';
                    }
                    if (
                        computedStyle.overflowY === 'scroll' ||
                        computedStyle.overflowY === 'auto'
                    ) {
                        child.style.overflowY = 'hidden';
                    }

                    hideChildScrollbars(child);
                });
            };

            element.style.overflow = 'hidden';
            hideChildScrollbars(element);
            const backgroundColor = theme.palette.background.pureWhite;
            element.style.backgroundColor = backgroundColor;

            toPng(element, {
                bgcolor: backgroundColor,
                quality: 1,
                width: element.scrollWidth,
                height: element.scrollHeight,
                pixelRatio: window.devicePixelRatio,
                skipFonts: true
            })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'ScreenContent.png';
                    link.click();
                })
                .catch(() => {
                    return new Error('Error capturing the content as PNG');
                })
                .finally(() => {
                    element.style.overflow = originalOverflow;
                    element.style.backgroundColor = originalBackgroundColor;
                    originalChildOverflows.forEach(({ child, overflowX, overflowY }) => {
                        child.style.overflowX = overflowX;
                        child.style.overflowY = overflowY;
                    });
                });
        } else {
            return new Error('Element not found for capturing!');
        }
    };

    componentDidMount() {
        this.updateZoomRatio();
        window.addEventListener('resize', this.updateZoomRatio);
        if (this.props.setGPTinfo) {
            this.props.setGPTinfo(this.state.screen_id, this.state.data_items);
        }

        this.props.setScreenId(this.state.screen_id);
        this.props.setActiveScreenId(this.state.screen_id);
        this.props?.setActiveStep &&
            this.props.setActiveStep(
                this.state?.stepperScreens?.findIndex(
                    (item) => item?.id === this.state.screen_id
                ) || 0
            );
        if (!this.props.navigator) {
            this.refreshScreenData();
        } else {
            this.getAllWidgetData();
        }
        const isFilter =
            this.props.app_info.modules &&
            this.props.app_info.modules.filters &&
            this.state.screen_id;
        this.props?.setFilterValue && this.props.setFilterValue(isFilter ? { isFilter } : {});
        this.state.app_id &&
            this.state.screen_id &&
            getProgressBar({
                app_id: this.state.app_id,
                screen_id: this.state.screen_id,
                callback: (data) => {
                    this.props.setProgressBarDetails({
                        ...this.props.progressBarDetails,
                        [this.state.screen_id]: { ...data, loading: !!data?.loading }
                    });
                }
            });
        const screens = this.props.appScreens?.length
            ? this.props.appScreens
            : this.props.app_info.screens;
        const currentScreenConfig = _.find(
            screens,
            function (screen) {
                return screen.id === parseInt(this.state.screen_id);
            },
            this
        );
        const perSectionExpandStatus = currentScreenConfig?.per_section_collapse?.includes('0')
            ? currentScreenConfig?.per_section_collapse
                  ?.split('-')
                  .map((status) => (status === '1' ? false : true))
            : currentScreenConfig?.per_section_collapse
                  ?.split('-')
                  .map((status, index) => (status === '1' && index !== 0 ? false : true));
        this.setState({ currentScreenConfig, perSectionExpandStatus });
    }

    refreshScreenData = async () => {
        if (this.state.screen_id) {
            this.setState({
                loading: true
            });
            let fetched = false;
            let selectedFilters = null;

            if (
                this.props?.filter_id &&
                !this.props?.navigationDisabled &&
                this.props?.setCommentFilters
            ) {
                try {
                    const resp = await getFiltersById(this.props?.filter_id);

                    selectedFilters = resp['selected_filters'] || null;
                    this.props.setCommentFilters(resp);
                } catch (err) {
                    this.setState({
                        notificationOpen: true,
                        notification: {
                            message: 'Error while applying filters',
                            severity: 'warning'
                        }
                    });
                }
            }
            if (this.state.selected_screen?.screen_filters_values_present) {
                const [filterResponse] = await Promise.allSettled([
                    getScreenFilterValues({
                        app_id: this.state.app_id,
                        screen_id: this.state.screen_id,
                        retain_filters: this.props.app_info?.modules?.retain_filters
                    }),
                    getWidgets({
                        app_id: this.state.app_id,
                        screen_id: this.state.screen_id,
                        callback: this.onResponseGetScreen
                    })
                ]);

                if (this.props?.filter_id) {
                    this.onResponseGetScreenFilters(
                        filterResponse.value || {},
                        selectedFilters || null
                    );
                } else {
                    this.onResponseGetScreenFilters(filterResponse.value || {});
                }
            } else {
                if (!this.props.app_info?.modules?.filters) {
                    // if condition added just to handle the conventioanl filters. otherwise we can directly call this.onResponseGetScreenFilters({})
                    this.onResponseGetScreenFilters({});
                }

                const resp = await getScreenConfig({
                    app_id: this.state.app_id,
                    screen_id: this.state.screen_id
                });
                fetched = true;
                if (resp && this.props.setCommentEnabled)
                    this.props.setCommentEnabled(resp?.comment_enabled, resp?.screen_name);

                await getWidgets({
                    app_id: this.state.app_id,
                    screen_id: this.state.screen_id,
                    callback: this.onResponseGetScreen
                });
            }
            if (!fetched) {
                const resp = await getScreenConfig({
                    app_id: this.state.app_id,
                    screen_id: this.state.screen_id
                });
                if (resp && this.props.setCommentEnabled)
                    this.props.setCommentEnabled(resp?.comment_enabled, resp?.screen_name);
            }

            this.setState({
                loading: false
            });
        }
    };

    onResponseGetScreenFilters = (response_data, comments_selected_filters = null) => {
        const { app_info } = this.props;

        let screen_filters_values = response_data;
        if (this.props.location?.state?.filterState && screen_filters_values) {
            screen_filters_values.defaultValues = this.props.location.state?.filterState;
        }

        let selected_filters = app_info.modules.filters
            ? false
            : screen_filters_values.defaultValues;
        if (this.props.location?.state?.filterState) {
            selected_filters = this.props.location.state?.filterState;
        }

        const finalFiterObj = getFinalFilterObj(
            this.props.app_info,
            this.state.screen_id,
            screen_filters_values,
            comments_selected_filters ? comments_selected_filters : selected_filters,
            screen_filters_values.dataValues
        );
        this.props.setScreenLevelFilterState({ screenLevelFilterState: finalFiterObj });
        sessionStorage.setItem(
            'app_screen_initial_filter_info_' + this.state.app_id + '_' + this.state.screen_id,
            JSON.stringify(finalFiterObj)
        );
        sessionStorage.setItem(
            'app_screen_initial_filter_info_datavalue' + app_info.id + '_' + this.state.screen_id,
            JSON.stringify(screen_filters_values.dataValues)
        );

        this.setState({
            screen_filters_values: screen_filters_values,
            selected_filters: finalFiterObj
        });
        const isMultiSelectFilters = screen_filters_values;
        this.props?.setFilterValue && this.props.setFilterValue(isMultiSelectFilters);
        if (this.props.filtersUpdateStatus && this.props.currentFilters) {
            const updatedFilters = response_data?.dataValues?.map((dv) => dv?.widget_tag_key);
            let newFilters = [];
            if (updatedFilters.length > this.props.currentFilters.length) {
                this.props.setUpdatedWidgetsIds(null);
                // Figure out list of extra filters and pass that data
                updatedFilters.forEach((filterKey) => {
                    if (!this.props.currentFilters.includes(filterKey)) {
                        newFilters.push(filterKey);
                    }
                });
                this.setState({ newFilters });
                setTimeout(() => {
                    this.props.setFiltersUpdateStatus(null);
                    this.props.setCurrentFilters(false);
                }, 15000);
            } else if (updatedFilters.length < this.props.currentFilters.length) {
                this.props.setUpdatedWidgetsIds(null);
                this.props.setCurrentFilters(
                    response_data?.dataValues?.map((dv) => dv?.widget_tag_key)
                );
            }
        } else {
            this.props.setCurrentFilters(
                response_data?.dataValues?.map((dv) => dv?.widget_tag_key)
            );
        }
    };

    simulatorInvoke = (val) => {
        this.setState({
            simulatorTrigger: val
        });
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateZoomRatio);
        this.setState = () => {
            return;
        };
    }

    updateZoomRatio = () => {
        const element = document.getElementById('graphContainer');
        if (element) {
            this.setState({ totalAvalHeight: element.offsetHeight });
        }
    };

    onResponseGetScreen = (response_data) => {
        if (response_data.status === 'error') {
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Failed to fetch widgets. Try again!',
                    severity: 'error'
                }
            });
            return;
        }

        this.setState({
            widgets: response_data
        });

        this.props.setActiveScreenWidgets(response_data);

        if (this.state.auto_refresh) {
            let max_secs = 45;
            let min_secs = 10;
            let refresh_timeout = Math.floor(Math.random() * (max_secs - min_secs + 1)) + min_secs;

            setTimeout(
                function () {
                    this.parentObj.refreshScreenData();
                }.bind({ parentObj: this }),
                refresh_timeout * 1000
            );
        }
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.totalAvalHeight && this.state.totalAvalHeight === 0) {
            const element = document.getElementById('graphContainer');
            if (element) {
                this.setState({ totalAvalHeight: element.offsetHeight });
            }
        }
        if (
            this.props.widgetData !== prevProps.widgetData ||
            this.props.activeStep !== prevProps.activeStep
        ) {
            this.setWidgets();
            this.getAllGraphData();
        }
        if (this.props.activeScreenWidgets !== prevState.widgets) {
            this.setWidgets(this.props.activeScreenWidgets);
        }

        if (
            (JSON.stringify(this.state.data_items) !== JSON.stringify(prevState.data_items) ||
                this.state.screen_id !== prevState.screen_id) &&
            this.props.setGPTinfo
        ) {
            this.props.setGPTinfo(this.state.screen_id, this.state.data_items);
        }

        if (
            JSON.stringify(prevState.selected_filters) !==
            JSON.stringify(this.state.selected_filters)
        ) {
            this.getAllGraphData();
        }
    }

    setWidgets = (widgets) => {
        if (this.props.widgetData) {
            this.setState({
                loading: false,
                screen_id: this.props.objectivesSteps[this.props.activeStep].app_screen_id,
                widgets: this.props.widgetData[this.props.activeStep]
            });
        }
        if (widgets) {
            this.setState({ widgets });
        }
    };

    getAllWidgetData = () => {
        let payload = [];

        _.map(this.props.objectivesSteps, (step) => {
            payload.push({
                app_id:
                    this.props.match && this.props.match.params.app_id
                        ? this.props.match.params.app_id
                        : false,
                screen_id: step.app_screen_id
            });
        });

        this.props.getWidgets(payload);
    };

    getAllGraphData = () => {
        let payload = [];

        if (this.props.widgetData && this.state.selected_filters) {
            _.map(this.props.objectivesSteps, (step, index) => {
                let payloadObj = [];
                _.map(this.props.widgetData[index], (widget) => {
                    payloadObj.push({
                        app_id:
                            this.props.match && this.props.match.params.app_id
                                ? this.props.match.params.app_id
                                : false,
                        screen_id: step.app_screen_id,
                        details: widget,
                        filters: this.state.selected_filters
                    });
                });
                payload.push(payloadObj);
            });
            this.props.getGraphData(payload);
        }
    };
    handleScrollPrev = () => {
        const { currentIndex } = this.state;
        if (currentIndex > 0) {
            this.setState({ currentIndex: currentIndex - 1 });
        }
    };

    handleScrollNext = () => {
        const { currentIndex } = this.state;
        const label_widgets = _.filter(this.state.widgets, (widget_item) => widget_item.is_label);
        if (currentIndex + 1 < label_widgets.length - 5) {
            this.setState({ currentIndex: currentIndex + 1 });
        }
    };

    getLabels = () => {
        const { classes, app_info } = this.props;
        const label_widgets = _.filter(this.state.widgets, function (widget_item) {
            return widget_item.is_label;
        });
        const maxVisibleItems = 6;
        const { currentIndex } = this.state;
        const displayedWidgets = label_widgets?.slice(currentIndex, currentIndex + maxVisibleItems);
        const totalIndicators =
            label_widgets.length <= maxVisibleItems
                ? 1
                : 1 + (label_widgets.length - maxVisibleItems);
        const showIndicators =
            currentIndex > 0 || currentIndex + maxVisibleItems < label_widgets.length;
        return this.state.selected_filters && label_widgets.length > 0 ? (
            <div
                className={`${classes.gridLabelContainer} ${
                    this.state.currentScreenConfig?.enable_kpi_collapse ? (!this.state.isKpiExpanded
                        ? classes.collapsedAccordion
                        : classes.expandedAccordion) : ''
                } `}
            >
                {this.state.currentScreenConfig?.enable_kpi_collapse ? (
                    <Accordion
                        defaultExpanded={true}
                        className={classes.accordionOuter}
                        onChange={(e, expanded) => {
                            this.setState({ isKpiExpanded: expanded });
                        }}
                    >
                        <AccordionSummary
                            expandIcon={
                                <ExpandMoreIcon
                                    className={`${classes.expandIcon} ${
                                        this.state.isKpiExpanded ? classes.iconExpanded : ''
                                    }`}
                                />
                            }
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                           <div className={classes.collapseContainer} >
                                <Typography className={classes.heading}>
                                    {this.state.currentScreenConfig?.kpis_header  || 'Key Performance Indicators'}
                                </Typography>
                                {showIndicators && (
                                    <div className={classes.indicatorsContainerCollapse}>
                                        {Array.from({ length: totalIndicators }, (_, i) => (
                                            <span
                                                key={i}
                                                className={`${classes.indicator} ${i === currentIndex ? classes.activeIndicator : ''}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </AccordionSummary>

                        <AccordionDetails>
                            {currentIndex > 0 && (
                                <IconButton
                                    onClick={this.handleScrollPrev}
                                    className={classes.prevButton}
                                >
                                    <ChevronLeftIcon />
                                </IconButton>
                            )}

                            <Grid
                                container
                                justify="center"
                                spacing={1}
                                className={`${classes.gridLabelBody} ${classes.accordionGridLabelBody}`}
                            >
                                {_.map(
                                    displayedWidgets,
                                    function (widget_item) {
                                        const widget_title = widget_item.config?.title
                                            ? widget_item.config.title
                                            : widget_item.widget_key
                                                  .replaceAll('_', ' ')
                                                  .toUpperCase();
                                        return (
                                            <Grid key={widget_item.id} item xs>
                                                <AppWidgetLabel
                                                    parent_obj={this}
                                                    app_info={app_info}
                                                    app_id={this.state.app_id}
                                                    screen_id={this.state.screen_id}
                                                    title={widget_title}
                                                    details={widget_item}
                                                    selected_filters={this.state.selected_filters}
                                                    simulator_apply={this.state.simulator_apply}
                                                    screen_filter_settings={
                                                        this.state.screen_filters_values
                                                            ? true
                                                            : false
                                                    }
                                                    alert_enable={this.state.alert_enable}
                                                    source={
                                                        app_info.name +
                                                        ' >> ' +
                                                        this.state.screen_name +
                                                        ' >> ' +
                                                        widget_title
                                                    }
                                                    alert_admin_user={app_info.is_user_admin}
                                                    logged_in_user_info={
                                                        this.props.logged_in_user_info
                                                    }
                                                    label_widgets={label_widgets}
                                                    widget_index={widget_item?.widget_index}
                                                    askNucliosOpen={this.props.askNucliosOpen}
                                                />
                                            </Grid>
                                        );
                                    },
                                    this
                                )}
                            </Grid>

                            {currentIndex + maxVisibleItems < label_widgets.length && (
                                <IconButton
                                    onClick={this.handleScrollNext}
                                    className={classes.nextButton}
                                >
                                    <ChevronRightIcon />
                                </IconButton>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ) : (
                    <>
                        {currentIndex > 0 && (
                            <IconButton
                                onClick={this.handleScrollPrev}
                                className= {`${classes.prevButton} ${classes.prevButtonScroll}`}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                        )}

                        <Grid
                            container
                            justify="center"
                            spacing={1}
                            className={`${classes.gridLabelBody} ${
                                currentIndex > 0 ? classes.gridLabelBodyAccordian : ''
                            }`}
                        >
                            {_.map(
                                displayedWidgets,
                                function (widget_item) {
                                    const widget_title = widget_item.config?.title
                                        ? widget_item.config.title
                                        : widget_item.widget_key.replaceAll('_', ' ').toUpperCase();
                                    return (
                                        <Grid key={widget_item.id} item xs>
                                            <AppWidgetLabel
                                                parent_obj={this}
                                                app_info={app_info}
                                                app_id={this.state.app_id}
                                                screen_id={this.state.screen_id}
                                                title={widget_title}
                                                details={widget_item}
                                                selected_filters={this.state.selected_filters}
                                                simulator_apply={this.state.simulator_apply}
                                                screen_filter_settings={
                                                    this.state.screen_filters_values ? true : false
                                                }
                                                alert_enable={this.state.alert_enable}
                                                source={
                                                    app_info.name +
                                                    ' >> ' +
                                                    this.state.screen_name +
                                                    ' >> ' +
                                                    widget_title
                                                }
                                                alert_admin_user={app_info.is_user_admin}
                                                logged_in_user_info={this.props.logged_in_user_info}
                                                label_widgets={label_widgets}
                                                widget_index={widget_item?.widget_index}
                                                askNucliosOpen={this.props.askNucliosOpen}
                                            />
                                        </Grid>
                                    );
                                },
                                this
                            )}
                        </Grid>

                        {currentIndex + maxVisibleItems < label_widgets.length && (
                            <IconButton
                                onClick={this.handleScrollNext}
                                className= {`${classes.nextButton} ${classes.nextButtonScroll}`}

                            >
                                <ChevronRightIcon />
                            </IconButton>
                        )}
                    </>
                )}
            </div>
        ) : (
            ''
        );
    };

    widgetsSectionExpandHandler = (e, expanded, graph_section_index) => {
        const updatedPerSectionExpandStatus = [...this.state.perSectionExpandStatus];
        updatedPerSectionExpandStatus[graph_section_index] = expanded;
        this.setState({ perSectionExpandStatus: updatedPerSectionExpandStatus });
    };

    getGraphs = () => {
        const { classes, app_info } = this.props;
        const screens = this.props.appScreens?.length ? this.props.appScreens : app_info.screens;
        let current_settings = _.find(
            screens,
            function (screen) {
                return screen.id === parseInt(this.state.screen_id);
            },
            this
        );
        const graph_widgets = _.filter(this.state.widgets, function (widget_item) {
            return !widget_item.is_label;
        });
        const label_widgets = _.filter(this.state.widgets, function (widget_item) {
            return widget_item.is_label;
        });
        if (current_settings && current_settings['graph_type']) {
            let graph_sections = current_settings['graph_type'].split('-');
            let index = 0;
            let graph_index_prefix = 0;
            let response = [];
            let graph_width =
                !current_settings['graph_width'] || current_settings['graph_width'] == 'false'
                    ? false
                    : current_settings['graph_width'];
            if (graph_width) {
                graph_width = graph_width.split(',');
                graph_width = graph_width.map(function (val) {
                    return val.split('-');
                });
                graph_width = [].concat(...graph_width);
            }
            let graph_height =
                !current_settings['graph_height'] || current_settings['graph_height'] == 'false'
                    ? false
                    : current_settings['graph_height'];
            if (graph_height && current_settings['horizontal']) {
                graph_height = graph_height.split('-');
            } else if (graph_height) {
                graph_height = graph_height.split(',');
                graph_height = graph_height.map(function (val) {
                    return val.split('-');
                });
                graph_height = [].concat(...graph_height);
            }
            let height_index = 0;
            if (current_settings['horizontal']) {
                const perSectionCollapseStatus = current_settings?.per_section_collapse
                    ?.split('-')
                    .map((status) => (status === '1' ? true : false));
                _.each(
                    graph_sections,
                    function (graph_section, graph_section_index) {
                        let graph_widget_items = _.times(
                            graph_section,
                            function (graph_index) {
                                graph_index = graph_index + graph_index_prefix;
                                let widget_item = graph_widgets[graph_index];
                                index++;
                                if (widget_item) {
                                    const widget_title = widget_item.config?.title
                                        ? widget_item.config.title
                                        : widget_item.widget_key.replaceAll('_', ' ').toUpperCase();
                                    if (parseInt(graph_section) === 5) {
                                        return (
                                            <Grid
                                                key={widget_item.id}
                                                item
                                                xs
                                                className={`${classes.gridGraphBody} ${classes.gridItemStyle} ${classes.gridChildItem}`}
                                            >
                                                <AppWidgetComponent
                                                    key={'screen_graph_' + graph_index}
                                                    parent_obj={this}
                                                    app_id={this.state.app_id}
                                                    screen_id={this.state.screen_id}
                                                    title={widget_title}
                                                    details={widget_item}
                                                    selected_filters={this.state.selected_filters}
                                                    simulator_apply={this.state.simulator_apply}
                                                    graph_height={'half'}
                                                    graph_width={'full'}
                                                    screen_filter_settings={
                                                        this.state.screen_filters_values
                                                            ? true
                                                            : false
                                                    }
                                                    screen_filters_values={
                                                        this.state.screen_filters_values
                                                    }
                                                    isEditing={this.state.isEditing}
                                                    selectedScenario={this.state.selectedScenario}
                                                    setIsEditingParent={this.setIsEditingParent}
                                                    scenerioname={this.state.scenerioname}
                                                    alert_enable={this.state.alert_enable}
                                                    source={
                                                        app_info.name +
                                                        ' >> ' +
                                                        this.state.screen_name +
                                                        ' >> ' +
                                                        widget_title
                                                    }
                                                    alert_admin_user={app_info.is_user_admin}
                                                    app_info={app_info}
                                                    logged_in_user_info={
                                                        this.props.logged_in_user_info
                                                    }
                                                    toggleCheck={this.state.toggleCheck}
                                                    simulatorInvoke={this.simulatorInvoke}
                                                    simulatorTrigger={this.state.simulatorTrigger}
                                                    onProgressActionComplete={(completed_action) =>
                                                        this.onProgressActionComplete(
                                                            completed_action
                                                        )
                                                    }
                                                    setScreenProgressData={
                                                        this.setScreenProgressData
                                                    }
                                                    setProgressBarConfDetails={
                                                        this.setProgressBarConfDetails
                                                    }
                                                    refreshApp={(app_id) =>
                                                        this.props.refreshApp(app_id)
                                                    }
                                                    filtersUpdated={this.state.filtersUpdated}
                                                    updatedFiltersHandler={() =>
                                                        this.updatedFiltersHandler()
                                                    }
                                                    widgetComment={this.props.widgetComment}
                                                    updateWidgetComment={this.props.updateWidgetComment}
                                                    props={this.props}
                                                    shouldOpenLibrary={this.props.shouldOpenLibrary}

                                                />
                                            </Grid>
                                        );
                                    } else {
                                        return (
                                            <Grid
                                                key={widget_item.id}
                                                item
                                                xs={
                                                    graph_width[index - 1]
                                                        ? graph_width[index - 1]
                                                        : 12 / parseInt(graph_section)
                                                }
                                                className={`${classes.gridGraphBody} ${classes.gridItemStyle} ${classes.gridChildItem}`}
                                            >
                                                <AppWidgetComponent
                                                    refreshApp={(app_id) =>
                                                        this.props.refreshApp(app_id)
                                                    }
                                                    key={'screen_graph_' + graph_index}
                                                    parent_obj={this}
                                                    app_id={this.state.app_id}
                                                    screen_id={this.state.screen_id}
                                                    title={widget_title}
                                                    details={widget_item}
                                                    selected_filters={this.state.selected_filters}
                                                    simulator_apply={this.state.simulator_apply}
                                                    graph_height={'half'}
                                                    graph_width={'full'}
                                                    setIsEditingParent={this.setIsEditingParent}
                                                    scenerioname={this.state.scenerioname}
                                                    screen_filter_settings={
                                                        this.state.screen_filters_values
                                                            ? true
                                                            : false
                                                    }
                                                    isEditing={this.state.isEditing}
                                                    selectedScenario={this.state.selectedScenario}
                                                    screen_filters_values={
                                                        this.state.screen_filters_values
                                                    }
                                                    alert_enable={this.state.alert_enable}
                                                    source={
                                                        app_info.name +
                                                        ' >> ' +
                                                        this.state.screen_name +
                                                        ' >> ' +
                                                        widget_title
                                                    }
                                                    alert_admin_user={app_info.is_user_admin}
                                                    app_info={app_info}
                                                    logged_in_user_info={
                                                        this.props.logged_in_user_info
                                                    }
                                                    toggleCheck={this.state.toggleCheck}
                                                    filtersUpdated={this.state.filtersUpdated}
                                                    updatedFiltersHandler={() =>
                                                        this.updatedFiltersHandler()
                                                    }
                                                    simulatorInvoke={this.simulatorInvoke}
                                                    simulatorTrigger={this.state.simulatorTrigger}
                                                    onProgressActionComplete={(completed_action) =>
                                                        this.onProgressActionComplete(
                                                            completed_action
                                                        )
                                                    }
                                                    setScreenProgressData={
                                                        this.setScreenProgressData
                                                    }
                                                    setProgressBarConfDetails={
                                                        this.setProgressBarConfDetails
                                                    }
                                                    widgetComment={this.props.widgetComment}
                                                    updateWidgetComment={this.props.updateWidgetComment}
                                                    props={this.props}
                                                    shouldOpenLibrary={this.props.shouldOpenLibrary}
                                                />
                                            </Grid>
                                        );
                                    }
                                } else {
                                    return '';
                                }
                            },
                            this
                        );
                        graph_index_prefix = graph_index_prefix + parseInt(graph_section);
                        height_index++;
                        const isCollapseEnabled =
                            perSectionCollapseStatus &&
                            perSectionCollapseStatus[graph_section_index];
                        // const simulatedAvailHeight = screen.availHeight / this.state.zoomLevel;
                        response.push(
                            <Grid
                                item
                                key={'grid_item_graph_section_' + graph_section_index}
                                xs={12}
                                className={`${classes.gridGraphHalfContainer}
                                    ${classes.gridParentItemStyle}
                                    ${
                                        isCollapseEnabled ?
                                        (!this.state.perSectionExpandStatus[graph_section_index]
                                            ? classes.widgetSectionItemClose
                                            : classes.widgetSectionItemOpen) :
                                        null
                                    }
                                    ${isCollapseEnabled ? classes.widgetCollapse : null}`}
                                style={{
                                    '--itemHeight': graph_height
                                        ? `${
                                              (this.state.totalAvalHeight *
                                                  graph_height[height_index - 1]) /
                                              10
                                          }px`
                                        : null
                                }}
                            >
                                {isCollapseEnabled ? (
                                    <Accordion
                                        defaultExpanded={
                                            this.state.perSectionExpandStatus[graph_section_index]
                                        }
                                        expanded={
                                            this.state.perSectionExpandStatus[graph_section_index]
                                        }
                                        className={classes.sectionsAccordionOuter}
                                        onChange={(e, expand) =>
                                            this.widgetsSectionExpandHandler(
                                                e,
                                                expand,
                                                graph_section_index
                                            )
                                        }
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <ExpandMoreIcon
                                                    className={`${classes.expandIcon} ${
                                                        this.state.perSectionExpandStatus[
                                                            graph_section_index
                                                        ]
                                                            ? classes.iconExpanded
                                                            : ''
                                                    }`}
                                                />
                                            }
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            className={classes.accordionSummaryStyle}
                                        >
                                            <Typography className={classes.heading}>
                                                {
                                                    current_settings?.section_headers?
                                                    current_settings?.section_headers[
                                                        graph_section_index
                                                    ]:''
                                                }
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid
                                                container
                                                justifyContent="center"
                                                spacing={1}
                                                className={`${classes.gridGraphBodyAccordion} ${classes.gridChildContainer}`}
                                            >
                                                {graph_widget_items}
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                ) : (
                                    <Grid
                                        container
                                        justifyContent="center"
                                        spacing={1}
                                        className={`${classes.gridGraphBody} ${classes.gridChildContainer}`}
                                    >
                                        {graph_widget_items}
                                    </Grid>
                                )}
                            </Grid>
                        );
                    },
                    this
                );
                return (
                    <Grid
                        container
                        justifyContent="center"
                        spacing={1}
                        className={`${classes.gridGraphBody}  ${classes.gridParentContainer} ${this.state.currentScreenConfig?.per_section_collapse?.includes('1') ? classes.accordionGridParentContainer : null}`}
                    >
                        {response}
                    </Grid>
                );
            } else {
                _.each(
                    graph_sections,
                    function (graph_section, graph_section_index) {
                        let graph_widget_items = _.times(
                            graph_section,
                            function (graph_index) {
                                graph_index = graph_index + graph_index_prefix;
                                let widget_item = graph_widgets[graph_index];
                                if (widget_item) {
                                    const widget_title = widget_item.config?.title
                                        ? widget_item.config.title
                                        : widget_item.widget_key.replaceAll('_', ' ').toUpperCase();

                                    return (
                                        <Grid
                                            key={widget_item.id}
                                            item
                                            xs={12}
                                            className={`${
                                                graph_section === '1'
                                                    ? classes.gridGraphFullContainer
                                                    : classes.gridGraphHalfContainer
                                            } ${classes.gridVerticalItemStyle} ${
                                                classes.gridVerticalChildItem
                                            }`}
                                            style={{
                                                '--itemHeight': graph_height
                                                    ? `${
                                                          (Math.round(
                                                              (screen.availHeight *
                                                                  (label_widgets.length > 0
                                                                      ? 85
                                                                      : 100)) /
                                                                  100
                                                          ) *
                                                              graph_height[graph_index]) /
                                                          12.25
                                                      }px`
                                                    : graph_section === '1'
                                                    ? '100%'
                                                    : '49%'
                                            }}
                                        >
                                            <AppWidgetComponent
                                                refreshApp={(app_id) =>
                                                    this.props.refreshApp(app_id)
                                                }
                                                key={'screen_graph_' + graph_index}
                                                parent_obj={this}
                                                app_id={this.state.app_id}
                                                screen_id={this.state.screen_id}
                                                title={widget_title}
                                                details={widget_item}
                                                selected_filters={this.state.selected_filters}
                                                simulator_apply={this.state.simulator_apply}
                                                graph_height={
                                                    graph_section === '1' ? 'full' : 'half'
                                                }
                                                setIsEditingParent={this.setIsEditingParent}
                                                graph_width={'half'}
                                                screen_filter_settings={
                                                    this.state.screen_filters_values ? true : false
                                                }
                                                scenerioname={this.state.scenerioname}
                                                screen_filters_values={
                                                    this.state.screen_filters_values
                                                }
                                                // screen_filters_values={this.state.screen_filters_values}
                                                isEditing={this.state.isEditing}
                                                selectedScenario={this.state.selectedScenario}
                                                // isEditing={this.state.isEditing}
                                                // selectedScenario={this.state.selectedScenario}
                                                alert_enable={this.state.alert_enable}
                                                source={
                                                    app_info.name +
                                                    ' >> ' +
                                                    this.state.screen_name +
                                                    ' >> ' +
                                                    widget_title
                                                }
                                                alert_admin_user={app_info.is_user_admin}
                                                app_info={app_info}
                                                logged_in_user_info={this.props.logged_in_user_info}
                                                toggleCheck={this.state.toggleCheck}
                                                filtersUpdated={this.state.filtersUpdated}
                                                updatedFiltersHandler={() =>
                                                    this.updatedFiltersHandler()
                                                }
                                                simulatorInvoke={this.simulatorInvoke}
                                                simulatorTrigger={this.state.simulatorTrigger}
                                                onProgressActionComplete={(completed_action) =>
                                                    this.onProgressActionComplete(completed_action)
                                                }
                                                setScreenProgressData={this.setScreenProgressData}
                                                setProgressBarConfDetails={
                                                    this.setProgressBarConfDetails
                                                }
                                                widgetComment={this.props.widgetComment}
                                               updateWidgetComment={this.props.updateWidgetComment}
                                                props={this.props}
                                                shouldOpenLibrary={this.props.shouldOpenLibrary}
                                            />
                                        </Grid>
                                    );
                                } else {
                                    return '';
                                }
                            },
                            this
                        );

                        graph_index_prefix = graph_index_prefix + parseInt(graph_section);
                        if (graph_sections.length === 5) {
                            response.push(
                                <Grid
                                    item
                                    key={'grid_item_graph_section_' + graph_section_index}
                                    xs
                                    className={`${classes.gridGraphBody} ${classes.gridVerticalParentItemStyle}`}
                                >
                                    <Grid
                                        container
                                        justifyContent="center"
                                        spacing={1}
                                        className={`${classes.gridGraphBody} ${classes.gridVerticalChildContainer}`}
                                    >
                                        {graph_widget_items}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            response.push(
                                <Grid
                                    item
                                    key={'grid_item_graph_section_' + graph_section_index}
                                    xs={
                                        graph_width[graph_section_index]
                                            ? graph_width[graph_section_index]
                                            : 12 / parseInt(graph_sections.length)
                                    }
                                    className={`${classes.gridGraphBody} ${classes.gridVerticalParentItemStyle}`}
                                >
                                    <Grid
                                        container
                                        justifyContent="center"
                                        spacing={1}
                                        className={`${classes.gridGraphBody} ${classes.gridVerticalChildContainer}`}
                                    >
                                        {graph_widget_items}
                                    </Grid>
                                </Grid>
                            );
                        }
                    },
                    this
                );
                return (
                    <Grid
                        container
                        justifyContent="center"
                        spacing={1}
                        className={`${classes.gridGraphBody} ${classes.gridVerticalParentContainer}`}
                    >
                        {response}
                    </Grid>
                );
            }
        } else {
            return (
                <Grid
                    container
                    justifyContent="center"
                    spacing={1}
                    className={`${classes.gridGraphBody} ${classes.gridItemsWrapper}`}
                >
                    {_.map(
                        graph_widgets,
                        function (widget_item, widget_index) {
                            const widget_title = widget_item.config?.title
                                ? widget_item.config.title
                                : widget_item.widget_key.replaceAll('_', ' ').toUpperCase();

                            return (
                                <Grid
                                    key={widget_item.id}
                                    item
                                    xs={
                                        graph_widgets.length > 4
                                            ? 4
                                            : graph_widgets.length === 4
                                            ? 6
                                            : 12 / graph_widgets.length
                                    }
                                    className={`${
                                        graph_widgets.length > 3
                                            ? classes.gridGraphHalfContainer
                                            : classes.gridGraphFullContainer
                                    }
                                        ${classes.gridCustomItemStyle}
                                        ${
                                            graph_widgets.length > 4
                                                ? classes.gridItemCustomOneStyle
                                                : graph_widgets.length === 4
                                                ? classes.gridItemCustomTwoStyle
                                                : ''
                                        }`}
                                >
                                    <AppWidgetComponent
                                        refreshApp={(app_id) => this.props.refreshApp(app_id)}
                                        key={'screen_graph_' + widget_index}
                                        parent_obj={this}
                                        app_id={this.state.app_id}
                                        screen_id={this.state.screen_id}
                                        title={widget_title}
                                        details={widget_item}
                                        selected_filters={this.state.selected_filters}
                                        simulator_apply={this.state.simulator_apply}
                                        graph_height={graph_widgets.length > 3 ? 'half' : 'full'}
                                        graph_width={graph_widgets.length > 2 ? 'half' : 'full'}
                                        screen_filter_settings={
                                            this.state.screen_filters_values ? true : false
                                        }
                                        setIsEditingParent={this.setIsEditingParent}
                                        isEditing={this.state.isEditing}
                                        scenerioname={this.state.scenerioname}
                                        selectedScenario={this.state.selectedScenario}
                                        screen_filters_values={this.state.screen_filters_values}
                                        alert_enable={this.state.alert_enable}
                                        source={
                                            app_info.name +
                                            ' >> ' +
                                            this.state.screen_name +
                                            ' >> ' +
                                            widget_title
                                        }
                                        alert_admin_user={app_info.is_user_admin}
                                        app_info={app_info}
                                        logged_in_user_info={this.props.logged_in_user_info}
                                        toggleCheck={this.state.toggleCheck}
                                        DS_Bookmark={this.props.DS_Bookmark}
                                        DS_Download={this.props.DS_Download}
                                        DS_ClickHandle={(val) => this.props.DS_ClickHandle(val)}
                                        filtersUpdated={this.state.filtersUpdated}
                                        updatedFiltersHandler={() => this.updatedFiltersHandler()}
                                        simulatorInvoke={this.simulatorInvoke}
                                        simulatorTrigger={this.state.simulatorTrigger}
                                        onProgressActionComplete={(completed_action) =>
                                            this.onProgressActionComplete(completed_action)
                                        }
                                        setScreenProgressData={this.setScreenProgressData}
                                        setProgressBarConfDetails={this.setProgressBarConfDetails}
                                        widgetComment={this.props.widgetComment}
                                         updateWidgetComment={this.props.updateWidgetComment}
                                        props={this.props}
                                        shouldOpenLibrary={this.props.shouldOpenLibrary}
                                    />
                                </Grid>
                            );
                        },
                        this
                    )}
                </Grid>
            );
        }
    };

    updatedFiltersHandler = () => {
        this.setState({ filtersUpdated: false });
    };

    getWidgetData = (selected_filters, pivotInfo, dataValues=null) => {
        const screen_filters_values = { ...this.state.screen_filters_values };
        if (pivotInfo) {
            screen_filters_values['pivot_info'] = pivotInfo;
        }
        const finaFilterlObj = getFinalFilterObj(
            this.props.app_info,
            this.state.screen_id,
            screen_filters_values,
            selected_filters,
            dataValues
        );

        this.setState(
            {
                selected_filters: finaFilterlObj,
                filtersUpdated: true
            },
            () => {
                this.props.setScreenLevelFilterState({ screenLevelFilterState: finaFilterlObj });
            }
        );
    };

    onApplySimulator = (refresh) => {
        this.setState({
            simulator_apply: refresh
        });
    };

    onSimulatorApplyDrilldown = (action_link) => {
        const { routes } = this.props;
        if (routes && routes[action_link - 1] && routes[action_link - 1].href) {
            window.open(routes[action_link - 1].href, '_self');
        }
    };

    toggleChange = (toggleId, toggleValue) => {
        this.setState({ toggleCheck: toggleValue });
    };
    showBorder = (breadcrumb, isFilter, isMultiSelectFilters) => {
        if (breadcrumb && !(isMultiSelectFilters || isFilter)) {
            return true;
        }
        if (breadcrumb && (isMultiSelectFilters || isFilter)) {
            return false;
        }
        if (!breadcrumb && !(isMultiSelectFilters || isFilter)) {
            return true;
        }
    };

    onProgressActionComplete = (completed_action) => {
        this.setState((prevState) => ({
            stepper_actions_completed: [...prevState.stepper_actions_completed, completed_action]
        }));
    };

    setScreenProgressData = (data) => {
        this.setState(
            (prevState) => ({
                screen_navigation_data: [...prevState.screen_navigation_data, data]
            }),
            () => {
                this.props.setScreenProgressData(this.state.screen_navigation_data);
            }
        );
    };

    handleProgressFinish = () => {
        this.setState(
            {
                screen_navigation_data: [],
                notificationOpen: true,
                notification: {
                    message: 'Current iteration is completed',
                    severity: 'success'
                }
            },
            () => {
                this.props.setScreenProgressData(this.state.screen_navigation_data, 'finish');
            }
        );
    };

    setProgressBarConfDetails = (progress_bar_config_details) => {
        this.props.setProgressBarConfDetails(progress_bar_config_details);
    };

    validateNextButton = () => {
        const { widgets, stepper_actions_completed } = this.state;
        const completed_actions = [
            ...new Set(
                stepper_actions_completed
                    .map((action) => action?.completed_action)
                    .filter((action) => action !== null)
            ),
            ...stepper_actions_completed.filter((action) => action?.completed_action === null)
        ].map((action) => ({ completed_action: action }));
        if (this.props.activeStep < this.props.previousActiveStep) return true;
        else return widgets.length === completed_actions.length;
    };

    validateStepperButton = () => {
        const { widgets, stepper_actions_completed } = this.state;
        const completed_actions = [
            ...new Set(
                stepper_actions_completed
                    .map((action) => action?.completed_action)
                    .filter((action) => action !== null)
            ),
            ...stepper_actions_completed.filter((action) => action?.completed_action === null)
        ].map((action) => ({ completed_action: action }));
        // if(this.props.activeStep < this.props.previousActiveStep) return true
        return widgets.length === completed_actions.length;
    };

    validateStep = (step) => {
        const { previousActiveStep } = this.props;
        const isBack = step <= previousActiveStep;
        const isNextStepOne = step - previousActiveStep === 1;

        return isBack || isNextStepOne;
    };

    handleDirectStepperClick = (step, currScreen, NextScreen) => {
        const { previousActiveStep, handleDirectStepperClick } = this.props;
        const isBack = step <= previousActiveStep;

        // Validate steps and conditions before proceeding
        if (!this.validateStep(step) || (!this.validateStepperButton() && !isBack)) return;

        handleDirectStepperClick(step, currScreen, NextScreen, isBack);
    };

    ValidateDirectStepperClick = (step) => {
        const { previousActiveStep } = this.props;
        const isBack = step <= previousActiveStep;
        if (!this.validateStep(step) || (!this.validateStepperButton() && !isBack)) return false;
        else return true;
    };

    render() {
        const { classes, app_info, breadcrumbs_empty, breadcrumb, top_navbar } = this.props;
        const isMultiSelectFilters =
            !this.state.loading &&
            this.state.screen_filters_values &&
            this.state.screen_filters_values.dataValues &&
            this.state.screen_filters_values.defaultValues;
        const isFilter = app_info.modules && app_info.modules.filters && this.state.screen_id;
        let label_widgets = _.filter(this.state.widgets, function (widget_item) {
            return widget_item.is_label;
        });
        const screens = this.props.appScreens?.length ? this.props.appScreens : app_info.screens;
        let current_screen = _.find(
            screens,
            function (screen_item) {
                return (
                    screen_item.id === this.state.screen_id &&
                    screen_item.screen_filters_open &&
                    screen_item.screen_filters_open !== 'false'
                );
            },
            this
        );

        if (
            this.props.progressBarDetails &&
            this.props.progressBarDetails[this.state.screen_id] &&
            this.props.progressBarDetails[this.state.screen_id].type !== 'modify' &&
            !this.props.progressBarDetails[this.state.screen_id]?.completed
        ) {
            return (
                <div className={classes.progressBarWrapper}>
                    <StepperProgressBar
                        app_id={this.state.app_id}
                        screen_id={this.props.activeScreenId}
                        history={this.props.history}
                        refreshApp={(app_id) => this.refreshApp(app_id)}
                    />
                </div>
            );
        }

        return (
            <SavedScenarioContext.Provider
                value={{
                    openPopup: this.openPopup,
                    closePopup: this.closePopup,
                    isEditing: this.state.isEditing,
                    openSavedScenarioPopup: this.openSavedScenarioPopup,
                    closeSavedScenarioPopup: this.closeSavedScenarioPopup
                }}
            >
                <div
                    id="capture-screen"
                    ref={this.captureRef}
                    className={`
                    ${breadcrumbs_empty ? classes.noTitleBody : classes.body}
                    ${this.state?.stepperScreens?.length > 0 ? classes.bodyStepperComponent : ''}`}
                >
                    {this.state.isPopupOpen ? (
                        <SavedScenarioPopup
                            SavedScenarioprops={this.state.savedPopupParams}
                            updateEditingFields={this.updateEditingFields}
                            setIsEditingParent={this.setIsEditingParent}
                        />
                    ) : (
                        ''
                    )}

                    {this.state.isSavedScenarioPopup? (
                        <SavedScenariosPopup
                            props={this.props}
                            SavedScenarioprops={this.state.savedScenariosPopupParams}
                            linkedScreen={this.state.linkedScreenScenario}
                            appId={this.props?.app_id}
                            screenId={this.props?.screenId !== undefined ? this.props.screenId :this.props.screenIdCollab}
                            widget_id={this.props.widget_id}
                            onClose={this.props.onClose}
                            shouldOpen={this.props.shouldOpen}
                            shouldOpenHandler={this.props.shouldOpenHandler}
                            filterWidgetId={this.props.filterWidgetId}
                            filterCommentId={this.props.filterCommentId}
                            filterScreenId={this.props.filterScreenId}
                            linkType={this.props.linkType}
                            screenName={this.props.screenName}
                            app_info={this.props.app_info}
                            shouldOpenLibrary={this.props.shouldOpenLibrary}
                            shouldOpenLibraryHandler={this.props.shouldOpenLibraryHandler}
                            scenarioDrawerOpen={this.props.scenarioDrawerOpen}
                            getScenarioList={this.props.getScenarioList}
                            enableHighlight={this.props.enableHighlight}
                            updateWidgetComment={this.props.updateWidgetComment}
                            screenIdCollab={this.props.screenIdCollab}
                            sidebarOpen={this.props.sidebarOpen}
                            top_navbar={this.props.top_navbar}
                        />
                    ) : null}
                    {/* portal to render screen level action components */}
                    {this.props.progressBarDetails &&
                    this.props.progressBarDetails[this.state.screen_id] &&
                    this.props.progressBarDetails[this.state.screen_id]?.type === 'modify' &&
                    !this.props.progressBarDetails[this.state.screen_id]?.completed ? (
                        <div className={classes.modifyProgressBarWrapper}>
                            <StepperProgressBar
                                app_id={this.state.app_id}
                                screen_id={this.props.activeScreenId}
                                history={this.props.history}
                                refreshApp={(app_id) => this.refreshApp(app_id)}
                            />
                        </div>
                    ) : null}
                    {this.props.preview_screen_id ? (
                        <div>
                            <div
                                id="preview_screen_action-tab_nav_bar"
                                className={classes.actionElement}
                                style={{
                                    width: '100%',
                                    justifyContent: 'flex-end',
                                    paddingBottom: '0.8rem'
                                }}
                            />
                            <div
                                id="preview_screen_action-floater"
                                style={{
                                    position: 'fixed',
                                    padding: '0.5rem',
                                    zIndex: '100'
                                }}
                            />
                        </div>
                    ) : null}
                    <div
                        style={{
                            display: this.props.location?.state?.hideFilter ? 'none' : 'contents'
                        }}
                    >
                        {!this.state.loading &&
                        this.state.screen_filters_values &&
                        this.state.screen_filters_values.dataValues &&
                        this.state.screen_filters_values.defaultValues ? (
                            <AppWidgetMultiSelectFilters
                                parent_obj={this}
                                app_id={this.state.app_id}
                                screen_id={this.state.screen_id}
                                app_info={app_info}
                                open={current_screen ? true : false}
                                data_items={this.state.data_items}
                                newFilters={this.state.newFilters}
                            />
                        ) : app_info.modules && app_info.modules.filters && this.state.screen_id ? (
                            <AppScreenFilters
                                parent_obj={this}
                                app_id={this.state.app_id}
                                screen_id={this.state.screen_id}
                                app_info={app_info}
                                open={current_screen ? true : false}
                                data_items={this.state.data_items}
                            />
                        ) : null}
                    </div>
                    {/* portal to render screen level action components */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div
                            id={
                                this.props.preview_screen_id
                                    ? 'preview_screen_action-screen_top_left'
                                    : 'screen_action-screen_top_left'
                            }
                            className={classes.actionElement}
                        />
                        <div style={{ flex: 1 }} />
                        <div
                            id={
                                this.props.preview_screen_id
                                    ? 'preview_screen_action-screen_top_right'
                                    : 'screen_action-screen_top_right'
                            }
                            className={classes.actionElement}
                        />
                    </div>
                    {this.state.loading || !this.state.widgets ? (
                        <div
                            className={clsx(
                                this.state.loading
                                    ? classes.gridContainerLoading
                                    : classes.gridContainer
                            )}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                spacing={0}
                                className={classes.gridBody}
                            >
                                <Grid key={'empty_widget'} item xs={12}>
                                    <Paper justify="center" className={classes.widgetContent}>
                                        {this.state.loading ? (
                                            <CodxCircularLoader size={60} center />
                                        ) : null}
                                        {!this.state.loading ? (
                                            <AppUserMessage app_info={app_info} />
                                        ) : null}
                                    </Paper>
                                </Grid>
                            </Grid>
                            {this.props.videoOpen && (
                                <div style={{ height: '40%', width: '40%' }}>
                                    <Suspense fallback={<CodxCircularLoader center size={60} />}>
                                        <VideoJS options={this.props.videoOptions} />
                                    </Suspense>
                                    <Button
                                        variant="contained"
                                        onClick={this.videoClose}
                                        aria-label="Close"
                                        className={classes.videoCloseBtn}
                                    >
                                        Close
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className={clsx(
                                classes.gridContainer,
                                this.showBorder(breadcrumb, isFilter, isMultiSelectFilters)
                                    ? classes.gridContainerLoading
                                    : ''
                            )}
                        >
                            {this.state?.stepperScreens &&
                                this.state?.stepperScreens?.length > 0 &&
                                this?.props?.progress_bar_config?.position !== 'bottom' && (
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} style={{ paddingBottom: '1.2rem' }}>
                                            <Paper
                                                justify="center"
                                                className={classes.widgetContent}
                                            >
                                                <ScreenStepper
                                                    steps={this.state?.stepperScreens}
                                                    activeStep={this.props?.activeStep}
                                                    progress_bar_config={
                                                        this.props.progress_bar_config
                                                    }
                                                    handleDirectStepperClick={
                                                        this.handleDirectStepperClick
                                                    }
                                                    ValidateDirectStepperClick={
                                                        this.ValidateDirectStepperClick
                                                    }
                                                />
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                )}
                            {this.getLabels()}
                            <div
                                className={clsx(
                                    label_widgets.length > 0
                                        ? classes.gridGraphContainer
                                        : ((this.state?.stepperScreens &&
                                            this.state?.stepperScreens?.length > 0 &&
                                            this.props?.activeStep !==
                                                this.state?.stepperScreens?.length) && top_navbar)
                                            ? classes.gridGraphNoLabelProgressContainer
                                            : classes.gridGraphNoLabelContainer,
                                    top_navbar ? classes.gridContainerWithBottomBorder  : ''
                                )}
                                style={{
                                    '--accordion': (
                                        top_navbar &&
                                        (this.state.currentScreenConfig?.per_section_collapse?.includes('1') ||
                                        this.state.currentScreenConfig?.enable_kpi_collapse)
                                    ) ? true : false
                                }}
                                id="graphContainer"

                            >
                                {this.state.selected_filters ? this.getGraphs() : ''}
                                {this.state?.stepperScreens &&
                                    this.state?.stepperScreens?.length > 0 &&
                                    this.props?.activeStep !==
                                        this.state?.stepperScreens?.length && (
                                        <div
                                            className={
                                                this.props?.progress_bar_config?.position ===
                                                'bottom'
                                                    ? classes.stepperContainer
                                                    : classes.stepperButtons
                                            }
                                        >
                                            {this.props?.progress_bar_config?.position ===
                                            'bottom' ? (
                                                <Grid item xs={12}>
                                                    <Paper
                                                        justify="center"
                                                        className={classes.widgetContent}
                                                    >
                                                        <ScreenStepper
                                                            steps={this.state?.stepperScreens}
                                                            activeStep={this.props?.activeStep}
                                                            progress_bar_config={
                                                                this.props.progress_bar_config
                                                            }
                                                            handleDirectStepperClick={
                                                                this.handleDirectStepperClick
                                                            }
                                                            ValidateDirectStepperClick={
                                                                this.ValidateDirectStepperClick
                                                            }
                                                        />
                                                    </Paper>
                                                </Grid>
                                            ) : null}
                                            <div
                                                className={
                                                    this.props?.progress_bar_config?.position ===
                                                    'bottom'
                                                        ? classes.bottomStepperActionButton
                                                        : ''
                                                }
                                            >
                                                <Button
                                                    variant="outlined"
                                                    disabled={this.props?.activeStep === 0}
                                                    onClick={() =>
                                                        this.props?.handleStepper(
                                                            'back',
                                                            this.state.stepperScreens[
                                                                this.props?.activeStep
                                                            ]?.screen_name,
                                                            this.state.stepperScreens[
                                                                this.props?.activeStep - 1
                                                            ]?.screen_name
                                                        )
                                                    }
                                                    className={classes.stepperActionButton}
                                                    classes={{ disabled: classes.disabledBtn }}
                                                    aria-label="Back"
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    className={classes.stepperActionButton}
                                                    onClick={() =>
                                                        this.props?.activeStep ===
                                                        this.state?.stepperScreens?.length - 1
                                                            ? this.handleProgressFinish()
                                                            : this.props?.handleStepper(
                                                                  'next',
                                                                  this.state.stepperScreens[
                                                                      this.props?.activeStep
                                                                  ]?.screen_name,
                                                                  this.state.stepperScreens[
                                                                      this.props?.activeStep + 1
                                                                  ]?.screen_name
                                                              )
                                                    }
                                                    disabled={!this.validateNextButton()}
                                                    aria-label={
                                                        this.props?.activeStep ===
                                                        this.state?.stepperScreens?.length - 1
                                                            ? 'Finish'
                                                            : 'Next Step'
                                                    }
                                                >
                                                    {this.props?.activeStep ===
                                                    this.state?.stepperScreens?.length - 1
                                                        ? 'Finish'
                                                        : 'Next Step'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                            </div>
                            {this.props.videoOpen && (
                                <div style={{ height: '40%', width: '40%' }}>
                                    <Suspense fallback={<CodxCircularLoader center size={60} />}>
                                        <VideoJS options={this.props.videoOptions} />
                                    </Suspense>
                                    <Button
                                        variant="contained"
                                        onClick={this.props.videoClose}
                                        aria-label="Close"
                                        className={classes.videoCloseBtn}
                                    >
                                        Close
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    {!this.state.loading &&
                    ((this.state.selected_screen?.screen_actions_present &&
                        this.state.selected_filters) ||
                        this.props.app_info.modules.user_guide) ? (
                        <ScreenActionsComponent
                            screen_id={this.state.screen_id}
                            app_id={this.state.app_id}
                            selected_filter={this.state.selected_filters}
                            preview={!!this.props.preview_screen_id}
                            displayGuides={this.props.app_info.modules.user_guide}
                            onData={this.videoRender}
                            toggleChange={this.toggleChange}
                            toggleCheck={this.state.toggleCheck}
                            onDownloadPDF={this.downloadAsPDF}
                            onDownloadPNG={this.downloadAsPNG}
                            askNucliosOpen={this.props.askNucliosOpen}
                            commentsOpen={this.props.commentsOpen}
                            handleClick={this.props.handleClick}
                            commentEnabled={this.props.commentEnabled}
                            breadcrumb={this.props.breadcrumb}
                            updateScreenTab={this.props.updateScreenTab}
                            isTabNavBar={this.props.isTabNavBar}
                        />
                    ) : null}

                    <CustomSnackbar
                        open={this.state.notificationOpen}
                        autoHideDuration={2000}
                        onClose={() => this.setState({ notificationOpen: false })}
                        severity={this.state.notification?.severity}
                        message={this.state.notification?.message}
                    />
                </div>
            </SavedScenarioContext.Provider>
        );
    }

    updateScreenDataItems = (data_item) => {
        var data_items = this.state.data_items;
        data_items.push(data_item);
        this.setState({
            data_items: data_items
        });
    };
}

AppScreen.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        widgetData: state.appScreen.widgetData,
        activeScreenWidgets: state.appScreen.activeScreenWidgets,
        activeScreenId: state.appScreen.activeScreenId,
        inProgressScreenId: state.appScreen.inProgressScreenId,
        progressBarDetails: state.appScreen.progressBarDetails,
        appScreens: state.appScreen.appScreens,
        filtersUpdateStatus: state.appScreen.filtersUpdateStatus,
        currentFilters: state.appScreen.currentFilters
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setScreenId: (screenId) => dispatch(setScreenId(screenId)),
        getWidgets: (payload) => dispatch(getScreenWidgets(payload)),
        getGraphData: (payload) => dispatch(getGraphData(payload)),
        setScreenLevelFilterState: (payload) => dispatch(setScreenLevelFilterState(payload)),
        setActiveScreenId: (payload) => dispatch(setActiveScreenId(payload)),
        setActiveScreenWidgets: (payload) => dispatch(setActiveScreenWidgets(payload)),
        setActiveScreenDetails: (payload) => dispatch(setActiveScreenDetails(payload)),
        setProgressBarDetails: (payload) => dispatch(setProgressBarDetails(payload)),
        setCurrentFilters: (payload) => dispatch(setCurrentFilters(payload)),
        setFiltersUpdateStatus: (payload) => dispatch(setFiltersUpdateStatus(payload)),
        setUpdatedWidgetsIds: (payload) => dispatch(setUpdatedWidgetsIds(payload))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles((theme) => appScreenStyle(theme), { withTheme: true })(AppScreen));
