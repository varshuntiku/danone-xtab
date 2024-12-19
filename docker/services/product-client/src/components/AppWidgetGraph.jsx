import React from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    Button,
    CircularProgress,
    Checkbox,
    Box,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Grid,
    Input,
    Slider,
    MenuItem,
    Popover,
    Paper,
    FormControlLabel,
    RadioGroup,
    Radio
} from '@material-ui/core';
import Typography from 'components/elements/typography/typography';
import Chip from '@material-ui/core/Chip';
import Search from '@material-ui/icons/Search';
import Skeleton from '@material-ui/lab/Skeleton';
import { SelectedIndexProvider } from '../context/SelectedIndexContext.jsx';
import appWidgetGraphStyle from 'assets/jss/appWidgetGraphStyle.jsx';

import AppWidgetTable from 'components/AppWidgetTable.jsx';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';
import AppWidgetInsights from 'components/AppWidgetInsights.jsx';
import AppWidgetTestLearn from 'components/AppWidgetTestLearn.jsx';
import AppWidgetFlowTable from 'components/AppWidgetFlowTable.jsx';
import AppWidgetAssumptions from 'components/AppWidgetAssumptions.jsx';
import AppWidgetExpandableTable from 'components/app-expandable-table/appWidgetExpandableTable.jsx';
import AppWidgetTableSimulator from './AppWidgetTableSimulator.jsx';
import AppWidgetGanttTable from 'components/AppWidgetGanttTable.jsx';
import AppWidgetPowerBI from 'components/AppWidgetPowerBI.jsx';
import TableauEmbed from 'components/AppWidgetTableau.jsx'
import SearchBar from '../components/CustomSearchComponent/SearchComponent';

import { Error, ExpandMore, ExpandLess } from '@material-ui/icons';
import { getWidget, getMultiWidget, executeCode } from 'services/widget.js';
import {
    setWidgetEventData,
    updateMaxScreenWidgetCount,
    updateCurrentSelectedWidgetCount,
    removeWidgetFromUsed,
    setWidgetOpenIdState
} from 'store/index';

import AppConfigWrapper, { AppConfigOptions } from '../hoc/appConfigWrapper.js';
import DownloadWorkBook from './workbook/downloadWorkBook';
import AppWidgetKpi from './AppWidgetKpi.jsx';
import AppWidgetSimulator from './AppWidgetSimulator.jsx';
import RevampedSimulator from 'components/simulators/RevampedSimulator.jsx';
import { triggerWidgetActionHandler } from 'services/widget.js';
// import for Specific Simulator:setWidgetOpenIdState
import AlternateSimulator from './simulators/AlternateSimulator.jsx';
import AlternateSimulatorTypeD from './simulators/AlternateSimulatorTypeD.jsx';
import AlternateSimulatorTypeC from './simulators/AlternateSimulatorTypeC.jsx';
import AlternateSimulatorTypeE from './simulators/AlternateSimulatorTypeE.jsx';
import AlternateSimulatorTypeF from './simulators/AlternateSimulatorTypeF.jsx';
import { getScrenarios, saveScrenario } from '../services/scenario';
import FormDialogSaveScenario from '../components/dynamic-form/saveScenarioDialog.jsx';
import { connect } from 'react-redux';
import GridTable from './gridTable/GridTable.jsx';
import AlertDialog from './alert-dialog/AlertDialog.jsx';
import CustomSnackbar from './CustomSnackbar';
import AppWidgetPreLoader from './AppWidgetPreLoader.jsx';
import CodxCircularLoader from './CodxCircularLoader.jsx';
import CodxExtraLoader from './CodxExtraLoader.jsx';
import Calendar from './custom-calendar/Calendar.jsx';
import AppWidgetDynamicForm from './AppWidgetDynamicForm.jsx';
import AppWidgetCustomComponent from './customAppWidgets/AppWidgetCustomComponent.jsx';
import CodxToggleSwitch from './custom/CodxToggleSwitch';
import CustomLegends from './custom/CustomLegends';
import clsx from 'clsx';
import { SelectedIndexContext } from '../context/SelectedIndexContext.jsx';
import WhiteSpaceDetector from './WhiteSpaceDetector.jsx';
import ZoomIn from '../assets/Icons/ZoomIn.jsx';
import ZoomOut from '../assets/Icons/ZoomOut.jsx';
import CloseIcon from '../assets/Icons/CloseBtn';
import { IconButton, Tooltip } from '@material-ui/core';
import { downloadFile } from 'common/utils';
import AccordionGridTable from './gridTable/AccordionGridTable.jsx';
import AccordionTableSimultor from './simulators/AccordionTableSimulator.jsx';
import { fetch_socket_connection } from 'util/initiate_socket.js';
import DocumentRenderer from './document-renderer/DocumentRederer.jsx';
import CodxTable from './tableComponents/CodxTable.jsx';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ReactComponent as GetApp } from 'assets/img/Download_Ic.svg';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SmsFailedIcon from '@material-ui/icons/SmsFailed';
import { ReactComponent as CommentIcon } from '../assets/img/CommentButton.svg';
import AppFilterUiac from './AppFilterUiac.jsx';
import CompareScenarioTable from 'components/simulators/CompareScenarioTable.jsx';

import * as _ from 'underscore';
import FormDialogSaveAsScenario from '../components/dynamic-form/editSaveasScenarioDialog.jsx';

const EnlargedView = ({
    showEnlargedWidget,
    title,
    data,
    renderVisualContent,
    classes,
    onClose,
    widgetEnlargeFullscreen,
    noTitleCasing
}) => {
    return (
        <Dialog
            fullScreen={widgetEnlargeFullscreen}
            fullWidth={true}
            maxWidth="xl"
            open={showEnlargedWidget}
            onClose={onClose}
            aria-labelledby={title}
            aria-describedby="graph content"
        >
            <DialogTitle id={title}>
                <div className={classes.actionBar}>
                    <Typography
                        className={noTitleCasing ? classes.graphLabelNoCasing : classes.graphLabel}
                    >
                        <h5>{title.toLowerCase()}</h5>
                    </Typography>
                    <div onClick={onClose}>
                        <ZoomOut />
                    </div>
                </div>
            </DialogTitle>
            <DialogContent id="graph content">{data ? renderVisualContent : ''}</DialogContent>
            <DialogActions>
                <div className={classes.actionCancel} onClick={onClose}>
                    Cancel
                </div>
            </DialogActions>
        </Dialog>
    );
};
class AppWidgetGraph extends React.Component {
    static contextType = SelectedIndexContext;
    constructor(props) {
        super(props);

        this.props = props;
        this.updateMenuRef = React.createRef();
        this.bodyRef = React.createRef();
        this.state = {
            loading: true,
            error: false,
            error_message: false,
            download_data: false,
            progress_info: false,
            data: false,
            open: false,
            fileType: 'xlsx',
            data_original: false,
            simulated_data: false,
            slider_values: {},
            graph_filters: [],
            graph_filters_original: [],
            graph_filter_menu_open: false,
            graph_filter_menu_anchorEl: false,
            graph_multiple_filter_menu_anchorEl: false,
            graph_multiple_filter_menu_open: false,
            filter_search_value: '',
            checked: false,
            search: '',
            filter_index: 0,
            option_index: 0,
            isPaperVisible: false,
            save_scenario_dialog_open: false,
            save_as_scenario_dialog_open: false,
            notification: null,
            traceList: false,
            alert_widget_type: false,
            savedScenarios: [],
            alert_data: null,
            extraLoader: false,
            extraLoaderMessage: null,
            extraLoaderToSpecificUser: null,
            download_image_data: false,
            multiple_update_menu: null,
            updateMenuWidth: null,
            simulator_stored_data: null
        };
        this.getScenarios = this.getScenarios.bind(this);
        this.loadScenario = this.loadScenario.bind(this);
        this.handleSimulatorChange = this.handleSimulatorChange.bind(this);
        this.socket = fetch_socket_connection();
        this.containerRef = React.createRef();
        this.togglePaperVisibility = this.togglePaperVisibility.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.toggleSelectAll = this.toggleSelectAll.bind(this);
    }
   

