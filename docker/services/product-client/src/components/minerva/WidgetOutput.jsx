import React, { useEffect, useState } from 'react';
import { MenuItem, Popover, Typography, alpha, withStyles } from '@material-ui/core';
import CardView from './cardView';
import DataTable from './tableView';
import Widget from 'components/Widget';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

// import AppConfigWrapper, { AppConfigOptions } from 'hoc/appConfigWrapper.js';

import * as _ from 'underscore';

const styles = (theme) => ({
    graphBody: {
        height: '100%',
        backgroundColor: theme.palette.primary.dark,
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        '& :hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },
    storyCheckbox: {
        padding: 0,
        '& svg': {
            width: '3rem',
            height: '3rem'
        }
    },
    actionsBarItem: {
        // float: 'right',
        // position: 'relative',
        // marginRight: theme.spacing(1),
        display: 'flex'
    },
    actionsBarItemLeftContainer: {
        position: 'relative',
        marginLeft: theme.spacing(2),
        float: 'left'
    },
    downloadButton: {
        padding: theme.spacing(0.5),
        minWidth: theme.spacing(5)
    },
    graphActions: {
        position: 'relative',
        float: 'right',
        padding: theme.spacing(0, 2, 0, 0)
    },
    graphFilterMenuItem: {
        fontSize: '1.5rem',
        color: theme.palette.primary.contrastText + ' !important',
        textTransform: 'uppercase',
        '&:hover': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.light
        }
    },
    graphFilterMenuItemSelected: {
        fontSize: '1.5rem',
        color: theme.palette.primary.main + ' !important',
        backgroundColor: theme.palette.primary.contrastText + ' !important'
    },
    filterMenuContainer: {
        maxHeight: '30rem'
    },
    graphOptionValue: {
        float: 'left',
        position: 'relative',
        padding: theme.spacing(0.5, 0),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(4),
        color: theme.palette.primary.contrastText,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.dark,
            borderRadius: theme.spacing(0.5)
        }
    },
    graphOptionValueType: {
        fontWeight: 700,
        textTransform: 'uppercase'
    },
    graphOptionIcon: {
        position: 'absolute',
        right: theme.spacing(0.5),
        top: theme.spacing(0.5),
        // color: theme.palette.text.default,
        fontWeight: 700
    },
    graphOptionLabel: {
        float: 'left',
        position: 'relative',
        padding: theme.spacing(0.5, 0),
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1.5),
        color: theme.palette.text.default,
        fontWeight: 500
    },
    graphHideUpdateMenu: {
        display: 'none'
    },
    widgetTitle: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.6rem',
        textTransform: 'uppercase'
    },
    ploltyContainer: {
        height: '45rem',
        padding: '0rem 4rem'
    },
    textContainerData: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.6rem',
        padding: '1rem',
        textWrap: 'wrap'
    }
});