    componentDidMount() {
        this.initializeSelectedColumns();
        const { table_headers } = this.props?.data?.data?.value || {};
        if (table_headers?.length > 0) {
            this.setState({ tableHeaders: table_headers });
        }

        if (this.props.data) {
            this.onResponseGetWidget(JSON.parse(JSON.stringify(this.props.data)));
        } else {
            this.refreshWidget();
        }
        if (this.props?.source || this.props?.title) {
            let screen = this.props?.source?.split('>>')[1].trim();
            let widget = this.props?.title.trim();
            this.socket['socket_product']?.emit('init_progress_loader_component', {
                app_id: this.props.app_id,
                screen_name: screen,
                widget_name: widget
            });
            this.socket['socket_product']?.on(
                'progress_loader_' + this.props.app_id + '#' + screen + '#' + widget,
                (data) => {
                    this.setState((prevState) => ({
                        ...prevState,
                        progress_info: data,
                        extraLoader:
                            'extra_loader' in data ? data.extra_loader : this.state.extraLoader,
                        extraLoaderMessage:
                            'extra_loader_message' in data
                                ? data.extra_loader_message
                                : this.state.extraLoaderMessage,
                        extraLoaderToSpecificUser:
                            'extra_loader_to_specific_user' in data
                                ? data.extra_loader_to_specific_user
                                : this.state.extraLoaderToSpecificUser,
                        data: data?.widget_value || this.state.data
                    }));
                }
            );
        }
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    handleFileTypeChange = (event) => {
        this.setState({ fileType: event.target.value });
    };
    togglePaperVisibility = () => {
        this.setState((prevState) => ({
            isPaperVisible: !prevState.isPaperVisible
        }));
    };

    handleClickOutside(event) {
        if (this.containerRef.current && !this.containerRef.current.contains(event.target)) {
            this.setState({ isPaperVisible: false });
        }
    }

    componentWillUnmount() {
        if (this.props.source || this.props.title) {
            let screen = this.props?.source?.split('>>')[1].trim();
            let widget = this.props?.title.trim();
            this.socket['socket_product']?.emit('stop_progress_loader', {
                app_id: this.props.app_id,
                screen_name: screen,
                widget_name: widget
            });
            if (
                this.socket['socket_product']?.hasListeners(
                    'progress_loader_' + this.props.app_id + '#' + screen + '#' + widget
                )
            ) {
                this.socket['socket_product']?.removeListener(
                    'progress_loader_' + this.props.app_id + '#' + screen + '#' + widget
                );
            }
        }
        window.removeEventListener('resize', this.updateMenuWidth);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    updateMenuWidth = () => {
        const container = this?.updateMenuRef?.current;
        if (container) {
            const width = container?.clientWidth;
            const bodyWidth = this.bodyRef?.current?.clientWidth;
            const percentage = (width / bodyWidth) * 100;
            this.setState({ multiple_update_menu: percentage, updateMenuWidth: width });
        }
    };
    refreshWidget() {
        const {
            app_id,
            screen_id,
            details,
            selected_filters,
            screen_filter_settings,
            dataProvided,
            data
        } = this.props;
        if (dataProvided && data) {
            this.onResponseGetWidget(JSON.parse(JSON.stringify(data)));
            return;
        }
        this.setState({
            loading: true
        });
        if (screen_filter_settings) {
            getMultiWidget({
                app_id: app_id,
                screen_id: screen_id,
                details: details,
                filters: selected_filters,
                callback: this.onResponseGetWidget,
                data_state_key: this.state.data?.data_state_key
            });
        } else {
            getWidget({
                app_id: app_id,
                screen_id: screen_id,
                details: details,
                filters: selected_filters,
                callback: this.onResponseGetWidget,
                data_state_key: this.state.data?.data_state_key
            });
        }
    }

    deepEqual(obj1, obj2) {
        if (obj1 === obj2) return true;

        if (
            typeof obj1 !== 'object' ||
            obj1 === null ||
            typeof obj2 !== 'object' ||
            obj2 === null
        ) {
            return false;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }
        for (let key of keys1) {
            if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }

    componentDidUpdate(prevProps) {
        if (prevProps?.data?.data?.value !== this.props?.data?.data?.value) {
            this.initializeSelectedColumns();
        }
        if (
            this.props.simulatorTrigger &&
            this.state.data?.simulator_link &&
            !this.deepEqual(
                this.state.simulator_stored_data,
                JSON.parse(localStorage.getItem('simulator-data'))
            )
        ) {
            this.handleSimulatorTrigger();
        } else {
            const appScreenDetails = _.where(this.props.screens, { id: this.props.screenId });
            if (
                prevProps.screens != this.props.screens &&
                appScreenDetails[0]?.selected != this.state.checked &&
                prevProps.checkFlag !== this.props.checkFlag
            ) {
                this.setState({ checked: appScreenDetails[0]?.selected });
                this.onCheckboxValueChange(appScreenDetails[0]?.selected);
            }
            if (this.props.screenId !== prevProps.screenId) {
                if (this.props.screenId) {
                    this.setState({ checked: appScreenDetails[0]?.selected });
                    this.onCheckboxValueChange(appScreenDetails[0]?.selected);
                }
            }
            if (
                JSON.stringify(prevProps.selected_filters) !==
                JSON.stringify(this.props.selected_filters)
            ) {
                this.refreshWidget();
            } else if (prevProps.simulator_apply !== this.props.simulator_apply) {
                this.refreshWidget();
            } else if (prevProps.data !== this.props.data) {
                this.onResponseGetWidget(JSON.parse(JSON.stringify(this.props.data)));
            }
            if (this?.updateMenuRef?.current?.clientWidth !== this.state.updateMenuWidth) {
                this.updateMenuWidth();
                window.addEventListener('resize', this.updateMenuWidth);
            }
        }
    }

    getScenarios() {
        const { app_id, screen_id, details, selected_filters } = this.props;
        getScrenarios({
            app_id: app_id,
            screen_id: screen_id,
            widget_id: details.id,
            filters: selected_filters
            // callback:this.onResponseGetScrenario
        })
            .then((res) => {
                let scenarios = res['data'];
                this.setState({
                    savedScenarios: scenarios
                });
            })
            .catch((err) => {
                return err;
            });
    }

    loadScenario(scenario) {
        let timerId;
        this.setState({
            loading: true,
            slider_values: {}
        });
        var plot_details = this.setupPlot(scenario.scenarios_json);
        clearTimeout(timerId);
        timerId = setTimeout(this.loadScenarioState(plot_details), 2000);
    }

    loadScenarioState(plot_details) {
        this.setState({
            loading: false,
            error: false,
            error_message: false,
            data: plot_details.plot,
            simulated_data: plot_details.plot.simulator
        });
    }

    onClickGraphFilter = (event, filter_index) => {
        if (filter_index === 'view all') {
            this.setState({
                graph_multiple_filter_menu_open: filter_index,
                graph_multiple_filter_menu_anchorEl: event.currentTarget
            });
        } else {
            this.setState({
                graph_filter_menu_open: filter_index,
                graph_filter_menu_anchorEl: event.currentTarget
            });
        }
    };

    closeGraphFilterMenu = () => {
        this.setState({
            graph_filter_menu_open: false,
            graph_filter_menu_anchorEl: false
        });
    };
    closeGraphMultipleFilterMenu = () => {
        this.setState({
            graph_multiple_filter_menu_open: false,
            graph_multiple_filter_menu_anchorEl: false
        });
    };
    onSelectGraphFilterMenu = () => {};

    onChangeFilterSearchValue = (event) => {
        this.setState({
            filter_search_value: event.target.value
        });
    };
    onClickToggleFilter = (filter_index, value, selected_value) => {
        this.onClickFilterOption(selected_value, filter_index);
    };
    renderChartFilters = () => {
        const { classes } = this.props;
        // const longerUpdateMenu=this.state.graph_filters.length>4
        const longerUpdateMenu = this.state.multiple_update_menu > 75;
        return [
            _.map(
                this.state.graph_filters,
                function (filter_item, filter_index) {
                    if (
                        this.state?.toggleUpdateMenu &&
                        this.state.toggleUpdateMenu?.includes(filter_index)
                    ) {
                        const elementProps = {
                            labelLeft: filter_item.options[0]?.label,
                            labelRight: filter_item.options[1]?.label,
                            id: filter_index,
                            defaultValue: filter_item.options[0].selected === true ? false : true,
                            position: filter_item?.position
                        };
                        const { classes } = this.props;
                        const togglePosition =
                            filter_item.position === 'tl' || filter_item.position === 'bm'
                                ? 'toggle'
                                : null;
                        return (
                            <div
                                key={'chart_filter_' + filter_index}
                                className={clsx(
                                    classes.graphOptionContainer,
                                    classes.graphToggleContainer,
                                    filter_item?.hide && classes.graphHideUpdateMenu
                                )}
                                id={togglePosition}
                            >
                                <CodxToggleSwitch
                                    elementProps={elementProps}
                                    onChange={this.onClickToggleFilter}
                                    classes={classes}
                                />
                            </div>
                        );
                    } else {
                        var value = false;
                        var options = _.map(
                            _.filter(
                                filter_item.options,
                                function (option_instance) {
                                    if (option_instance.selected) {
                                        value = option_instance.label;
                                    }

                                    if (this.state.filter_search_value !== '') {
                                        return (
                                            option_instance.label
                                                .toLowerCase()
                                                .indexOf(
                                                    this.state.filter_search_value.toLowerCase()
                                                ) !== -1
                                        );
                                    } else {
                                        return true;
                                    }
                                },
                                this
                            ),
                            function (option_item, option_index) {
                                return (
                                    <MenuItem
                                        key={'filter_option_' + filter_index + '_' + option_index}
                                        value={option_item.label}
                                        classes={{
                                            root: classes.graphFilterMenuItem
                                        }}
                                        className={
                                            option_item?.selected
                                                ? classes.graphFilterMenuItemSelected
                                                : ''
                                        }
                                        onClick={() =>
                                            this.onClickFilterOption(
                                                option_item.label,
                                                filter_index
                                            )
                                        }
                                    >
                                        {option_item.label}
                                    </MenuItem>
                                );
                            },
                            this
                        );

                        if (filter_item.options.length > 9) {
                            options.splice(
                                0,
                                0,
                                <MenuItem
                                    key={'filter_option_search_' + filter_index}
                                    classes={{
                                        root: classes.graphFilterMenuSearchItem
                                    }}
                                >
                                    <Input
                                        className={classes.graphFilterMenuSearchInput}
                                        variant="filled"
                                        placeholder="search..."
                                        value={this.state.filter_search_value}
                                        onChange={this.onChangeFilterSearchValue}
                                    />
                                    <Search
                                        fontSize="large"
                                        className={classes.graphFilterMenuSearchIcon}
                                    />
                                </MenuItem>
                            );
                        }

                        return !longerUpdateMenu ? (
                            <div
                                key={'chart_filter_' + filter_index}
                                className={clsx(
                                    classes.graphOptionContainer,
                                    filter_item?.hide && classes.graphHideUpdateMenu,
                                    this.state.graph_filter_menu_open === filter_index
                                        ? classes.selectedOption
                                        : ''
                                )}
                            >
                                <div
                                    onClick={(event) =>
                                        this.onClickGraphFilter(event, filter_index)
                                    }
                                    className={classes.ValueIconContianer}
                                >
                                    <Typography className={classes.graphOptionLabel} variant="h5">
                                        {filter_item.name && filter_item.name.trim() !== ''
                                            ? `${filter_item.name.trim()} :`
                                            : 'Option ' + (filter_index + 1)}
                                    </Typography>
                                    <div className={classes.graphOptionValue}>
                                        <Typography
                                            variant="h5"
                                            className={classes.graphOptionValueType}
                                        >
                                            {value}
                                        </Typography>
                                        {this.state.graph_filter_menu_open === filter_index ? (
                                            <ExpandLess
                                                fontSize="large"
                                                className={classes.graphOptionIcon}
                                            />
                                        ) : (
                                            <ExpandMore
                                                fontSize="large"
                                                className={classes.graphOptionIcon}
                                            />
                                        )}
                                    </div>
                                </div>
                                <br />
                                <Popover
                                    key={'chart_filter_menu_' + filter_index}
                                    keepMounted
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    anchorEl={this.state.graph_filter_menu_anchorEl}
                                    open={this.state.graph_filter_menu_open === filter_index}
                                    onClose={this.closeGraphFilterMenu}
                                >
                                    <div className={classes.filterMenuContainer}>{options}</div>
                                </Popover>
                            </div>
                        ) : (
                            <div
                                key={'chart_filter_' + filter_index}
                                className={clsx(
                                    classes.graphOptionContainerOne,
                                    filter_item?.hide && classes.graphHideUpdateMenu
                                )}
                            >
                                <div
                                    onClick={(event) =>
                                        this.onClickGraphFilter(event, filter_index)
                                    }
                                    className={
                                        this.state.graph_filter_menu_open === filter_index
                                            ? classes.selectedLabel
                                            : ''
                                    }
                                    // style={{backgroundColor:'blue',maxHeight:"20rem",overflowY:'auto'}}
                                >
                                    <Typography
                                        className={classes.graphOptionLabelone}
                                        variant="h5"
                                    >
                                        {filter_item.name && filter_item.name.trim() !== ''
                                            ? filter_item.name.trim()
                                            : 'Option ' + (filter_index + 1)}
                                    </Typography>
                                    <div className={classes.graphOptionValueOne}>
                                        {this.state.graph_filter_menu_open === filter_index ? (
                                            <KeyboardArrowLeftIcon fontSize="large" />
                                        ) : (
                                            <KeyboardArrowRightIcon fontSize="large" />
                                        )}
                                    </div>
                                </div>
                                <br />
                                <Popover
                                    key={'chart_filter_menu_' + filter_index}
                                    keepMounted
                                    anchorEl={this.state.graph_filter_menu_anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    open={this.state.graph_filter_menu_open === filter_index}
                                    onClose={this.closeGraphFilterMenu}
                                >
                                    <div className={classes.filterMenuContainer}>{options}</div>
                                </Popover>
                            </div>
                        );
                    }
                },
                this
            ),
            <br key="chart-filters-clear" />
        ];
    };
    getCombinationUpdateMenu = (current_data, graph_filters) => {
        const combinationUpdateMenu = current_data?.combinationPlot;
        const search = this.state.search;

        let combinationVisibleArray;

        const possibleCombination = [];
        if (combinationUpdateMenu) {
            current_data['layout']['updatemenus'].forEach((el, elIndex) => {
                if (!graph_filters[elIndex].hide) {
                    possibleCombination.push(el.buttons[el.active].label);
                }
            });
            const combinationLabel = possibleCombination.join('-');
            for (let el of combinationUpdateMenu) {
                if (el.label === combinationLabel) {
                    combinationVisibleArray = el['args'];
                    break;
                }
            }
        }
        if (combinationVisibleArray) {
            _.each(combinationVisibleArray, function (filter_item) {
                current_data['layout']['yaxis']['title'] = filter_item?.yaxis
                    ? {
                          ...current_data['layout']['yaxis']['title'],
                          text: filter_item['yaxis']['title']
                      }
                    : current_data['layout']['yaxis']['title'];

                current_data['layout']['xaxis']['title'] = filter_item?.xaxis
                    ? {
                          ...current_data['layout']['xaxis']['title'],
                          text: filter_item['xaxis']['title']
                      }
                    : current_data['layout']['xaxis']['title'];

                if (filter_item['visible']) {
                    var visible = filter_item['visible'];
                    current_data['data'] = _.map(
                        current_data['data'],
                        function (data_item, trace_index) {
                            data_item.visible =
                                visible[trace_index] &&
                                (data_item.text + '').toLowerCase().includes(search);
                            return data_item;
                        }
                    );
                } else {
                    return;
                }
            });
        }
        return combinationVisibleArray;
    };

    onClickFilterOption = (selected_value, filter_index) => {
        var graph_filters = this.state.graph_filters;
        //Cloning graph_filters_original
        const graph_filters_original = this.state.graph_filters_original.map((a) => ({ ...a }));
        var option_index = false;
        var current_data = this.state.data;
        const search = this.state.search;
        let hideMenuItems;
        graph_filters = _.map(graph_filters, function (filter_item, filter_item_index) {
            if (filter_index === filter_item_index) {
                filter_item.options = _.map(
                    filter_item.options,
                    function (option_item, option_item_index) {
                        if (selected_value === option_item.label) {
                            option_item.selected = true;
                            option_index = option_item_index;
                        } else {
                            option_item.selected = false;
                        }
                        return option_item;
                    }
                );
            } else {
                if (
                    current_data?.layout?.updatemenus &&
                    current_data?.layout?.updatemenusrelations
                ) {
                    let relationMappings = current_data.layout.updatemenusrelations;
                    const searchIndex = relationMappings.findIndex(
                        (el) => el.source === filter_item.name
                    );

                    if (searchIndex !== -1) {
                        let relationMapper = relationMappings[searchIndex];
                        let newOptions = graph_filters_original[filter_item_index].options.filter(
                            (option_item) =>
                                relationMapper.mappings[selected_value].includes(option_item.label)
                        );

                        if (newOptions.length > 0) newOptions[0].selected = true;
                        filter_item.options = newOptions;
                    }
                }
            }
            if (filter_item.hideMenus && filter_index === filter_item_index) {
                //filter_item.hideMenus[selected_value]
                hideMenuItems = filter_item.hideMenus;
            }
            return filter_item;
        });

        if (hideMenuItems) {
            graph_filters.map((filter_item) => {
                if (hideMenuItems[selected_value]?.includes(filter_item.name)) {
                    filter_item.hide = true;
                } else {
                    filter_item.hide = false;
                }
                return filter_item;
            });
        }

        // Making Update In Plotly's Internal Data
        current_data = this.handleInterconnectedUpdateMenus(
            JSON.parse(JSON.stringify(this.state.data_original)),
            selected_value,
            filter_index
        );

        current_data['layout']['updatemenus'][filter_index].active = option_index;
        current_data['layout']['updatemenus'][filter_index].showActive = true;
        let combinationVisibleArray = this.getCombinationUpdateMenu(current_data, graph_filters);
        var chart_option_args =
            current_data['layout']['updatemenus'][filter_index]['buttons'][option_index]['args'];
        if (!combinationVisibleArray) {
            _.each(chart_option_args, function (filter_item) {
                if (filter_item['visible']) {
                    var visible = filter_item['visible'];
                    current_data['data'] = _.map(
                        current_data['data'],
                        function (data_item, trace_index) {
                            data_item.visible =
                                visible[trace_index] &&
                                (data_item.text + '').toLowerCase().includes(search);
                            return data_item;
                        }
                    );
                } else if (filter_item['yaxis']) {
                    if (!current_data['layout']['yaxis']) {
                        current_data['layout']['yaxis'] = {};
                    }
                    current_data['layout']['yaxis']['title'] = {
                        ...current_data['layout']['yaxis']['title'],
                        text: filter_item['yaxis']['title']
                    };
                    if (filter_item['yaxis']['range'])
                        current_data['layout']['yaxis']['range'] = filter_item['yaxis']['range'];
                    if (filter_item['yaxis']['tickprefix'])
                        current_data['layout']['yaxis']['tickprefix'] =
                            filter_item['yaxis']['tickprefix'];
                    if (filter_item['yaxis']['ticksuffix'])
                        current_data['layout']['yaxis']['ticksuffix'] =
                            filter_item['yaxis']['ticksuffix'];
                } else if (filter_item['xaxis']) {
                    if (!current_data['layout']['xaxis']) {
                        current_data['layout']['xaxis'] = {};
                    }
                    current_data['layout']['xaxis']['title'] = {
                        ...current_data['layout']['xaxis']['title'],
                        text: filter_item['xaxis']['title']
                    };
                    if (filter_item['xaxis']['range'])
                        current_data['layout']['xaxis']['range'] = filter_item['xaxis']['range'];
                    if (filter_item['xaxis']['tickprefix'])
                        current_data['layout']['xaxis']['tickprefix'] =
                            filter_item['xaxis']['tickprefix'];
                    if (filter_item['xaxis']['ticksuffix'])
                        current_data['layout']['xaxis']['ticksuffix'] =
                            filter_item['xaxis']['ticksuffix'];
                } else {
                    return;
                }
            });
        }

        this.setState({
            graph_filters: graph_filters,
            data: current_data,
            graph_filter_menu_open: false,
            graph_filter_menu_anchorEl: false,
            filter_search_value: '',
            filter_index,
            option_index,
            multiple_update_menu: null,
            graph_multiple_filter_menu_open: false,
            graph_multiple_filter_menu_anchorEl: false
        });
    };

    setupPlot = (current_value) => {
        const { details } = this.props;

        var trace_config = details.config.traces;

        if (current_value['layout']) {
            var graph_filters = [];
            if (
                current_value['layout']['updatemenus'] &&
                current_value['layout']['updatemenus'].length > 0
            ) {
                if (!current_value['frames']) {
                    current_value['layout']['updatemenus'] = _.map(
                        current_value['layout']['updatemenus'],
                        function (update_menu_item, updatemenu_index) {
                            graph_filters.push({
                                name: update_menu_item.name
                                    ? update_menu_item.name
                                    : 'update_menu_' + updatemenu_index,
                                options: _.map(
                                    update_menu_item.buttons,
                                    function (button_item, button_index) {
                                        return {
                                            label: button_item.label,
                                            selected:
                                                (current_value['data'] &&
                                                    button_item.args.length > 0 &&
                                                    button_item.args[0] &&
                                                    JSON.stringify(button_item.args[0].visible) ===
                                                        JSON.stringify(
                                                            _.map(
                                                                current_value['data'],
                                                                function (data_item) {
                                                                    return (
                                                                        data_item.visible !== false
                                                                    );
                                                                }
                                                            )
                                                        )) ||
                                                button_index === update_menu_item.active
                                        };
                                    }
                                ),
                                hideMenus: update_menu_item?.hideMenus
                                    ? update_menu_item.hideMenus
                                    : false,
                                hide: update_menu_item?.hide ? update_menu_item.hide : false,
                                position: update_menu_item?.position
                                    ? update_menu_item.position
                                    : null
                            });
                            update_menu_item.visible = false;
                            return update_menu_item;
                        }
                    );
                }
            }
        }

        if (current_value['data']) {
            current_value['data'] = _.filter(current_value['data'], function (data_item, index) {
                var trace_config_selected = _.find(trace_config, function (trace_config_item) {
                    return trace_config_item.index === index;
                });

                if (trace_config_selected && trace_config_selected['hide']) {
                    return false;
                } else {
                    return true;
                }
            });
        }

        return {
            plot: current_value,
            filters: graph_filters
        };
    };

    handleInterconnectedUpdateMenus = (plotly_data, selected_value, filter_index) => {
        if (plotly_data?.layout?.updatemenus && plotly_data?.layout?.updatemenusrelations) {
            let updateMenus = plotly_data.layout.updatemenus;
            plotly_data.layout.updatemenus = updateMenus.map((element, index) => {
                if (filter_index !== index) {
                    const searchIndex = plotly_data.layout.updatemenusrelations.findIndex(
                        (el) => el.source === element.name
                    );
                    if (searchIndex !== -1) {
                        let buttons = [];
                        plotly_data.layout.updatemenusrelations.forEach((updateMenuRelation) => {
                            if (element.name === updateMenuRelation.source && element.buttons) {
                                let newArray = updateMenuRelation.mappings[selected_value];
                                let finalArray = element.buttons.filter((button) =>
                                    newArray.includes(button.label)
                                );
                                buttons = [...finalArray];
                            }
                            if (buttons.length > 0) element.active = 0;
                            element.buttons = buttons;
                            return element;
                        });
                    }
                }
                return element;
            });
        }
        return plotly_data;
    };

    onResponseGetWidget = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            this.setState({
                loading: false,
                error: true,
                error_message: response_data.message,
                data: false,
                simulated_data: false
            });

            return;
        }

        const { simulator_apply } = this.props;

        var widget_value_id =
            response_data['data']['widget_value_id'] || this.props.widget_value_id;
        var current_value = response_data['data']['value'];
        var simulated_value = response_data['data']['simulated_value'];
        var isToggleUpdateMenu = response_data['data']['value']['toggleUpdateMenu'] || false;
        var isCombinationUpdateMenu = response_data['data']['value']['combinationPlot'] || false;
        var extraLoader = response_data['data']['value']['extra_loader'] || false;
        var extraLoaderMessage = response_data['data']['value']['extra_loader_message'] || null;
        var extraLoaderToSpecificUser =
            response_data['data']['value']['extra_loader_to_specific_user'] || null;

        //adding the current widget as a valid widget for the current screen
        //allows screen level checkbox's("select all items")  checking and unchecking against count changes w.r.t  max possible count per screen
        if (
            widget_value_id &&
            this.props?.screenId &&
            !(
                this.isGridTable(current_value) ||
                this.isExpandableTable(current_value) ||
                this.isTable(current_value) ||
                this.isCustomComponent(current_value) ||
                this.isTableSimulator(current_value) ||
                current_value?.simulated_value ||
                current_value?.simulator
            ) &&
            Object.keys(current_value)?.length
        ) {
            this.props.validWidgetsMaxCountUpdate({
                screenId: this.props.screen_id,
                widget_value_id
            });
        }

        if (
            (current_value &&
                (current_value['is_alternate_simulator_type_a'] ||
                    current_value['is_alternate_simulator_type_c'])) ||
            current_value['is_alternate_simulator_type_d'] ||
            current_value['is_alternate_simulator_type_e'] ||
            simulated_value
        ) {
            this.getScenarios();
        }
        if (simulator_apply && simulated_value) {
            if (current_value.simulator && !simulated_value.simulator) {
                simulated_value.simulator = current_value.simulator;
            }
            current_value = simulated_value;
        }

        if (response_data?.data?.value?.is_kpi) {
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: current_value,
                download_data: current_value.download_data,
                simulated_data: null,
                graph_filters: null,
                widget_value_id: widget_value_id,
                extraLoader: extraLoader,
                extraLoaderMessage: extraLoaderMessage,
                extraLoaderToSpecificUser: extraLoaderToSpecificUser,
                download_image_data: current_value.download_image_data
            });
        } else if (response_data?.data?.value?.is_grid_table) {
            try {
                var plot_details = this.setupPlot(current_value);
                const switchViewIndex =
                    response_data?.switch_view && response_data?.switch_view_index;

                const newState = {
                    graph_filters_original: plot_details.filters
                        ? plot_details.filters.map((a) => ({ ...a }))
                        : [],
                    loading: false,
                    error: false,
                    error_message: false,
                    data: {
                        ...plot_details.plot,
                        ...(response_data?.switch_view && { switchViewIndex }),
                        download_data: {
                            table_data: JSON.stringify(current_value.tableProps.rowData)
                        }
                    },
                    download_data: current_value.tableProps.rowData,
                    simulated_data: simulated_value,
                    graph_filters: plot_details.filters,
                    widget_value_id: widget_value_id,
                    alert_data: current_value,
                    toggleUpdateMenu: isToggleUpdateMenu,
                    extraLoader: extraLoader,
                    extraLoaderMessage: extraLoaderMessage,
                    extraLoaderToSpecificUser: extraLoaderToSpecificUser,
                    data_original: JSON.parse(JSON.stringify(plot_details.plot))
                };

                this.setState(newState);
            } catch (err) {
                return err;
            }
        } else if (response_data?.data?.value?.isExpandable) {
            try {
                plot_details = this.setupPlot(current_value);
                const switchViewIndex =
                    response_data?.switch_view && response_data?.switch_view_index;

                let rows = [];
                current_value.rows.forEach((row) => {
                    if (row.data?.rows) {
                        row.data?.rows.forEach((row_data) => {
                            const updatedRowData = { ...row, ...row_data };
                            delete updatedRowData.collapse;
                            delete updatedRowData.data;
                            rows.push(updatedRowData);
                        });
                    } else {
                        const updatedRowData = { ...row };
                        delete updatedRowData.collapse;
                        rows.push(updatedRowData);
                    }
                });
                const newState = {
                    graph_filters_original: plot_details.filters
                        ? plot_details.filters.map((a) => ({ ...a }))
                        : [],
                    loading: false,
                    error: false,
                    error_message: false,
                    data: {
                        ...plot_details.plot,
                        ...(response_data?.switch_view && { switchViewIndex }),
                        download_data: {
                            table_data: rows
                        }
                    },
                    download_data: rows,
                    simulated_data: simulated_value,
                    graph_filters: plot_details.filters,
                    widget_value_id: widget_value_id,
                    alert_data: current_value,
                    toggleUpdateMenu: isToggleUpdateMenu,
                    extraLoader: extraLoader,
                    extraLoaderMessage: extraLoaderMessage,
                    extraLoaderToSpecificUser: extraLoaderToSpecificUser,
                    data_original: JSON.parse(JSON.stringify(plot_details.plot))
                };
                this.setState(newState);
            } catch (err) {
                return err;
            }
        } else {
            if (this.isHTML(current_value)) {
                this.setState({
                    loading: false,
                    error: false,
                    error_message: false,
                    data: current_value,
                    download_data: false,
                    simulated_data: simulated_value,
                    graph_filters: null,
                    widget_value_id: widget_value_id,
                    extraLoader: extraLoader,
                    extraLoaderMessage: extraLoaderMessage,
                    extraLoaderToSpecificUser: extraLoaderToSpecificUser
                });
            } else {
                plot_details = this.setupPlot(current_value);
                const switchViewIndex =
                    response_data?.switch_view && response_data?.switch_view_index;

                this.setState({
                    loading: false,
                    error: false,
                    error_message: false,
                    data: {
                        ...plot_details.plot,
                        ...(response_data?.switch_view && { switchViewIndex })
                    },
                    data_original: JSON.parse(JSON.stringify(plot_details.plot)), //Cloning Data
                    download_data: current_value.download_data,
                    simulated_data: simulated_value,
                    graph_filters: plot_details.filters,
                    graph_filters_original: plot_details.filters
                        ? plot_details.filters.map((a) => ({ ...a }))
                        : [], //Cloning graph_filters
                    widget_value_id: widget_value_id,
                    alert_data: current_value,
                    toggleUpdateMenu: isToggleUpdateMenu,
                    extraLoader: extraLoader,
                    extraLoaderMessage: extraLoaderMessage,
                    extraLoaderToSpecificUser: extraLoaderToSpecificUser
                });
            }
        }

        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));

        if (payloadMap && payloadMap.size) {
            var payloadObject = payloadMap.get(this.props.app_id);
            if (payloadObject && widget_value_id) {
                var widgetValueIds = _.pluck(payloadObject, 'app_screen_widget_value_id');
                if (widgetValueIds.includes(widget_value_id)) {
                    if (widget_value_id && this.props?.screenId && current_value?.data) {
                        this.props.addToStoriesCount({
                            screenId: this.props.screen_id,
                            widget_value_id
                        });
                    }
                    this.setState({ checked: true });
                }
            }
        }
        if (isCombinationUpdateMenu && plot_details) {
            this.getCombinationUpdateMenu(current_value, plot_details?.filters);
        }
    };

    onClickSimulator = () => {
        this.setState({
            show_simulator: true,
            request_id: 0
        });
    };

    onResetSimulator = () => {
        const { parent_obj } = this.props;

        parent_obj.onApplySimulator();

        this.setState({
            show_simulator: false
        });
    };

    onCloseSimulator = () => {
        this.setState({
            show_simulator: false,
            request_id: 0
        });
    };

    onLoadScenario = (scenario_data) => {
        this.setState({
            data: {
                ...this.state.data,
                download_data: scenario_data.download_data
            },
            download_data: scenario_data.download_data
        });
    };

    setRequestId = (request_id) => {
        this.setState({
            request_id: request_id
        });
    };
    onApplySimulator = () => {
        const { parent_obj, details, app_id } = this.props;

        if (
            !this.state.data.simulator ||
            !this.state.data.simulator.code ||
            (this.state.data.simulator.code && this.state.data.simulator.code === 'Fake')
        ) {
            if (details && details.config && details.config.action_link) {
                parent_obj.onSimulatorApplyDrilldown(details.config.action_link);
            } else {
                parent_obj.onApplySimulator(true);
            }
        } else {
            var inputs = {};

            _.each(
                this.state.data.simulator.options.readonly_headers,
                function (section, section_index) {
                    inputs[section] = {};

                    _.each(
                        this.state.data.simulator.options.fields[section_index],
                        function (field_item, field_index) {
                            inputs[section][field_item.name] = this.state.slider_values[
                                section_index + '_' + field_index
                            ]
                                ? this.state.slider_values[section_index + '_' + field_index]
                                : field_item.values;
                        },
                        this
                    );
                },
                this
            );

            this.setState({
                loading: true
            });

            executeCode({
                app_id: app_id,
                code: this.state.data.simulator.code,
                inputs: inputs,
                selected_filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + app_id + '_' + this.props.screen_id
                    )
                ),
                callback: this.onResponseExecuteCode
            });
        }
    };

    onSaveScenario = () => {
        this.setState({
            save_scenario_dialog_open: true
        });
    };
    onSaveasScenario = () => {
        this.setState({
            save_as_scenario_dialog_open: true
        });
    };
    handleSaveScenario = (name, description, version,isEditing) => {
        const saveCallback = (response) => {
            if (response && response['status'] === 200) {
                this.setState({
                    notification: { message: response.message },
                    notificationOpen: true
                });
                this.getScenarios();
            } else {
                this.setState({
                    notification: {
                        severity: 'error',
                        message: response.error ? response.error : response.message
                    },
                    notificationOpen: true
                });
            }
        };
        this.setState({
            save_scenario_dialog_open: false,
            save_as_scenario_dialog_open: false
        });
        let scenario = {
            scenarioname: name,
            comment: description,
            version: version,
            filters_json: this.props.selected_filters,
            app_id: Number(this.props.app_id),
            app_screen_id: this.props.screen_id,
            widget_id: this.props.details.id,
            scenarios_json: isEditing
            ? this.props.selectedScenario
            : this.state.data?.simulator_options
        };
        saveScrenario({
            payload: scenario,
            callback: saveCallback
        });
    };

    onCloseSaveScenarioDialog = () => {
        this.setState({
            save_scenario_dialog_open: false
        });
    };
    onCloseSaveAsScenarioDialog = () => {
        this.setState({
            save_as_scenario_dialog_open: false
        });
    };

    onResponseExecuteCode = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            this.setState({
                loading: false,
                error: true,
                error_message: response_data.status.message
            });
            return;
        }

        if (
            response_data &&
            response_data.data &&
            response_data.data.plot &&
            response_data.data.plot.data &&
            response_data.data.plot.layout
        ) {
            var plot_details = this.setupPlot(response_data.data.plot);
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: {
                    ...this.state.data,
                    data: plot_details.plot.data,
                    layout: plot_details.plot.layout
                }
            });
        }
    };

    onSliderChange = (value, header_index, field_index) => {
        let distributation_info = { is_distributable: false };
        if (this.state.data.simulator.options.distribution_header)
            distributation_info =
                this.state.data.simulator.options.distribution_header[header_index];
        if (distributation_info.is_distributable === false) {
            this.setState({
                slider_values: {
                    ...this.state.slider_values,
                    [header_index + '_' + field_index]: value
                }
            });
        } else {
            // List of keys to check
            let sliders_keys_to_check = [];
            // Dictionary for key value pairs to check
            let sliders_to_check = {};
            // Dictionary of keys which we should compare from the original values.
            // These will be updated with the corresponding values from the state
            let slider_set_to_compare = {};
            // sum of current sliders
            let current_slider_values_sum = 0;
            // get the already existing slider states for the header_index
            sliders_keys_to_check = _.filter(Object.keys(this.state.slider_values), (x) => {
                return x[0] === header_index;
            });
            // get the values and store in a dictionary
            sliders_keys_to_check.forEach((key) => {
                sliders_to_check[key] = this.state.slider_values[key];
            });
            // get the original data
            this.state.data.simulator.options.fields[header_index].forEach((item, index) => {
                slider_set_to_compare[header_index + '_' + index] = item.values;
            });
            // updating the orignal data with the latest data from the state
            let updated_slider_values = {
                ...slider_set_to_compare,
                ...sliders_to_check,
                [header_index + '_' + field_index]: value
            };
            // getting the sum
            current_slider_values_sum = Object.values(updated_slider_values).reduce(
                (sum, item) => sum + item
            );
            // Update the state only if the sum is less than the max value, else pass the event
            if (current_slider_values_sum <= distributation_info.max_value) {
                this.setState({
                    slider_values: {
                        ...this.state.slider_values,
                        [header_index + '_' + field_index]: value
                    }
                });
            }
        }
    };

    renderSimulatorSliders = (offset, limit) => {
        const { classes } = this.props;

        return _.map(
            this.state.data.simulator.options.readonly_headers,
            function (readonly_header, header_index) {
                if (header_index >= offset && header_index < offset + limit) {
                    return (
                        <div
                            key={'simulator_section_' + header_index}
                            className={classes.simulatorTableRow}
                        >
                            <Typography className={classes.simulatorSectionHeader} variant="h5">
                                {readonly_header ? readonly_header.toLowerCase() : ''}
                            </Typography>
                            {this.state.data.simulator.options.fields[header_index].map(
                                (field_item, field_index) => {
                                    const slider_value = this.state.slider_values[
                                        header_index + '_' + field_index
                                    ]
                                        ? this.state.slider_values[header_index + '_' + field_index]
                                        : field_item.values;
                                    const slider_range = this.getSliderValueRange(
                                        field_item.values
                                    );
                                    return (
                                        <Grid
                                            container
                                            spacing={0}
                                            key={field_index}
                                            className={classes.simulatorRowWrapper}
                                        >
                                            <Grid item xs={5}>
                                                <Typography
                                                    key={
                                                        'simulator_header_' +
                                                        header_index +
                                                        '_' +
                                                        field_item.name
                                                    }
                                                    className={classes.simulatorSliderLabel}
                                                    variant="h5"
                                                >
                                                    {field_item.name
                                                        ? field_item.name.toLowerCase()
                                                        : ''}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Slider
                                                    className={classes.simulatorSliderInput}
                                                    key={
                                                        'slider_' + header_index + '_' + field_index
                                                    }
                                                    value={slider_value}
                                                    step={field_item.step || 0.01}
                                                    max={
                                                        field_item.range
                                                            ? field_item.range[1]
                                                            : field_item.max
                                                            ? field_item.max
                                                            : field_item.is_percent
                                                            ? 100
                                                            : slider_range[1]
                                                    }
                                                    min={
                                                        field_item.range
                                                            ? field_item.range[0]
                                                            : field_item.min
                                                            ? field_item.min
                                                            : field_item.is_percent
                                                            ? 0
                                                            : slider_range[0]
                                                    }
                                                    onChange={(event, new_value) =>
                                                        this.onSliderChange(
                                                            new_value,
                                                            header_index,
                                                            field_index
                                                        )
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Input
                                                    key={
                                                        'slider_input_' +
                                                        header_index +
                                                        '_' +
                                                        field_index
                                                    }
                                                    className={classes.simulatorSliderInputBox}
                                                    value={
                                                        (this.state.slider_values[
                                                            header_index + '_' + field_index
                                                        ]
                                                            ? this.state.slider_values[
                                                                  header_index + '_' + field_index
                                                              ]
                                                            : field_item.values) +
                                                        (field_item.is_percent ? '%' : '')
                                                    }
                                                    inputProps={{
                                                        'aria-label': `input-${field_index}`
                                                    }}
                                                    readOnly
                                                />
                                            </Grid>
                                        </Grid>
                                    );
                                }
                            )}
                        </div>
                    );
                } else {
                    return '';
                }
            },
            this
        );
    };

    getSliderValueRange = (slider_value) => {
        if (slider_value > 0) {
            return [0, parseFloat(slider_value) * 1.5];
        } else {
            return [parseFloat(slider_value) * 1.5, parseFloat(slider_value) * -1 * 1.5];
        }
    };

    renderSimulatorGroups = () => {
        const { classes } = this.props;

        var split_sections = this.state.data.simulator.options.split.split('-');
        let col1 = !parseInt(split_sections[1]) && !this.state.data.simulator.optimize_options;
        return (
            <Grid
                key={'simulator_container'}
                container
                xs={12}
                spacing={2}
                className={classes.simulatorBodyContainer}
            >
                {parseInt(split_sections[0]) !== 0
                    ? [
                          <Grid
                              key={'simulator_sliders'}
                              item
                              xs={col1 ? 12 : this.state.data.simulator.optimize_options ? 4 : 6}
                              className={clsx(
                                  classes.simulatorBody,
                                  col1 ? classes.simulatorBodyFirst : ''
                              )}
                          >
                              {this.renderSimulatorSliders(0, parseInt(split_sections[0]))}
                          </Grid>
                      ]
                    : ''}
                {parseInt(split_sections[1]) !== 0
                    ? [
                          <Grid
                              key={'simulator_sections'}
                              item
                              xs={this.state.data.simulator.optimize_options ? 4 : 6}
                              className={split_sections[1] ? classes.simulatorBody : ''}
                          >
                              {this.renderSimulatorSliders(
                                  parseInt(split_sections[0]),
                                  parseInt(split_sections[1])
                              )}
                          </Grid>
                      ]
                    : null}
                {this.state.data.simulator.optimize_options ? (
                    <Grid
                        key={'simulator_optimize_section'}
                        item
                        xs={4}
                        className={clsx(classes.simulatorBody, classes.simulatorBodyLast)}
                    >
                        <Typography className={classes.simulatorSectionHeader} variant="h5">
                            {this.state.data.simulator.optimize_options.section_header ||
                                'Optimize for the goal below:'}
                        </Typography>
                        {_.map(
                            this.state.data.simulator.optimize_options.fields,
                            function (field_group) {
                                return _.map(field_group, function (field_item, field_index) {
                                    return (
                                        <Grid
                                            key={'simulator_groups_' + field_index}
                                            container
                                            spacing={2}
                                        >
                                            <Grid item xs={5}>
                                                <Typography
                                                    className={classes.simulatorOptimizeCellLabel}
                                                    variant="h5"
                                                >
                                                    {field_item.name}
                                                </Typography>
                                            </Grid>
                                            {field_item.sub_name ? (
                                                <Grid item xs={5}>
                                                    <Typography
                                                        className={
                                                            classes.simulatorOptimizeCellLabel
                                                        }
                                                        variant="h5"
                                                    >
                                                        ({field_item.sub_name})
                                                    </Typography>
                                                </Grid>
                                            ) : (
                                                <Grid item xs></Grid>
                                            )}
                                            <Grid item xs={2}>
                                                <Input
                                                    className={classes.simulatorOptimizeCellInput}
                                                    variant="filled"
                                                    value={field_item.value}
                                                    inputProps={{
                                                        'aria-label': `input-sim-${field_index}`
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    );
                                });
                            }
                        )}
                    </Grid>
                ) : null}
            </Grid>
        );
    };

    handleTableWidgetAction = async (params, isGridTable = true) => {
        this.setState({ loading: true });
        try {
            triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: params.actionName,
                    data: params.tableProps,
                    filters: JSON.parse(
                        sessionStorage.getItem(
                            'app_screen_filter_info_' +
                                this.props.app_id +
                                '_' +
                                this.props.screen_id
                        )
                    )
                },
                callback: (d) => {
                    if (!isGridTable) {
                        this.setState({
                            loading: false,
                            data: { ...d }
                        });
                    } else {
                        const rowData =
                            d.rowData ||
                            d.tableProps?.rowData ||
                            params?.tableProps?.rowData ||
                            this.state.data?.tableProps?.rowData;
                        const coldef =
                            d.coldef ||
                            d.tableProps?.coldef ||
                            params?.tableProps?.coldef ||
                            this.state.data?.tableProps?.coldef;
                        const gridOptions =
                            d.gridOptions ||
                            d.tableProps?.gridOptions ||
                            params?.tableProps?.gridOptions ||
                            this.state.data?.tableProps?.gridOptions;
                        this.setState({
                            loading: false,
                            error: false,
                            error_message: false,
                            data: {
                                ...this.state.data,
                                ...d,
                                assumptions: d.assumptions ?? this.state.data.assumptions,
                                tableProps: {
                                    rowData,
                                    coldef,
                                    gridOptions: {
                                        ...gridOptions,
                                        caption: d.tableCaption ?? gridOptions.tableCaption,
                                        errorMessage:
                                            d.tableErrorMessage ?? gridOptions.tableErrorMessage
                                    }
                                }
                            }
                        });
                    }
                    this.handleStateUpdateRequest({
                        notification: {
                            message: d.message,
                            severity: d.error ? 'error' : 'success'
                        },
                        ...d?.extra_dir
                    });
                }
            });
            this.props.onProgressCompleteAction();
        } catch (err) {
            this.setState({
                loading: false
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: err.message,
                    severity: 'error'
                }
            });
        }
    };

    handleDrillDown = async (e) => {
        return await triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: '__drill_down__',
                data: {
                    points: e.points.map((el) => ({
                        ...el,
                        fullData: undefined,
                        xaxis: undefined,
                        yaxis: undefined
                    })),
                    drill_down: e.drill_down
                },
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            }
        });
    };

    handleFetchPopoverData = async (e) => {
        return await triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: '__view_popover__',
                data: {
                    points: e.points.map((el) => ({
                        ...el,
                        fullData: undefined,
                        xaxis: undefined,
                        yaxis: undefined
                    })),
                    view_popover: e.view_popover
                },
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            }
        });
    };

    handleFetchDetailData = async (e) => {
        return await triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: '__view_detail__',
                data: {
                    points: e.points.map((el) => ({
                        ...el,
                        fullData: undefined,
                        xaxis: undefined,
                        yaxis: undefined
                    })),
                    view_detail: e.view_detail
                },
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            }
        });
    };

    handleDynamicPayloadPreset = () => {
        return {
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                data: { simulator_options: this.state.data.simulator_options },
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            }
        };
    };

    getSwitchViewData = (data) => {
        if (!data) return null;

        const viewIndex = this.state?.data?.switchViewIndex;

        return data.views?.length && data.views[viewIndex]?.data?.value;
    };

    handleDynamicFormAction = async (action_type, payloadData, data, showLoader = true) => {
        showLoader && this.setState({ loading: true });
        try {
            const result = await triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: action_type,
                    data: { simulator_options: this.state.data.simulator_options, ...payloadData },
                    filters: JSON.parse(
                        sessionStorage.getItem(
                            'app_screen_filter_info_' +
                                this.props.app_id +
                                '_' +
                                this.props.screen_id
                        )
                    )
                },
                callback: (d) => {
                    const switchViewData = this.getSwitchViewData(d);

                    this.setState({
                        loading: false,
                        error: false,
                        error_message: false,
                        data: {
                            ...this.state.data,
                            ...data,
                            ...d,
                            ...(d?.switch_view && switchViewData)
                        }
                    });
                    this.handleStateUpdateRequest({
                        notification: {
                            message: d.message,
                            severity: d.error ? 'error' : 'success'
                        },
                        ...d?.extra_dir
                    });
                }
            });
            if (action_type == 'upload') {
                this.handleStateUpdateRequest({
                    notification: {
                        message: 'File uploaded Succcesfully !',
                        severity: 'success'
                    }
                });
            }
            this.props.onProgressCompleteAction();
            return result;
        } catch (err) {
            this.setState({
                loading: false,
                data: {
                    ...this.state.data,
                    ...data
                }
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: err.message,
                    severity: 'error'
                }
            });
        }
    };

    handleFetchFormData = async (action_type, payloadData) => {
        return await triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: action_type,
                data: { simulator_options: this.state.data.simulator_options, ...payloadData },
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            }
        });
    };

    handleSimulatorTrigger = async () => {
        await triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: 'Simulator Trigger',
                data: { sim_data: JSON.parse(localStorage.getItem('simulator-data')) },
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            },
            callback: (d) => {
                this.setState({
                    data: d,
                    simulator_stored_data: JSON.parse(localStorage.getItem('simulator-data'))
                    // loading:false,
                });
            }
        });
    };

    handleWidgetFilterTrigger = async (data) => {
        // this.setState({ loading: true });
        await triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: 'Widget Filter Trigger',
                data: { selected_filter: data },
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            },
            callback: (d) => {
                this.setState({
                    data: d
                    // loading:false,
                });
            }
        });
    };

    handleWidgetLevelFilterTrigger = async (data, widgetTagValues) => {
        await triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: 'Widget Level Filter Trigger',
                data: { selected_filter: data },
                filters: JSON.parse(widgetTagValues)
            },
            callback: (d) => {
                this.setState({
                    data: d
                    // loading:false,
                });
            }
        });
    };

    handleCompareDataFilterTrigger = async (data) => {
        // this.setState({ loading: true });
        await triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: 'Compare Filter Trigger',
                data: { selected_filter: data?.selected_filter, scenarios: data?.scenarios },
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            },
            callback: (d) => {
                this.setState({
                    data: d
                    // loading:false,
                });
            }
        });
    };

    handleModalFormAction = async (action_type, payloadData, data) => {
        // this.setState({ loading: true });
        try {
            const d = await triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: action_type,
                    data: { simulator_options: this.state.data.simulator_options, ...payloadData },
                    filters: JSON.parse(
                        sessionStorage.getItem(
                            'app_screen_filter_info_' +
                                this.props.app_id +
                                '_' +
                                this.props.screen_id
                        )
                    )
                }
            });
            if (d.open) {
                return d;
            }
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: {
                    ...this.state.data,
                    ...data,
                    ...d
                }
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: d.message,
                    severity: d.error ? 'error' : 'success'
                },
                ...d?.extra_dir
            });
            if (d.error) {
                throw new Error(d.message);
            } else {
                this.setState({ loading: true });
                setTimeout(() => {
                    this.setState({ loading: false });
                }, 300);
                return true;
            }
        } catch (err) {
            this.setState({
                loading: false,
                data: {
                    ...this.state.data,
                    ...data
                }
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: err.message,
                    severity: 'error'
                }
            });
            throw err;
        }
    };

    handleAccordionTableSimulatorFetchTableData = async (params) => {
        return triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: params.actionType,
                data: params,
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            }
        });
    };

    handleAccordionTableSimulatorAction = async (params) => {
        return triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: params.actionType,
                data: params,
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            },
            callback: () => {
                this.props.onProgressCompleteAction();
            }
        });
    };

    handleImageCompAction = async (params) => {
        return triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                action_type: params?.actionType,
                data: params,
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            },
            callback: (d) => {
                this.setState({
                    data: d
                });
            }
        });
    };

    handleValidateValueChangeInGridTable = async (params) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                await triggerWidgetActionHandler({
                    screen_id: this.props.screen_id,
                    app_id: this.props.app_id,
                    payload: {
                        widget_value_id: this.state.widget_value_id,
                        action_type: params.validator,
                        data: params,
                        filters: JSON.parse(
                            sessionStorage.getItem(
                                'app_screen_filter_info_' +
                                    this.props.app_id +
                                    '_' +
                                    this.props.screen_id
                            )
                        )
                    },
                    callback: (d) => {
                        resolve(d);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    };

    handleStateUpdateRequest(params) {
        const { onStateUpdateRequest } = this.props;
        if (onStateUpdateRequest) {
            onStateUpdateRequest({
                tabActiveIndex: params.tabActiveIndex,
                refreshWidget: params.refreshWidget,
                notification: params.notification,
                config: params.config
            });
        } else {
            if (params.notification) {
                this.setState({
                    notification: params.notification,
                    notificationOpen: true
                });
            }
            if (params.refreshWidget) {
                this.refreshWidget();
            }
        }
    }

    handlePreLoaderAction = (params) => {
        const { isCancel, name, actionParams, quickAction, quickActionParams } = params;
        if (quickAction) {
            switch (quickAction) {
                case 'toaster':
                    this.setState({ notification: quickActionParams, notificationOpen: true });
                    break;
                default:
                    break;
            }
        }
        if (!isCancel) {
            this.setState({ loading: true });
            triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: name,
                    data: actionParams,
                    filters: JSON.parse(
                        sessionStorage.getItem(
                            'app_screen_filter_info_' +
                                this.props.app_id +
                                '_' +
                                this.props.screen_id
                        )
                    )
                },
                callback: (d) => {
                    this.props.updateDataStateKey(d?.data_state_key); // needed to maintain the current widget data state, if one widget renders multiple state of data/view
                    this.setState(
                        {
                            loading: false,
                            error: false,
                            error_message: false,
                            data: d
                        },
                        () => this.props.onProgressCompleteAction()
                    );
                }
            });
        }
    };

    handleWhiteSpaceDetectorAction = async ({ actionName, data }) => {
        this.setState({ loading: true });
        try {
            await triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: actionName,
                    data,
                    filters: JSON.parse(
                        sessionStorage.getItem(
                            'app_screen_filter_info_' +
                                this.props.app_id +
                                '_' +
                                this.props.screen_id
                        )
                    )
                },
                callback: (d) => {
                    this.setState({
                        loading: false,
                        error: false,
                        error_message: false,
                        data: {
                            ...this.state.data,
                            ...data,
                            ...d
                        }
                    });
                    this.handleStateUpdateRequest({
                        notification: {
                            message: d.message,
                            severity: d.error ? 'error' : 'success'
                        },
                        ...d?.extra_dir
                    });
                    this.props.onProgressCompleteAction();
                }
            });
        } catch (err) {
            this.setState({
                loading: false,
                data: {
                    ...this.state.data,
                    ...data
                }
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: err.message,
                    severity: 'error'
                }
            });
        }
    };

    handlePlotlyDropdownAction = async ({ actionType }) => {
        try {
            await triggerWidgetActionHandler({
                screen_id: this.props.screen_id,
                app_id: this.props.app_id,
                payload: {
                    widget_value_id: this.state.widget_value_id,
                    action_type: actionType,
                    filters: JSON.parse(
                        sessionStorage.getItem(
                            'app_screen_filter_info_' +
                                this.props.app_id +
                                '_' +
                                this.props.screen_id
                        )
                    )
                },
                callback: (responseData) => {
                    responseData.dropdownConfig.selected_option_value = actionType;
                    this.setState({
                        loading: false,
                        error: false,
                        error_message: false,
                        data: {
                            ...this.state.data,
                            ...responseData
                        }
                    });
                    this.handleStateUpdateRequest({
                        notification: {
                            message: responseData.message,
                            severity: responseData.error ? 'error' : 'success'
                        },
                        ...responseData?.extra_dir
                    });
                }
            });
        } catch (err) {
            this.setState({
                data: this.state.data
            });
            this.handleStateUpdateRequest({
                notification: {
                    message: err.message,
                    severity: 'error'
                }
            });
        }
    };

    handleNotificationTrigger = (params) => {
        if (params.notification) {
            this.setState({
                notification: params.notification,
                notificationOpen: true
            });
        }
    };

    isTable = (params) => {
        return (
            params &&
            (params.multiple_tables ||
                (params.table_data && params.table_headers) ||
                params.toggleLeft?.multiple_tables ||
                (params.toggleLeft?.table_data && params.toggleLeft?.table_headers))
        );
    };

    isPowerBI = (params) => {
        return params && params.powerbi_config;
    };
    isTableau=(params)=>{
        return params && params.tableau_config;
    }
    

    isTooltip = (params) => {
        return params.isTooltip;
    };
    isExpandableTable = (params) => {
        return params && (params.isExpandable || params.toggleLeft?.isExpandable);
    };

    isCodxTable = (params) => {
        return params?.isCodxTable;
    };

    isPlot = (params) => {
        return (
            params &&
            ((params.data && params.layout) ||
                (params.toggleLeft?.data && params.toggleLeft?.layout))
        );
    };

    isInsights = (params) => {
        return params && (params.toggleLeft?.insight_data || params.insight_data);
    };

    isTestLearn = (params) => {
        return params && params.test_learn_data;
    };

    isFlowTable = (params) => {
        return params && params.flow_table;
    };

    isTableSimulator = (params) => {
        return params && params.is_table_simulator;
    };

    isHTML = (params) => {
        return params && typeof params === 'string' && params.indexOf('DOCTYPE html') > -1;
    };

    isGanttTable = (params) => {
        return params && params.is_gantt_table;
    };

    isKPI = (params) => {
        return params?.is_kpi;
    };

    isGridTable = (params) => {
        return params?.is_grid_table || params?.toggleLeft?.is_grid_table;
    };

    isAlternateSimulatorTableType = (params) => {
        return params?.simulator_type || params?.is_alternate_simulator_type_a;
    };

    isAlternateSimulatorTypeC = (params) => {
        return params?.is_alternate_simulator_type_c;
    };
    isAlternateSimulatorTypeD = (params) => {
        return params?.is_alternate_simulator_type_d;
    };
    isAlternateSimulatorTypeE = (params) => {
        return params?.is_alternate_simulator_type_e;
    };
    isRevampedSimulator = (params) => {
        return params?.isRevampedSim;
    };
    isCompareSimulator = (params) => {
        return params?.isCompareTable;
    };
    isAlternateSimulatorTypeF = (params) => {
        return params?.is_alternate_simulator_type_f;
    };

    isPreLoader = (params) => {
        return !!params?.preLoader;
    };

    isCalendar = (params) => {
        return params.isCalendar;
    };

    isDynamicForm = (params) => {
        return params.form_config;
    };

    isCustomComponent = (params) => {
        return params?.componentType?.startsWith('custom:');
    };

    isCustomLegends = (params) => {
        return Object.prototype.hasOwnProperty.call(params, 'legends');
    };
    isWhiteSpaceDetector = (params) => {
        return params?.is_white_space_detector;
    };

    isAccordionTableSimulator = (params) => {
        return params.isAccordionTableSimulator;
    };

    isAccordionGridTable = (params) => {
        return params.isAccordionGridTable;
    };

    isDocumentViewer = (params) => {
        return params.is_document_viewer;
    };

    renderVisualContent = () => {
        if (
            this.state.extraLoader === true &&
            this.state.extraLoaderToSpecificUser === this.props.logged_in_user_info
        ) {
            return (
                <CodxExtraLoader
                    params={{
                        size: 60,
                        center: true,
                        loaderText: this.state.extraLoaderMessage
                    }}
                />
            );
        } else {
            const { details, classes, graph_height, graph_width } = this.props;
            const handleTagSearch = (val) => {
                this.setState({ ...this.state, search: val });
            };

            if (this.isRevampedSimulator(this.state.data)) {
                return (
                    <>
                        <RevampedSimulator
                            onChange={this.handleSimulatorChange}
                            classes={classes}
                            simulatorInfo={this.state.data.simulator_options}
                            changefunc={this.changefunc}
                            resetfunc={this.resetfunc}
                            submitfunc={this.submitfunc}
                            uploadfunc={this.uploadfunc}
                            downloadfunc={this.downloadfunc}
                            actionfunc={this.handleActionInvoke}
                            setSimulatorTrigger={this.props.setSimulatorTrigger}
                            onSaveScenario={this.onSaveScenario}
                            onSaveasScenario={this.onSaveasScenario}
                            savedScenarios={this.state.savedScenarios}
                            getScenarios={this.getScenarios}
                            linkedScreen={this.state.data?.linked_tab || null}
                            isEditing={this.props.isEditing}
                            scenerioname={this.props.scenerioname}
                            selectedScenario={this.props.selectedScenario}
                            setIsEditingParent={this.props.setIsEditingParent}
                            shouldOpenLibrary={this.props.shouldOpenLibrary}
                        />
                        <FormDialogSaveScenario
                                                    isEditing={this.props.isEditing}
                                             selectedScenario={this.props.selectedScenario}
                            dialogOpen={this.state.save_scenario_dialog_open}
                            handleDialogClose={this.onCloseSaveScenarioDialog}
                            handleSaveScenario={this.handleSaveScenario}
                        />

                        <FormDialogSaveAsScenario
                                                    isEditing={this.props.isEditing}
                                                    selectedScenario={this.props.selectedScenario}
                            scenerioname={this.props.scenerioname}
                            dialogOpen={this.state.save_as_scenario_dialog_open}
                            handleDialogClose={this.onCloseSaveAsScenarioDialog}
                            handleSaveScenario={this.handleSaveScenario}
                        />
                    </>
                );
            }
            if (this.isCompareSimulator(this.state.data)) {
                return (
                    <CompareScenarioTable
                        data={this.state.data}
                        savedScenarios={this.state.savedScenarios}
                        getScenarios={this.getScenarios}
                        locationProps={this.props}
                        handleCompareDataFilterTrigger={this.handleCompareDataFilterTrigger}
                    />
                );
            }

            if (this.isCustomComponent(this.state.data)) {
                return (
                    <AppWidgetCustomComponent
                        params={this.state.data}
                        onEventTrigger={this.handleWidgetEvent}
                        app_details={this.props}
                        handleImageCompAction={this.handleImageCompAction}
                    />
                );
            }
            if (this.isTableau(this.state.data)) {
                 // Assuming the URL is stored here
              
                return <TableauEmbed params={this.state.data.tableau_config} 
                selected_filters={this.props.selected_filters}/>;
              }
              
           else if (this.isPowerBI(this.state.data)) {
                return <AppWidgetPowerBI params={this.state.data.powerbi_config} screen_filters_values={this.props.screen_filters_values} selected_filters={this.props.selected_filters}/>;
            } else if (this.isAccordionGridTable(this.state.data)) {
                return (
                    <AccordionGridTable
                        params={this.state.data}
                        onFetchTableData={this.handleAccordionTableSimulatorFetchTableData}
                        onAction={this.handleAccordionTableSimulatorAction}
                        onTriggerNotification={this.handleNotificationTrigger}
                    />
                );
            } else if (this.isAccordionTableSimulator(this.state.data)) {
                return (
                    <AccordionTableSimultor
                        params={this.state.data}
                        screenId={this.props.screen_id}
                        appId={this.props.app_id}
                        onFetchTableData={this.handleAccordionTableSimulatorFetchTableData}
                        onAction={this.handleAccordionTableSimulatorAction}
                        onTriggerNotification={this.handleNotificationTrigger}
                        onValidateValueChangeInGridTable={this.handleValidateValueChangeInGridTable}
                    />
                );
            } else if (this.isDynamicForm(this.state.data)) {
                return (
                    <AppWidgetDynamicForm
                        params={this.state.data}
                        onAction={this.handleDynamicFormAction}
                        onValidateValueChangeInGridTable={this.handleValidateValueChangeInGridTable}
                        cellInsightsGetter={this.handleCellInsightsGetter}
                        onFetchFormData={this.handleFetchFormData}
                        onModalFormAction={this.handleModalFormAction}
                        onDrilledData={this.handleDrillDown}
                        color_nooverride={details?.config?.color_nooverride}
                        dynamicPayloadPreset={this.handleDynamicPayloadPreset()}
                        onFetchDetailData={this.handleFetchDetailData}
                        handleWidgetEvent={this.handleWidgetEvent}
                        app_id={this.props.app_id}
                        notificationOpen={this.handleNotificationTrigger}
                    />
                );
            } else if (this.isPreLoader(this.state.data)) {
                return (
                    <AppWidgetPreLoader
                        params={this.state.data}
                        onAction={this.handlePreLoaderAction}
                    />
                );
            } else if (this.isCalendar(this.state.data)) {
                return <Calendar parent_obj={this} params={this.state.data} />;
            } else if (this.isGridTable(this.state.data)) {
                return (
                    <div className={classes.gridTableBody}>
                        <GridTable
                            progressInfo={this.state.progress_info}
                            params={
                                this.props.toggleCheck
                                    ? this.state.data.toggleRight?.tableProps ||
                                      this.state.data.tableProps
                                    : this.state.data.toggleLeft?.tableProps ||
                                      this.state.data.tableProps
                            }
                            onOuterAction={this.handleTableWidgetAction}
                            validateValueChange={this.handleValidateValueChangeInGridTable}
                            cellInsightsGetter={this.handleCellInsightsGetter}
                            config={details.config}
                            onProgress={this.handleWidgetEvent}
                            app_details={this.props}
                            freezing={this.state.data?.freezing}
                        />
                    </div>
                );
            } else if (this.isKPI(this.state.data)) {
                return <AppWidgetKpi params={this.state.data} />;
            } else if (this.isPlot(this.state.data)) {
                return (
                    <AppWidgetPlot
                        params={
                            this.props.toggleCheck
                                ? this.state.data.toggleRight || this.state.data
                                : this.state.data.toggleLeft || this.state.data
                        }
                        graph_height={graph_height}
                        graph_width={graph_width}
                        size_nooverride={details.config.size_nooverride}
                        color_nooverride={details.config.color_nooverride}
                        trace_config={details.config.traces}
                        onDrilledData={this.handleDrillDown}
                        onFetchPopoverData={this.handleFetchPopoverData}
                        onFetchDetailData={this.handleFetchDetailData}
                        onPlotClick={this.handleWidgetEvent}
                        title={this.props.title}
                        onDropdownAction={this.handlePlotlyDropdownAction}
                    />
                );
            } else if (this.isTable(this.state.data)) {
                return (
                    <div className={classes.gridTableBody}>
                        <AppWidgetTable
                            params={
                                this.props.toggleCheck
                                    ? this.state.data.toggleRight || this.state.data
                                    : this.state.data.toggleLeft || this.state.data
                            }
                            search={this.state.search}
                            onOuterAction={this.handleTableWidgetAction}
                            handleTagSearch={handleTagSearch}
                            freezing={this.state.data?.freezing}
                        />
                    </div>
                );
            } else if (this.isInsights(this.state.data)) {
                return (
                    <AppWidgetInsights
                        params={
                            this.props.toggleCheck
                                ? this.state.data.toggleRight || this.state.data
                                : this.state.data.toggleLeft || this.state.data
                        }
                        simulatorTrigger={this.props.simulatorTrigger}
                        handleWidgetFilterTrigger={this.handleWidgetFilterTrigger}
                    />
                );
            } else if (this.isTestLearn(this.state.data)) {
                return <AppWidgetTestLearn params={this.state.data} parent_obj={this} />;
            } else if (this.isFlowTable(this.state.data)) {
                return <AppWidgetFlowTable params={this.state.data} parent_obj={this} />;
            } else if (this.isExpandableTable(this.state.data)) {
                return (
                    <AppWidgetExpandableTable
                        params={
                            this.props.toggleCheck
                                ? this.state.data.toggleRight || this.state.data
                                : this.state.data.toggleLeft || this.state.data
                        }
                        onOuterAction={this.handleTableWidgetAction}
                    />
                );
            } else if (this.isTableSimulator(this.state.data)) {
                return <AppWidgetTableSimulator params={this.state.data} parent_obj={this} />;
            } else if (this.isGanttTable(this.state.data)) {
                return <AppWidgetGanttTable params={this.state.data} />;
            } else if (this.isAlternateSimulatorTableType(this.state.data)) {
                return (
                    <AlternateSimulator
                        params={this.state.data}
                        parent_obj={this}
                        getScenarios={this.getScenarios}
                        savedScenarios={this.state.savedScenarios}
                        show_simulator={this.state.show_simulator}
                        onCloseSimulator={this.onCloseSimulator}
                        onLoadScenario={this.onLoadScenario}
                    />
                );
            } else if (this.isAlternateSimulatorTypeC(this.state.data)) {
                return (
                    <AlternateSimulatorTypeC
                        params={this.state.data}
                        parent_obj={this}
                        getScenarios={this.getScenarios}
                        savedScenarios={this.state.savedScenarios}
                        onAction={this.handleAccordionTableSimulatorAction}
                        show_simulator={this.state.show_simulator}
                        onCloseSimulator={this.onCloseSimulator}
                        onTriggerNotification={this.handleNotificationTrigger}
                        theme={this.props.parent_obj?.props?.theme?.props?.mode}
                        onLoadScenario={this.onLoadScenario}
                    />
                );
            } else if (this.isAlternateSimulatorTypeD(this.state.data)) {
                return (
                    <AlternateSimulatorTypeD
                        params={this.state.data}
                        parent_obj={this}
                        getScenarios={this.getScenarios}
                        savedScenarios={this.state.savedScenarios}
                        show_simulator={this.state.show_simulator}
                        onCloseSimulator={this.onCloseSimulator}
                        onAction={this.handleAccordionTableSimulatorAction}
                        onTriggerNotification={this.handleNotificationTrigger}
                        onLoadScenario={this.onLoadScenario}
                    />
                );
            } else if (this.isAlternateSimulatorTypeE(this.state.data)) {
                return (
                    <AlternateSimulatorTypeE
                        params={this.state.data}
                        parent_obj={this}
                        getScenarios={this.getScenarios}
                        savedScenarios={this.state.savedScenarios}
                        show_simulator={this.state.show_simulator}
                        onCloseSimulator={this.onCloseSimulator}
                        onAction={this.handleAccordionTableSimulatorAction}
                        onTriggerNotification={this.handleNotificationTrigger}
                        onLoadScenario={this.onLoadScenario}
                    />
                );
            } else if (this.isAlternateSimulatorTypeF(this.state.data)) {
                return (
                    <AlternateSimulatorTypeF
                        params={this.state.data}
                        parent_obj={this}
                        getScenarios={this.getScenarios}
                        savedScenarios={this.state.savedScenarios}
                        show_simulator={this.state.show_simulator}
                        onCloseSimulator={this.onCloseSimulator}
                        onAction={this.handleAccordionTableSimulatorAction}
                        onTriggerNotification={this.handleNotificationTrigger}
                        onLoadScenario={this.onLoadScenario}
                    />
                );
            } else if (this.isHTML(this.state.data)) {
                return (
                    <object
                        aria-label={'app-widget-html-content'}
                        style={{ height: '100%', width: '100%' }}
                        data={'data:text/html,' + encodeURIComponent(this.state.data)}
                    ></object>
                );
            } else if (this.isWhiteSpaceDetector(this.state.data)) {
                return (
                    <WhiteSpaceDetector
                        params={this.state.data}
                        onAction={this.handleWhiteSpaceDetectorAction}
                    />
                );
            } else if (this.isDocumentViewer(this.state.data)) {
                return (
                    <DocumentRenderer
                        params={this.state.data}
                        documents={this.state.data.documents}
                    />
                );
            } else if (this.isCodxTable(this.state.data)) {
                return <CodxTable params={this.state.data} search={this.state.search} />;
            } else {
                return '';
            }
        }
    };

    handleWidgetEvent = (data) => {
        let widgetData = {
            action_origin: this.props.details.id,
            widget_data: data
        };
        this.props.onWidgetEvent(widgetData);
    };

    handleCellInsightsGetter = ({ row, coldef, actionType }) => {
        return new Promise((res, rej) => {
            try {
                triggerWidgetActionHandler({
                    screen_id: this.props.screen_id,
                    app_id: this.props.app_id,
                    payload: {
                        widget_value_id: this.state.widget_value_id,
                        action_type: actionType,
                        data: { row, coldef },
                        filters: JSON.parse(
                            sessionStorage.getItem(
                                'app_screen_filter_info_' +
                                    this.props.app_id +
                                    '_' +
                                    this.props.screen_id
                            )
                        )
                    },
                    callback: (d) => {
                        res(d);
                    }
                });
            } catch (err) {
                rej(err);
            }
        });
    };

    getCreateStoriesPayload = () => {
        return {
            name: this.props.title,
            description: '',
            app_id: this.props.app_id,
            app_screen_id: this.props.screen_id,
            app_screen_widget_id: this.props.details.id,
            app_screen_widget_value_id: this.state.widget_value_id,
            graph_data: this.state.data,
            filter_data: JSON.parse(
                sessionStorage.getItem(
                    'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                )
            )
        };
    };

    getPayloadMap = () => {
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));
        if (!payloadMap && !payloadMap.size) {
            payloadMap = new Map();
        }
        return payloadMap;
    };

    getPayloadArray = () => {
        var payloadMap = this.getPayloadMap();
        var payloadObject;
        if (payloadMap && payloadMap.size) {
            payloadObject = payloadMap.get(this.props.app_id);
        }
        if (!payloadObject) {
            payloadObject = [];
        }
        return payloadObject;
    };

    onCheckboxValueChange = (checked) => {
        this.setState({ checked: checked });

        var payloadMap = this.getPayloadMap();
        var payloadObject = this.getPayloadArray();

        // omit the components below from consideration
        if (
            this.isGridTable(this.state.data) ||
            this.isExpandableTable(this.state.data) ||
            this.isTable(this.state.data) ||
            this.isTableSimulator(this.state.data) ||
            this.isCustomComponent(this.state.data) ||
            Object.keys(this.state.data).length == 0 ||
            Object.keys(this.state.data).includes('simulator')
        ) {
            return;
        }

        //rest
        if (checked) {
            //checking whether there are already widgets in the main payload and if the current widget is truly valid
            if (payloadObject.length && this.state.widget_value_id) {
                var widgetValueIds = _.pluck(payloadObject, 'app_screen_widget_value_id');
                if (!widgetValueIds.includes(this.state.widget_value_id)) {
                    var requestPayload = this.getCreateStoriesPayload();
                    payloadObject.push(requestPayload);
                }
            } else if (this.state.widget_value_id) {
                requestPayload = this.getCreateStoriesPayload();
                payloadObject.push(requestPayload);
            }
            if (this.props?.screenId && this.state.widget_value_id)
                this.props.addToStoriesCount({
                    screenId: this.props.screen_id,
                    widget_value_id: this.state.widget_value_id
                });
        } else {
            // get index of object with widget_value_id
            var removeIndex = payloadObject
                .map(function (item) {
                    return item.app_screen_widget_value_id;
                })
                .indexOf(this.state.widget_value_id);
            if (removeIndex !== -1) {
                payloadObject.splice(removeIndex, 1);
                if (this.props?.screenId && this.state.widget_value_id)
                    this.props.removeFromStoriesCount({
                        screenId: this.props.screen_id,
                        widget_value_id: this.state.widget_value_id
                    });
            }
        }

        payloadMap.set(this.props.app_id, payloadObject);
        localStorage.setItem(
            'create-stories-payload',
            JSON.stringify(Array.from(payloadMap.entries()))
        );
        if (
            this.props.parent_obj &&
            this.props.parent_obj.props &&
            this.props.parent_obj.props.handleStoriesCount
        ) {
            this.props.parent_obj.props.handleStoriesCount();
        }
    };

    onSearch = (v) => {
        this.setState({ search: v });
        const option_index = this.state.option_index;
        const filter_index = this.state.filter_index;
        var current_data = JSON.parse(JSON.stringify(this.state.data));
        const search = v.toLowerCase();
        if (current_data?.layout?.updatemenus) {
            current_data['layout']['updatemenus'][filter_index].active = option_index;
            current_data['layout']['updatemenus'][filter_index].showActive = true;

            var chart_option_args =
                current_data['layout']['updatemenus'][filter_index]['buttons'][option_index][
                    'args'
                ];

            _.each(chart_option_args, function (filter_item) {
                if (filter_item['visible']) {
                    var visible = filter_item['visible'];
                    current_data['data'] = _.map(
                        current_data['data'],
                        function (data_item, trace_index) {
                            data_item.visible =
                                visible[trace_index] &&
                                (data_item.text + '').toLowerCase().includes(search);
                            return data_item;
                        }
                    );
                } else if (filter_item['yaxis']) {
                    if (!current_data['layout']['yaxis']) {
                        current_data['layout']['yaxis'] = {};
                    }
                    current_data['layout']['yaxis']['title'] = {
                        ...current_data['layout']['yaxis']['title'],
                        text: filter_item['yaxis']['title']
                    };
                    if (filter_item['yaxis']['range'])
                        current_data['layout']['yaxis']['range'] = filter_item['yaxis']['range'];
                    if (filter_item['yaxis']['tickprefix'])
                        current_data['layout']['yaxis']['tickprefix'] =
                            filter_item['yaxis']['tickprefix'];
                    if (filter_item['yaxis']['ticksuffix'])
                        current_data['layout']['yaxis']['ticksuffix'] =
                            filter_item['yaxis']['ticksuffix'];
                } else if (filter_item['xaxis']) {
                    if (!current_data['layout']['xaxis']) {
                        current_data['layout']['xaxis'] = {};
                    }
                    current_data['layout']['xaxis']['title'] = {
                        ...current_data['layout']['xaxis']['title'],
                        text: filter_item['xaxis']['title']
                    };
                    if (filter_item['xaxis']['range'])
                        current_data['layout']['xaxis']['range'] = filter_item['xaxis']['range'];
                    if (filter_item['xaxis']['tickprefix'])
                        current_data['layout']['xaxis']['tickprefix'] =
                            filter_item['xaxis']['tickprefix'];
                    if (filter_item['xaxis']['ticksuffix'])
                        current_data['layout']['xaxis']['ticksuffix'] =
                            filter_item['xaxis']['ticksuffix'];
                } else {
                    return;
                }
            });

            this.setState({
                data: current_data,
                graph_filter_menu_open: false,
                graph_filter_menu_anchorEl: false,
                filter_search_value: ''
            });
        }
    };

    handleSimulatorChange = (newSimulatorValue) => {
        newSimulatorValue['errors'] = {};
        // this.setState({simulator_options: newSimulatorValue});
    };

    changefunc = (simulatorData) => {
        if (this.isTableSimulator(this.state.data)) {
            const tableData = { ...this.state.data, simulator_options: simulatorData };
            let rowsToChange = tableData.aux_table.rows;
            for (let row = 0; row < rowsToChange.length; row++) {
                for (let cell = 0; cell < rowsToChange[row].length; cell++) {
                    if (rowsToChange[row][cell]['update']) {
                        if (!isNaN(rowsToChange[row][cell]['value'])) {
                            rowsToChange[row][cell]['value'] = Math.floor(Math.random() * 100 + 1);
                        }
                        if (rowsToChange[row][cell]['formatted']) {
                            rowsToChange[row][cell]['value'] = Math.floor(
                                Math.random() * 10000 + 1000
                            );
                        }
                    } else continue;
                }
            }
            tableData.aux_table.rows = rowsToChange;
            this.setData((d) => ({ ...d, data: tableData }));
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: {
                    ...this.state.data,
                    ...tableData
                }
            });
        }
    };

    resetfunc = (simulatorData) => {
        if (simulatorData?.sections) {
            this.props.setSimulatorTrigger(true);
            localStorage.setItem('simulator-data', JSON.stringify(simulatorData?.sections));
        }
        window.location.reload();
    };

    submitfunc = () => {
        alert('Submitted!');
    };

    uploadfunc = () => {
        let inpbutton = document.getElementById('contained-button-file');
        inpbutton.click();
    };

    downloadfunc = () => {
        window.location.href = `${
            import.meta.env['REACT_APP_STATIC_DATA_ASSET']
        }/rgm-data/TableSimulator_Scenario.xlsx`;
    };

    handleActionInvoke = async (action_type, simulatorData) => {
        const widgetData = { ...this.state.data, simulator_options: simulatorData };
        let shouldUpdate = true;
        let errorMessages = [];
        if (!(action_type.toLowerCase().indexOf('reset') >= 0)) {
            // Not validating if type contains reset
            widgetData.simulator_options?.sections?.forEach((section) => {
                let controlerInputs = section.inputs.filter((input) => input.control?.length);
                controlerInputs.map((controller) => {
                    let maxSum = Number(controller.value);
                    let currSum = 0;
                    let controlledSliders = [];
                    section.inputs.forEach((input) => {
                        if (controller.control.indexOf(input.id) >= 0) {
                            currSum += Number(input.value);
                            controlledSliders.push(input.label);
                        }
                    });
                    let isErrored = currSum !== maxSum; // Only for GMI
                    if (isErrored) {
                        errorMessages.push(
                            '* In Section: ' +
                                section.header +
                                ' sliders: ' +
                                controlledSliders.join(', ') +
                                ' do not sum up to Controller: ' +
                                controller.label
                        );
                        errorMessages.push('Current Sum: ' + +currSum.toFixed(12));
                    }
                    shouldUpdate = shouldUpdate && !isErrored;
                    return true;
                });
            });
        }

        if (shouldUpdate) {
            this.setState({ loading: true });
            try {
                await triggerWidgetActionHandler({
                    screen_id: this.props.screen_id,
                    app_id: this.props.app_id,
                    payload: {
                        widget_value_id: this.state.widget_value_id,
                        action_type,
                        data: widgetData,
                        filters: JSON.parse(
                            sessionStorage.getItem(
                                'app_screen_filter_info_' +
                                    this.props.app_id +
                                    '_' +
                                    this.props.screen_id
                            )
                        )
                    },
                    callback: (d) => {
                        // removing error if applied
                        localStorage.setItem(
                            'simulator-data',
                            JSON.stringify(simulatorData?.sections)
                        );
                        this.props.setSimulatorTrigger(true);
                        if (d.simulator_options?.errors) {
                            d.simulator_options.errors = {};
                        }
                        if (d.message) {
                            this.setState({
                                notification: { message: d.message },
                                notificationOpen: true
                            });
                        }
                        this.setState({
                            loading: false,
                            error: false,
                            error_message: false,
                            data: {
                                ...this.state.data,
                                ...d
                            }
                        });
                        // this.setData((v) => ({
                        //     ...v,
                        //     simulator_options: d.simulator_options,
                        //     aux_table: d.aux_table,
                        //     main_table: d.main_table,
                        // }));
                    }
                });
            } catch (err) {
                this.setState({
                    loading: false
                });
                this.handleStateUpdateRequest({
                    notification: {
                        message: err.message,
                        severity: 'error'
                    }
                });
            }
        } else {
            let errors = { show: true, messages: errorMessages };
            widgetData.simulator_options.errors = errors;
            // this.setData(d => ({ ...d, data: tableData }));
            this.setState({
                loading: false,
                error: false,
                error_message: false,
                data: {
                    ...this.state.data,
                    simulator_options: widgetData.simulator_options
                }
            });
        }
        // }
    };

    handleAltActionInvoke = (action_type, widgetData, request_id) => {
        this.setState({ loading: true });
        triggerWidgetActionHandler({
            screen_id: this.props.screen_id,
            app_id: this.props.app_id,
            payload: {
                widget_value_id: this.state.widget_value_id,
                request_id: request_id,
                action_type,
                data: widgetData,
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + this.props.app_id + '_' + this.props.screen_id
                    )
                )
            },
            callback: (d) => {
                // removing error if applied
                if (d.simulator_options?.errors) {
                    d.simulator_options.errors = {};
                }
                if (d.message) {
                    this.setState({
                        notification: { message: d.message },
                        notificationOpen: true
                    });
                }
                this.setState({
                    loading: false,
                    error: false,
                    error_message: false,
                    data: {
                        ...this.state.data,
                        ...d
                    }
                });
            }
        });
    };

    renderSelectedFilters = (items) => {
        const { classes } = this.props;
        if (items.length > 3) {
            const visibleItems = items.slice(0, 3);
            const hiddenItems = items.length > 3 ? items.slice(3).map((el) => el.label) : [];

            return (
                <>
                    {visibleItems.map((item, index) => (
                        <Chip key={index} label={item.label} className={classes.chip} />
                    ))}
                    {hiddenItems.length > 0 && (
                        <Tooltip
                            title={hiddenItems.join(', ')}
                            arrow={true}
                            classes={{ tooltip: classes.toolTipStyle, arrow: classes.arrowStyle }}
                        >
                            <Chip
                                className={`${classes.chip} ${classes.numberChip}`}
                                label={`...+${hiddenItems.length}`}
                            />
                        </Tooltip>
                    )}
                </>
            );
        }
        return items.map((item, index) => (
            <Chip key={index} label={item.label} className={classes.chip} />
        ));
    };

    initializeSelectedColumns() {
        const { selectedCheckColumn = false, setSelectedCheckColumn = false } = this.context || {};
        const { table_headers } = this.props?.data?.data?.value || {};
        if (selectedCheckColumn.size === 0 && table_headers?.length > 0) {
            setSelectedCheckColumn(new Set(table_headers));
        }
    }

    toggleSelectAll = () => {
        const { selectedCheckColumn = false, setSelectedCheckColumn = false } = this.context || {};
        const { tableHeaders } = this.state;
        if (selectedCheckColumn.size === tableHeaders?.length) {
            setSelectedCheckColumn(new Set());
        } else {
            const allColumns = new Set(tableHeaders.map((header) => header));
            setSelectedCheckColumn(allColumns);
        }
    };

    render() {
        const { details, classes, widgetWithNoAction } = this.props;
        const { isPaperVisible, fileType } = this.state;
        const { selectedCheckColumn = false, toggleCheckedColumn = false } = this.context || {};
        const isDownloadDisabled = selectedCheckColumn.size === 0;
        const activeStep = this.props?.parent_obj?.props?.activeStep;
        const longerUpdateMenu = this.state.multiple_update_menu > 75;
        const selectedFilters = this.state?.graph_filters
            ?.map((el) => el.options.filter((el) => el.selected))
            .flat();
        let table_data, table_headers;
        if (this.props?.data?.data?.value) {
            const { value } = this.props.data.data;
            if (value?.table_data && value?.table_headers) {
                table_data = value?.table_data;
                table_headers = value?.table_headers;
            } else if (value?.tableProps) {
                table_data = value.tableProps.rowData;
                table_headers = value.tableProps.coldef.map((col) => col.headerName);
            } else if (value?.columns && value?.rows) {
                table_data = this.state?.data?.download_data?.table_data || [];

                let tableHeaders = [];

                table_data?.forEach((row) => {
                    Object.keys(row).forEach((key) => {
                        if (!tableHeaders?.includes(key)) {
                            tableHeaders?.push(key);
                        }
                    });
                });
                if (tableHeaders.length > 0) {
                    table_headers = tableHeaders;
                }
            }
        }
        const areColumnsSelected = selectedCheckColumn.size > 0;
        const { value } = this.props.data.data;
        const filteredData =
            table_data && table_data.length > 0
                ? table_data.map((row) => {
                      let filteredRow = {};
                      if (value?.table_data && value?.table_headers) {
                          filteredRow = table_headers?.reduce((acc, header, colIndex) => {
                              if (!areColumnsSelected || selectedCheckColumn?.has(header)) {
                                  acc[header] = row[colIndex] !== undefined ? row[colIndex] : 'N/A';
                              }
                              return acc;
                          }, {});
                      } else if (value?.tableProps) {
                          filteredRow = table_headers?.reduce((acc, header, colIndex) => {
                              if (!areColumnsSelected || selectedCheckColumn?.has(colIndex)) {
                                  acc[header] = row[header] !== undefined ? row[header] : 'N/A';
                              }
                              return acc;
                          }, {});
                      } else if (value?.columns && value?.rows) {
                          filteredRow = table_headers?.reduce((acc, header, colIndex) => {
                              if (!areColumnsSelected || selectedCheckColumn.has(colIndex)) {
                                  acc[header] = row[header] !== undefined ? row[header] : 'N/A';
                              }
                              return acc;
                          }, {});
                      }
                      return filteredRow;
                  })
                : [
                      table_headers?.reduce((acc, header) => {
                          acc[header] = 'N/A';
                          return acc;
                      }, {})
                  ];

        let getTableData;
        if (value) {
            const { tableProps, columns } = value;
            if (tableProps || columns) {
                getTableData = {
                    table_data: JSON.stringify(filteredData),
                    type: 'string'
                };
            }
        }
        const { notificationOpen, notification } = this.state;
        const showCheckBox = !(
            this.isGridTable(this.state.data) ||
            this.isExpandableTable(this.state.data) ||
            this.isTable(this.state.data) ||
            this.isCustomComponent(this.state.data)
        );
        const title =
            this.state.data?.title?.toUpperCase() || details?.config?.title || this.props.title;
        const noTitleCasing = details?.config?.title_caseNoOverride;
        const chartfilters = this.renderChartFilters();
        // const widgetEnlargeFullscreen = this?.state?.data?.widget_enlarge_fullscreen;
        //Below code transforms position input in form of "top-right" to {top: 0, right: 0} to be added as inline style
        const customAlignment = details?.config?.iconPosition?.includes('-')
            ? details?.config?.iconPosition?.split('-').reduce((acc, current, i) => {
                  if (current === 'center' || current === 'middle') {
                      const key = i === 0 ? 'top' : 'right';
                      return { ...acc, [key]: '50%' };
                  }
                  return { ...acc, [current]: 0 };
              }, {})
            : { [details?.config?.iconPosition]: 0 };

        return (
            <div
                className={`${classes.graphBody} ${
                    this.props.showHighlighter ? classes.highlighterStyles : ''
                }`}
                ref={this.bodyRef}
            >
                <CustomSnackbar
                    open={notificationOpen && notification?.message}
                    autoHideDuration={
                        notification?.autoHideDuration === undefined
                            ? 3000
                            : notification?.autoHideDuration
                    }
                    onClose={() => this.setState({ notificationOpen: false })}
                    severity={notification?.severity || 'success'}
                    message={notification?.message}
                />
                {this.state.data &&
                this.state.data.simulator &&
                (this.state.show_simulator ||
                    (!this.isTable(this.state.data) &&
                        !this.isInsights(this.state.data) &&
                        !this.isPlot(this.state.data) &&
                        !this.isTestLearn(this.state.data) &&
                        !this.isFlowTable(this.state.data) &&
                        !this.isExpandableTable(this.state.data) &&
                        !this.isTableSimulator(this.state.data) &&
                        !this.isGanttTable(this.state.data) &&
                        !this.isCalendar(this.state.data) &&
                        !this.isCodxTable(this.state.data))) ? (
                    <div
                        className={
                            this.state.show_simulator
                                ? classes.graphSimulatorHalfContainer
                                : classes.graphSimulatorContainer
                        }
                    >
                        <div
                            className={clsx(
                                classes.graphSimulatorContainer,
                                !(
                                    this.state.data &&
                                    this.state.data.simulator &&
                                    this.state.show_simulator
                                )
                                    ? classes.simulatorWithoutClose
                                    : ''
                            )}
                        >
                            {this.state.data &&
                                this.state.data.simulator &&
                                this.state.show_simulator && (
                                    <div
                                        onClick={this.onCloseSimulator}
                                        className={classes.closeIcon}
                                    >
                                        <CloseIcon />
                                    </div>
                                )}
                            <div
                                className={clsx(
                                    noTitleCasing ? classes.graphLabelNoCasing : classes.graphLabel,
                                    this.state.data &&
                                        this.state.data.simulator &&
                                        this.state.show_simulator
                                        ? noTitleCasing
                                            ? classes.graphLabelTwoNoCasing
                                            : classes.graphLabelTwo
                                        : ''
                                )}
                            >
                                <Typography color="initial" variant="h5">
                                    {this.state.data.simulator.options.button_name
                                        ? this.state.data.simulator.options.button_name
                                        : noTitleCasing
                                        ? title
                                        : title.toLowerCase()}
                                </Typography>
                                {activeStep >= 0 && !widgetWithNoAction && (
                                    <Tooltip
                                        title="Please complete the action to proceed to the next step"
                                        classes={{ tooltip: classes.visualTooltip }}
                                    >
                                        <SmsFailedIcon
                                            fontSize="large"
                                            className={classes.widgetActionInfoIcon}
                                        />
                                    </Tooltip>
                                )}
                            </div>

                            {this.state.data.simulator.options.readonly_fields ? (
                                <Grid
                                    container
                                    spacing={0}
                                    className={classes.readOnlyHeaderContainer}
                                >
                                    {this.state.data.simulator.options.readonly_fields ? (
                                        <Grid
                                            item
                                            className={classes.simulatorTableHeaders}
                                            xs={
                                                2 +
                                                this.state.data.simulator.options.readonly_fields
                                                    .length
                                            }
                                        >
                                            <Typography
                                                className={classes.simulatorTableHeaderText}
                                                component="span"
                                            >
                                                {this.state.data.simulator.options.readonly_header}
                                            </Typography>
                                        </Grid>
                                    ) : null}
                                    {this.state.data.simulator.options.readonly_fields ? (
                                        <Grid
                                            item
                                            className={classes.simulatorTableHeaders}
                                            xs={
                                                this.state.data.simulator.options
                                                    .multiple_field_value_labels.length -
                                                this.state.data.simulator.options.readonly_fields
                                                    .length
                                            }
                                        >
                                            <Typography
                                                className={classes.simulatorTableHeaderText}
                                                component="span"
                                            >
                                                {this.state.data.simulator.options.fields_header}
                                            </Typography>
                                        </Grid>
                                    ) : null}
                                </Grid>
                            ) : null}
                            {this.state.data.simulator.options.readonly_headers ? (
                                this.state.data.simulator.options.split ? (
                                    this.renderSimulatorGroups()
                                ) : (
                                    <div className={classes.simulatorBodyContainer}>
                                        {this.renderSimulatorSliders(
                                            0,
                                            this.state.data.simulator.options.readonly_headers
                                                .length
                                        )}
                                    </div>
                                )
                            ) : (
                                <div className={classes.simulatorBodyContainerMultiple}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={4}>
                                            {/* <div className={classes.simulatorTableCell}>
                                                <Typography
                                                    className={classes.simulatorTableCellText}
                                                >
                                                    {'Drivers'}
                                                </Typography>
                                            </div> */}
                                            {_.map(
                                                this.state.data.simulator.options.fields,
                                                function (field_item, field_item_index) {
                                                    return (
                                                        <div
                                                            key={'level-labels-' + field_item_index}
                                                            className={
                                                                classes.simulatorTableFirstColCell
                                                            }
                                                        >
                                                            <Typography
                                                                className={
                                                                    classes.simulatorTableFirstColCellText
                                                                }
                                                                display="inline"
                                                            >
                                                                {field_item.name}
                                                            </Typography>
                                                            <Typography
                                                                className={
                                                                    classes.simulatorTableFirstColCellText
                                                                }
                                                                variant="subtitle1"
                                                                display="inline"
                                                            >
                                                                {field_item.subtitle
                                                                    ? ' (' +
                                                                      field_item.subtitle +
                                                                      ')'
                                                                    : ''}
                                                            </Typography>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </Grid>
                                        {_.map(
                                            this.state.data.simulator.options
                                                .multiple_field_value_labels,
                                            function (field_value_label, field_value_label_index) {
                                                return (
                                                    <Grid
                                                        key={
                                                            'level-values-container-' +
                                                            field_value_label_index
                                                        }
                                                        item
                                                        xs={1}
                                                    >
                                                        <div className={classes.simulatorTableCell}>
                                                            <Typography
                                                                className={
                                                                    classes.simulatorTableCellText
                                                                }
                                                                variant="h5"
                                                            >
                                                                {field_value_label}
                                                            </Typography>
                                                        </div>
                                                        {_.map(
                                                            this.state.data.simulator.options
                                                                .fields,
                                                            function (
                                                                field_item,
                                                                field_item_index
                                                            ) {
                                                                return (
                                                                    <div
                                                                        key={
                                                                            'level-values-' +
                                                                            field_item_index +
                                                                            '-' +
                                                                            field_value_label_index
                                                                        }
                                                                        className={
                                                                            classes.simulatorTableCell
                                                                        }
                                                                    >
                                                                        {this.state.data.simulator.options.readonly_fields.includes(
                                                                            field_value_label
                                                                        ) ? (
                                                                            <Typography
                                                                                className={
                                                                                    classes.simulatorTableCellText
                                                                                }
                                                                                variant="h5"
                                                                            >
                                                                                {
                                                                                    field_item
                                                                                        .values[
                                                                                        field_value_label_index
                                                                                    ]
                                                                                }
                                                                            </Typography>
                                                                        ) : (
                                                                            <Input
                                                                                className={
                                                                                    classes.simulatorTableCellInput
                                                                                }
                                                                                variant="filled"
                                                                                value={
                                                                                    field_item
                                                                                        .values[
                                                                                        field_value_label_index
                                                                                    ]
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                );
                                                            },
                                                            this
                                                        )}
                                                    </Grid>
                                                );
                                            },
                                            this
                                        )}
                                    </Grid>
                                </div>
                            )}

                            <div className={classes.simulatorFormDivider}></div>
                            <div
                                className={clsx(
                                    classes.graphActions,
                                    !(
                                        this.state.data &&
                                        this.state.data.simulator &&
                                        this.state.show_simulator
                                    )
                                        ? classes.simulatorWithoutClose
                                        : ''
                                )}
                            >
                                <Button
                                    className={clsx(
                                        classes.simulatorButtons,
                                        classes.outlinedBtnStyle
                                    )}
                                    onClick={this.onResetSimulator}
                                    aria-label="Reset"
                                    variant="outlined"
                                >
                                    <RefreshIcon className={classes.resetIcon} />
                                    {'Reset'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    className={classes.simulatorButtons}
                                    onClick={this.onSaveScenario}
                                    aria-label="Save Scenario"
                                >
                                    {'Save Scenario'}
                                </Button>
                                <Button
                                    variant="contained"
                                    className={classes.simulatorButtonsContained}
                                    onClick={this.onApplySimulator}
                                    aria-label="Apply"
                                >
                                    {'Apply'}
                                </Button>
                                <FormDialogSaveScenario
                                 isEditing={this.props.isEditing}
                                 selectedScenario={this.props.selectedScenario}
                                    dialogOpen={this.state.save_scenario_dialog_open}
                                    handleDialogClose={this.onCloseSaveScenarioDialog}
                                    handleSaveScenario={this.handleSaveScenario}
                                />
                                <FormDialogSaveAsScenario
                                 isEditing={this.props.isEditing}
                                 selectedScenario={this.props.selectedScenario}
                                    scenerioname={this.props.scenerioname}
                                    dialogOpen={this.state.save_as_scenario_dialog_open}
                                    handleDialogClose={this.onCloseSaveAsScenarioDialog}
                                    handleSaveScenario={this.handleSaveAsScenario}
                                />
                            </div>
                            <br />
                        </div>
                    </div>
                ) : (
                    ''
                )}
                {(!this.state.data && this.state.loading) ||
                (!this.state.loading &&
                    this.state.data &&
                    (this.isHTML(this.state.data) ||
                        this.isPowerBI(this.state.data) ||
                        this.isTableau(this.state.data)||
                        this.isTable(this.state.data) ||
                        this.isInsights(this.state.data) ||
                        this.isPlot(this.state.data) ||
                        this.isTestLearn(this.state.data) ||
                        this.isFlowTable(this.state.data) ||
                        this.isExpandableTable(this.state.data) ||
                        this.isCodxTable(this.state.data) ||
                        this.isTableSimulator(this.state.data) ||
                        this.isGanttTable(this.state.data))) ||
                this.isKPI(this.state.data) ||
                this.isGridTable(this.state.data) ||
                this.isAlternateSimulatorTableType(this.state.data) ||
                this.isAlternateSimulatorTypeC(this.state.data) ||
                this.isAlternateSimulatorTypeD(this.state.data) ||
                this.isAlternateSimulatorTypeE(this.state.data) ||
                this.isAlternateSimulatorTypeF(this.state.data) ||
                this.isPreLoader(this.state.data) ||
                this.isCalendar(this.state.data) ||
                this.isDynamicForm(this.state.data) ||
                this.isAccordionTableSimulator(this.state.data) ||
                this.isAccordionGridTable(this.state.data) ||
                this.isCustomComponent(this.state.data) ||
                this.isWhiteSpaceDetector(this.state.data) ||
                this.isDocumentViewer(this.state.data) ||
                this.isRevampedSimulator(this.state.data) ||
                this.isCompareSimulator(this.state.data) ? (
                    <div
                        className={
                            this.state.show_simulator &&
                            !this.isAlternateSimulatorTableType(this.state.data) &&
                            !this.isAlternateSimulatorTypeC(this.state.data)
                                ? classes.graphHalfWrapper
                                : classes.graphWrapper
                        }
                    >
                        {Boolean(details?.config?.icon) &&
                            Boolean(details?.config?.iconPosition) &&
                            Boolean(details?.config?.iconPosition !== 'top-left') && (
                                <img
                                    src={details?.config?.icon || ''}
                                    className={classes.iconStyles}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 999,
                                        ...customAlignment
                                    }}
                                    alt="icon"
                                />
                            )}
                        {!this.isCustomComponent(this.state.data) && (
                            <Box
                                display="flex"
                                style={this.state?.data?.graphBoxStyles}
                                justifyContent="space-between"
                                className={
                                    this.props?.app_info?.name === 'Diagnoseme' ||
                                    this.props?.app_info?.name === 'diagnoseme-clone'
                                        ? classes.diagnosemeApp
                                        : this.isCustomComponent(this.state.data)
                                        ? classes.noPaddingMargin
                                        : classes.box
                                }
                            >
                                <div
                                    className={
                                        noTitleCasing
                                            ? classes.graphLabelNoCasing
                                            : classes.graphLabel
                                    }
                                    style={{
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '8px' // Adjust the gap between the checkbox and the title as needed
                                    }}
                                >
                                    <AppConfigWrapper appConfig={AppConfigOptions.data_story}>
                                        {showCheckBox ? (
                                            <Checkbox
                                                checked={this.state.checked}
                                                className={`${classes.storyCheckbox} ${
                                                    this.isPlot(this.state.data)
                                                        ? classes.plotStoryCheckbox
                                                        : ''
                                                }`}
                                                style={{
                                                    visibility: this.state.checked
                                                        ? 'visible'
                                                        : 'hidden'
                                                }}
                                                disableRipple={true}
                                                onChange={(event) => {
                                                    this.onCheckboxValueChange(
                                                        event.target.checked
                                                    );
                                                }}
                                            />
                                        ) : null}
                                    </AppConfigWrapper>
                                    {Boolean(details?.config?.icon) &&
                                        (Boolean(details?.config?.iconPosition === 'top-left') ||
                                            Boolean(
                                                details?.config?.iconPosition === undefined
                                            )) && (
                                            <img
                                                src={details?.config?.icon || ''}
                                                className={classes.iconStyles}
                                                alt="icon"
                                            />
                                        )}
                                    {title || details?.config?.subtitle ? (
                                        <div
                                            style={this.state?.data?.widgetHeadWrapperStyles}
                                            className={`${classes.widgetHeadWrapper} ${
                                                this.isPlot(this.state.data)
                                                    ? classes.plotHeadWrapper
                                                    : ''
                                            }
                                        ${
                                            window.devicePixelRatio === 1.5 &&
                                            classes.customWidgetHead
                                        }
                                        ${
                                            window.devicePixelRatio === 1.25 &&
                                            classes.customWidgetHeadOne
                                        }`}
                                        >
                                            {this.state.data?.insight_label ? (
                                                <Typography
                                                    className={
                                                        noTitleCasing
                                                            ? classes.graphLabelNoCasing
                                                            : classes.graphLabel
                                                    }
                                                    style={this.state?.data?.graphLabelStyles}
                                                    variant={
                                                        this.state?.data?.graphLabelVariant ||
                                                        noTitleCasing
                                                            ? 'h9'
                                                            : 'h8'
                                                    }
                                                >
                                                    {this.state.data?.insight_label}
                                                </Typography>
                                            ) : null}
                                            {!this.state.data?.insight_label && title ? (
                                                <Typography
                                                    className={
                                                        noTitleCasing
                                                            ? classes.graphLabelNoCasing
                                                            : classes.graphLabel
                                                    }
                                                    style={this.state?.data?.graphLabelStyles}
                                                    variant={
                                                        this.state?.data?.graphLabelVariant ||
                                                        noTitleCasing
                                                            ? 'h9'
                                                            : 'h8'
                                                    }
                                                >
                                                    {title !== 'FALSE'
                                                        ? noTitleCasing
                                                            ? title
                                                            : title.toLowerCase()
                                                        : ''}
                                                </Typography>
                                            ) : null}
                                            {details?.config?.subtitle ? (
                                                <Typography color="initial" variant="h6">
                                                    {details['config']['subtitle']}
                                                </Typography>
                                            ) : null}
                                        </div>
                                    ) : null}
                                    {activeStep >= 0 && !widgetWithNoAction && (
                                        <Tooltip
                                            title="Please complete the action to proceed to the next step"
                                            classes={{ tooltip: classes.visualTooltip }}
                                        >
                                            <SmsFailedIcon
                                                fontSize="large"
                                                className={classes.widgetActionInfoIcon}
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                                <div className={classes.graphActionsBar}>
                                    {
                                        this.props.alert_enable &&
                                        this.state.alert_data?.alert_config?.categories ? (
                                            <AlertDialog
                                                app_screen_widget_id={this.props.details.id}
                                                app_id={this.props.app_id}
                                                app_screen_id={this.props.screen_id}
                                                category={
                                                    this.state.alert_data.alert_config.categories
                                                }
                                                alert_widget_type={this.state.alert_widget_type}
                                                source={this.props.source}
                                                widget_value={this.state.alert_data}
                                                widget_name={title}
                                                alert_admin_user={this.props.alert_admin_user}
                                                logged_in_user_info={this.props.logged_in_user_info}
                                            />
                                        ) : (
                                            ''
                                        )
                                        //this.generateAlertData(this.state.data)
                                    }

                                    {this.state.graph_filters &&
                                    this.state.graph_filters.length > 0 ? (
                                        <React.Fragment>
                                            {chartfilters[0][0].props.id === 'toggle' ? (
                                                <React.Fragment>
                                                    {chartfilters[0][0].props.children.props
                                                        .elementProps.position === 'tl' ? (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex' }}>
                                                                {chartfilters[0].filter(
                                                                    (ele) =>
                                                                        ele.props.id === 'toggle'
                                                                )}
                                                            </div>
                                                            <div className={classes.actionsBarItem}>
                                                                {chartfilters[0].filter(
                                                                    (ele) =>
                                                                        ele.props.id !== 'toggle'
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <React.Fragment>
                                                            {chartfilters[0][0].props.children.props
                                                                .elementProps.position === 'bm' ? (
                                                                <div>
                                                                    {/* <div style={{ display: "flex",backgroundColor:"red",position}}>{chartfilters[0].filter(ele => ele.props.id === "toggle")}</div> */}
                                                                    <div
                                                                        className={
                                                                            classes.actionsBarItem
                                                                        }
                                                                    >
                                                                        {chartfilters[0].filter(
                                                                            (ele) =>
                                                                                ele.props.id !==
                                                                                'toggle'
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </React.Fragment>
                                                    )}
                                                </React.Fragment>
                                            ) : null}
                                        </React.Fragment>
                                    ) : (
                                        ''
                                    )}
                                    <AppFilterUiac
                                        filterCode={
                                            this.props.data.data.filter_value
                                                ? this.props.data.data.filter_value
                                                : ''
                                        }
                                        app_id={this.props.app_id}
                                        screen_id={this.props.screen_id}
                                        widget_id={this.props.details.id}
                                        handleWidgetLevelFilterTrigger={
                                            this.handleWidgetLevelFilterTrigger
                                        }
                                    />

                                    {this.state?.data?.isTooltip ? (
                                        <Tooltip
                                            title={this.state?.data?.tooltip_text}
                                            placement={this.state?.data?.placement}
                                            classes={{ tooltip: classes.visualTooltip }}
                                        >
                                            <IconButton className={classes.InfoIcon}>
                                                <InfoOutlinedIcon fontSize="large" />
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}

                                    {(this.state.data &&
                                        this.state.data.simulator &&
                                        !this.state.show_simulator) ||
                                    (this.isAlternateSimulatorTableType(this.state.data) &&
                                        !this.state.show_simulator) ||
                                    (this.isAlternateSimulatorTypeC(this.state.data) &&
                                        !this.state.show_simulator) ||
                                    (this.isAlternateSimulatorTypeD(this.state.data) &&
                                        !this.state.show_simulator) ||
                                    (this.isAlternateSimulatorTypeE(this.state.data) &&
                                        !this.state.show_simulator) ? (
                                        <div className={classes.actionsBarItem}>
                                            <Button
                                                variant="contained"
                                                className={classes.simulateButton}
                                                onClick={this.onClickSimulator}
                                                aria-label={
                                                    this.state.data.simulator &&
                                                    this.state.data.simulator.options.button_name
                                                        ? this.state.data.simulator.options
                                                              .button_name
                                                        : 'Simulate'
                                                }
                                            >
                                                {this.state.data.simulator &&
                                                this.state.data.simulator.options.button_name
                                                    ? this.state.data.simulator.options.button_name
                                                    : 'Simulate'}
                                            </Button>
                                        </div>
                                    ) : null}

                                    {this.state.data &&
                                    (this.state?.data.download_data ||
                                        this.state?.data.download_image_data ||
                                        this.props?.details?.config?.download_enable) &&
                                    (this.isPlot(this.state.data) ||
                                        this.isExpandableTable(this.state.data) ||
                                        this.isCodxTable(this.state.data) ||
                                        this.isTableSimulator(this.state.data) ||
                                        this.isAlternateSimulatorTableType(this.state.data) ||
                                        this.isAlternateSimulatorTypeC(this.state.data) ||
                                        this.isGridTable(this.state.data) ||
                                        this.isDynamicForm(this.state.data) ||
                                        this.isAccordionTableSimulator(this.state.data) ||
                                        this.isAccordionGridTable(this.state.data) ||
                                        this.isCustomComponent(this.state.data) ||
                                        this.isAlternateSimulatorTypeD(this.state.data) ||
                                        this.isAlternateSimulatorTypeE(this.state.data) ||
                                        this.isAlternateSimulatorTypeF(this.state.data) ||
                                        this.isWhiteSpaceDetector(this.state.data)) ? (
                                        <div className={classes.actionsBarItem}>
                                            <SelectedIndexProvider>
                                                <DownloadWorkBook
                                                    tableData={getTableData}
                                                    filename={
                                                        this.state?.data?.download_data?.fileName
                                                            ? this.state.data.download_data.fileName
                                                            : this.props.title
                                                    }
                                                    nodeId={`node${this.props.app_id}${this.props.widget_value_id}`}
                                                    downloadImageName={
                                                        this.state?.download_image_data?.fileName ||
                                                        false
                                                    }
                                                    imageData={
                                                        this.state?.data.download_image_data ||
                                                        this.props?.details?.config
                                                            ?.download_enable ||
                                                        false
                                                    }
                                                    hideImageData={
                                                        this.isExpandableTable(this.state.data) ||
                                                        this.isCodxTable(this.state.data) ||
                                                        this.isGridTable(this.state.data)
                                                    }
                                                />
                                            </SelectedIndexProvider>
                                        </div>
                                    ) : (this.state.data &&
                                          this.isTable(this.state.data) &&
                                          !this.state.data.multiple_tables &&
                                          (this.props?.details?.config?.download_enable == undefined
                                              ? !this.state.data?.suppress_download
                                              : this.props?.details?.config?.download_enable)) ||
                                      this.isCodxTable(this.state.data) ? (
                                        <div className={classes.searchContainer}>
                                            {this.state.data.show_searchbar ? (
                                                <div className={classes.halfSearchBar}>
                                                    <SearchBar
                                                        placeholder={'Search'}
                                                        onChangeWithDebounce={this.onSearch}
                                                        suggestions={
                                                            this.state.data?.searchSuggestions
                                                        }
                                                        suggestionParams={
                                                            this.state.data?.suggestionProps
                                                        }
                                                        value={this.state.search}
                                                    />
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                            <div
                                                ref={this.containerRef}
                                                className={classes.downloadFiletable}
                                            >
                                                <Tooltip title={<h1>Download File</h1>}>
                                                    <IconButton
                                                        aria-label="download"
                                                        className={classes.downloadIcon}
                                                        onClick={this.togglePaperVisibility}
                                                    >
                                                        <GetApp fontSize="large" color="inherit" />
                                                    </IconButton>
                                                </Tooltip>
                                                {isPaperVisible && (
                                                    <Paper
                                                        elevation={3}
                                                        className={classes.paperVisible}
                                                    >
                                                        <h3 className={classes.columnSelection}>
                                                            Select Columns:
                                                        </h3>

                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={
                                                                        selectedCheckColumn.size ===
                                                                        table_headers?.length
                                                                    }
                                                                    onChange={this.toggleSelectAll}
                                                                    indeterminate={
                                                                        selectedCheckColumn.size >
                                                                            0 &&
                                                                        selectedCheckColumn.size <
                                                                            table_headers?.length
                                                                    }
                                                                />
                                                            }
                                                            label="Select All"
                                                            classes={{
                                                                label: classes.downloadlabel
                                                            }}
                                                        />

                                                        <div className={classes.columnDiv}>
                                                            {Array.from(
                                                                {
                                                                    length: Math.ceil(
                                                                        table_headers?.length / 4
                                                                    )
                                                                },
                                                                (_, rowIndex) => (
                                                                    <div
                                                                        key={rowIndex}
                                                                        className={
                                                                            classes.rowIndexdiv
                                                                        }
                                                                    >
                                                                        {Array.from(
                                                                            { length: 2 },
                                                                            (_, groupIndex) => {
                                                                                const startIndex =
                                                                                    rowIndex * 4 +
                                                                                    groupIndex * 2;
                                                                                const groupColumns =
                                                                                    table_headers?.slice(
                                                                                        startIndex,
                                                                                        startIndex +
                                                                                            2
                                                                                    );

                                                                                return (
                                                                                    <div
                                                                                        key={
                                                                                            groupIndex
                                                                                        }
                                                                                        className={
                                                                                            classes.formControlLabel
                                                                                        }
                                                                                    >
                                                                                        {groupColumns.map(
                                                                                            (
                                                                                                header
                                                                                            ) => (
                                                                                                <FormControlLabel
                                                                                                    key={
                                                                                                        header
                                                                                                    }
                                                                                                    control={
                                                                                                        <Checkbox
                                                                                                            checked={selectedCheckColumn.has(
                                                                                                                header
                                                                                                            )}
                                                                                                            onChange={() =>
                                                                                                                toggleCheckedColumn(
                                                                                                                    header
                                                                                                                )
                                                                                                            }
                                                                                                        />
                                                                                                    }
                                                                                                    label={
                                                                                                        header
                                                                                                    }
                                                                                                    classes={{
                                                                                                        label: classes.downloadlabel
                                                                                                    }}
                                                                                                />
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>

                                                        <h3 className={classes.columnSelection}>
                                                            Select File Type:
                                                        </h3>
                                                        <div className={classes.radioGroup}>
                                                            <RadioGroup
                                                                value={fileType}
                                                                onChange={this.handleFileTypeChange}
                                                            >
                                                                <FormControlLabel
                                                                    value="xlsx"
                                                                    control={<Radio />}
                                                                    label="Download as Excel"
                                                                    classes={{
                                                                        label: classes.downloadlabel
                                                                    }}
                                                                />
                                                                <FormControlLabel
                                                                    value="csv"
                                                                    control={<Radio />}
                                                                    label="Download as CSV"
                                                                    classes={{
                                                                        label: classes.downloadlabel
                                                                    }}
                                                                />
                                                            </RadioGroup>
                                                        </div>
                                                        <div className={classes.downloadButtonDiv}>
                                                            <Button
                                                                onClick={() =>
                                                                    downloadFile(
                                                                        filteredData,
                                                                        fileType
                                                                    )
                                                                }
                                                                color="primary"
                                                                variant="contained"
                                                                className={
                                                                    classes.downloadButtonSingleTable
                                                                }
                                                                disabled={isDownloadDisabled}
                                                            >
                                                                Download
                                                            </Button>
                                                        </div>
                                                    </Paper>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {this.state.data?.download_url ? (
                                        <div className={classes.actionsBarItem}>
                                            <Button
                                                onClick={() =>
                                                    (window.location.href =
                                                        this.state.data.download_url)
                                                }
                                                variant="outlined"
                                                className={classes.downloadButtonSingleTable}
                                                title="Download file"
                                                aria-label="Download"
                                            >
                                                <GetApp fontSize="large" color="inherit" />
                                            </Button>
                                        </div>
                                    ) : null}

                                    <div className={classes.actionsBarItem}>
                                        <AppWidgetAssumptions
                                            key={
                                                'widget_graph_assumptions_' +
                                                details.id +
                                                '_' +
                                                details.widget_index
                                            }
                                            large={true}
                                            params={this.state.data}
                                        />
                                    </div>
                                    {this.state?.data?.commentEnabled ? 
                                    (
                                        <div className={classes.actionsBarItem}>
                                            <span
                                                title="comments"
                                                className={classes.commentIcon}
                                                onClick={() => {
                                                    this.props?.setWidgetOpenIdState({
                                                        widget_id: this.state?.widget_value_id,
                                                        widget_name: title
                                                    });
                                                    this.props?.updateWidgetComment();
                                                    
                                                }}
                                            >
                                                <CommentIcon />
                                            </span>
                                        </div>
                                    ) : null}

                                    <div className={classes.actionsBarItem}>
                                        {this.props.actionItem}
                                    </div>
                                </div>
                            </Box>
                        )}
                        <div
                            className={`${classes.actionsBarItemOne} ${
                                (this.state?.data.download_image_data ||
                                    this.props?.details?.config?.download_enable ||
                                    this.state?.data?.download_data) &&
                                classes.filterOptionsWithDownload
                            } ${
                                this.isCustomComponent(this.state.data) && classes.noPaddingMargin
                            }`}
                        >
                            {!longerUpdateMenu ? (
                                <div className={classes.shortUpdateMenu} ref={this.updateMenuRef}>
                                    {chartfilters}
                                </div>
                            ) : (
                                <div className={classes.multipleMenuContainer}>
                                    <div
                                        className={`${classes.multipleUpdateMenuTrigger}
                                        ${
                                            this.state.graph_multiple_filter_menu_open ===
                                            'view all'
                                                ? classes.selectedOption
                                                : ''
                                        }
                                        `}
                                        onClick={(event) =>
                                            this.onClickGraphFilter(event, 'view all')
                                        }
                                    >
                                        {selectedFilters.length > 0
                                            ? this.renderSelectedFilters(selectedFilters)
                                            : 'View By'}
                                        {this.state.graph_multiple_filter_menu_open ===
                                        'view all' ? (
                                            <ArrowDropUpIcon fontSize="large" />
                                        ) : (
                                            <ArrowDropDownIcon fontSize="large" />
                                        )}
                                    </div>
                                    <Popover
                                        open={
                                            this.state.graph_multiple_filter_menu_open ===
                                            'view all'
                                        }
                                        keepMounted
                                        anchorEl={this.state.graph_multiple_filter_menu_anchorEl}
                                        onClose={this.closeGraphMultipleFilterMenu}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right'
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right'
                                        }}
                                    >
                                        {chartfilters}
                                    </Popover>
                                </div>
                            )}
                        </div>

                        {this.state.loading ? (
                            <div className={classes.graphLoader}>
                                {/* <CircularProgress className={classes.graphLoaderIcon} classes={{
                                    colorPrimary: classes.graphLoaderColor
                                }} /> */}
                                <Skeleton
                                    variant="rect"
                                    animation="wave"
                                    component="div"
                                    width="100%"
                                    height="100%"
                                    className={classes.skeletonWave}
                                />
                                ;
                                <CodxCircularLoader size={60} center />
                            </div>
                        ) : this.state.data ? (
                            <React.Fragment>
                                <div
                                    className={
                                        this.props?.app_info?.name === 'Diagnoseme' ||
                                        this.props?.app_info?.name === 'diagnoseme-clone'
                                            ? classes.graphContainerDiagnoseme
                                            : classes.graphContainer
                                    }
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        overflowY: 'auto'
                                        // this?.props?.app_info?.name? === 'Diagnoseme' ?  overflowY: 'auto'

                                        // this.state.data?.is_alternate_simulator_type_d ||
                                        // this.state.data?.is_alternate_simulator_type_e
                                        //     ? 'visible'
                                        //     : 'auto'
                                    }}
                                >
                                    <div
                                        className={
                                            this.props?.app_info?.name === 'Diagnoseme'
                                                ? classes.graphContainerDiagnoseme
                                                : classes.graphContainer
                                        }
                                    >
                                        {this.state.data.simulator_options &&
                                            !this.isRevampedSimulator(this.state.data) && (
                                                <AppWidgetSimulator
                                                    onChange={this.handleSimulatorChange}
                                                    classes={classes}
                                                    simulatorInfo={
                                                        this.state.data.simulator_options
                                                    }
                                                    changefunc={this.changefunc}
                                                    resetfunc={this.resetfunc}
                                                    submitfunc={this.submitfunc}
                                                    uploadfunc={this.uploadfunc}
                                                    downloadfunc={this.downloadfunc}
                                                    actionfunc={this.handleActionInvoke}
                                                    setSimulatorTrigger={
                                                        this.props.setSimulatorTrigger
                                                    }
                                                    onSaveScenario={this.onSaveScenario}
                                                />
                                            )}

                                        {this.state.data ? (
                                            <div
                                                className={classes.renderContainer}
                                                id={`node${this.props.app_id}${this.props.widget_value_id}`}
                                            >
                                                {this.renderVisualContent()}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                    {this.state.data &&
                                        this.state.data.layout &&
                                        this.state.data.layout.updatemenus &&
                                        this.state.data.layout.updatemenus[0].position === 'bm' && (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {chartfilters[0][0]}
                                            </div>
                                        )}
                                </div>
                                {this?.state?.data?.widget_enlarge && (
                                    <React.Fragment>
                                        <div
                                            className={classes.graphenlargeicon}
                                            onClick={() =>
                                                this.setState({ showEnlargedWidget: true })
                                            }
                                        >
                                            <ZoomIn />
                                        </div>
                                        <EnlargedView
                                            showEnlargedWidget={this.state.showEnlargedWidget}
                                            title={title}
                                            data={this.state.data}
                                            renderVisualContent={this.renderVisualContent()}
                                            classes={classes}
                                            noTitleCasing={noTitleCasing}
                                            onClose={() =>
                                                this.setState({ showEnlargedWidget: false })
                                            }
                                            widgetEnlargeFullscreen={
                                                this?.state?.data?.widget_enlarge_fullscreen
                                            }
                                        />
                                    </React.Fragment>
                                )}
                                {this.isCustomLegends(this?.state?.data) && (
                                    <CustomLegends
                                        legends={this?.state?.data?.legends?.values}
                                        props={this?.state?.data?.legends}
                                    />
                                )}
                            </React.Fragment>
                        ) : (
                            <div className={classes.graphLoader}>
                                <Error
                                    fontSize="large"
                                    color="secondary"
                                    className={classes.graphLoaderIcon}
                                    classes={{
                                        colorPrimary: classes.graphLoaderColor
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ) : this.state.loading ? (
                    <div className={classes.graphLoader}>
                        <CircularProgress
                            className={classes.graphLoaderIcon}
                            classes={{
                                colorPrimary: classes.graphLoaderColor
                            }}
                        />
                    </div>
                ) : (
                    ''
                )}
                {this.state.error ? (
                    <div
                        className={
                            this.state.show_simulator &&
                            !this.isAlternateSimulatorTableType(this.state.data)
                                ? classes.graphHalfWrapper
                                : classes.graphWrapper
                        }
                    >
                        <Box display="flex" justifyContent="space-between">
                            <div className={classes.graphActionsBar}>
                                <Error
                                    role="img"
                                    color="secondary"
                                    fontSize="large"
                                    titleAccess={
                                        this.state.error_message
                                            ? this.state.error_message
                                            : 'Internal Server Error'
                                    }
                                />
                            </div>
                        </Box>
                        <br />
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

AppWidgetGraph.propTypes = {
    classes: PropTypes.object.isRequired,
    app_id: PropTypes.string.isRequired,
    screen_id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
    title: PropTypes.string.isRequired,
    details: PropTypes.object.isRequired,
    selected_filters: PropTypes.object.isRequired,
    graph_height: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
    return {
        screens: state.createStories.selectedScreens,
        screenId: state.createStories.screenId,
        checkFlag: state.createStories.checkFlag
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onWidgetEvent: (widgetData) => dispatch(setWidgetEventData(widgetData)),
        validWidgetsMaxCountUpdate: (widgetCred) =>
            dispatch(updateMaxScreenWidgetCount(widgetCred)),
        addToStoriesCount: (widgetCred) => dispatch(updateCurrentSelectedWidgetCount(widgetCred)),
        removeFromStoriesCount: (widgetCred) => dispatch(removeWidgetFromUsed(widgetCred)),
        setWidgetOpenIdState: (widgetCred) => dispatch(setWidgetOpenIdState(widgetCred))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    withStyles(
        (theme) => ({
            ...appWidgetGraphStyle(theme)
        }),
        { useTheme: true }
    )(AppWidgetGraph)
);