function WidgetOutput(props) {
    const classes = props.classes;
    const [widgets, setWidgets] = useState([]);
    const [selectedWidgetId, setSelectedWidgetId] = useState(0);
    const [graphMenuOpen, setGraphMenuOpen] = useState(false);
    const [graphMenuAnchorEl, setGraphMenuAnchorEl] = useState(false);

    useEffect(() => {
        setWidgets(props?.data?.widgets);
    }, []);

    const getWidgetComponent = (widgetItem) => {
        let comp = null;
        let widgetValue = widgetItem.value;
        switch (widgetItem.type) {
            case 'card':
                comp = <CardView graphData={widgetValue} />;
                break;
            case 'dataTable':
                comp = widgetValue.data.columns ? (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            padding: '5rem 0'
                        }}
                    >
                        <DataTable
                            tableHead={widgetValue.data.columns}
                            tableData={widgetValue.data.values}
                        />
                    </div>
                ) : (
                    <div className={classes.ploltyContainer}>
                        <AppWidgetPlot
                            params={widgetValue}
                            graph_height={'full'}
                            size_nooverride={false}
                            color_nooverride={false}
                        />
                    </div>
                );
                break;
            case 'chart':
                comp = (
                    <div className={classes.ploltyContainer}>
                        <AppWidgetPlot
                            params={widgetValue}
                            graph_height={'full'}
                            size_nooverride={false}
                            color_nooverride={false}
                        />
                    </div>
                );
                break;
            case 'text':
                comp = (
                    <div className={classes.textContainer}>
                        <CustomTextTypography data={widgetValue} classes={classes} />
                    </div>
                );
                break;
            default:
                comp = (
                    <Widget
                        data={widgetValue}
                        graph_height={'full'}
                        size_nooverride={false}
                        color_nooverride={false}
                    />
                );
        }
        return comp;
    };

    const renderWidgetList = (data) => {
        const widgetNames = data?.map((o) => o.name);
        const activeWidget = data[selectedWidgetId];
        return data.length ? (
            <React.Fragment>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div className={classes.graphLabel}>
                        <Typography color="initial" variant="h5" className={classes.widgetTitle}>
                            {activeWidget.title}
                        </Typography>
                    </div>
                    <div className={classes.actionsBarItem}>
                        <div key={'widget_type'} className={classes.graphOptionContainer}>
                            <Typography className={classes.graphOptionLabel} variant="h5">
                                {'Type'}
                            </Typography>
                            <div
                                aria-label="widget-type"
                                className={classes.graphOptionValue}
                                onClick={(event) => {
                                    setGraphMenuOpen(true);
                                    setGraphMenuAnchorEl(event.currentTarget);
                                }}
                            >
                                <Typography variant="h5" className={classes.graphOptionValueType}>
                                    {widgetNames[selectedWidgetId]}
                                </Typography>
                                {graphMenuOpen ? (
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
                            <Popover
                                key={'widget_type_options'}
                                keepMounted
                                anchorEl={graphMenuAnchorEl}
                                open={graphMenuOpen}
                                onClose={() => {
                                    setGraphMenuOpen(false);
                                    setGraphMenuAnchorEl(false);
                                }}
                            >
                                <div className={classes.filterMenuContainer}>
                                    {_.map(
                                        widgetNames,
                                        function (option, index) {
                                            return (
                                                <MenuItem
                                                    key={'widget_options_' + index}
                                                    value={index}
                                                    classes={{
                                                        root: classes.graphFilterMenuItem,
                                                        selected:
                                                            classes.graphFilterMenuItemSelected
                                                    }}
                                                    onClick={() => {
                                                        setSelectedWidgetId(index);
                                                        setGraphMenuOpen(false);
                                                        setGraphMenuAnchorEl(false);
                                                    }}
                                                >
                                                    {option}
                                                </MenuItem>
                                            );
                                        },
                                        this
                                    )}
                                </div>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1, width: '100%' }}>{getWidgetComponent(activeWidget)}</div>
            </React.Fragment>
        ) : (
            ''
        );
    };

    return (
        <div className={classes.graphBody}>
            {widgets?.map((widgetItem) => {
                return !Array.isArray(widgetItem) ? (
                    <div key={widgetItem.title + '_' + widgetItem.type}>
                        <div className={classes.graphLabel}>
                            <Typography
                                color="initial"
                                variant="h5"
                                className={classes.widgetTitle}
                            >
                                {widgetItem.title}
                            </Typography>
                        </div>
                        <div style={{ flex: 1, width: '100%' }}>
                            {getWidgetComponent(widgetItem)}
                        </div>
                    </div>
                ) : (
                    <div>{renderWidgetList(widgetItem)}</div>
                );
            })}
        </div>
    );
}

const CustomTextTypography = ({ data, classes }) => {
    return (
        // variant="body1"
        <Typography component="pre" className={classes.textContainerData}>
            {data}
        </Typography>
    );
};

export default withStyles(
    (theme) => ({
        ...styles(theme)
    }),
    { withTheme: true }
)(WidgetOutput);
