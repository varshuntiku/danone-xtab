import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, IconButton, InputBase } from '@material-ui/core';
import { Search, ArrowForwardIos, Close, AccountCircle } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import dashboardStyle from 'assets/jss/dashboardStyle.jsx';
import Nuclios from './Nuclios/assets/Nuclios';
import ThemeToggle from '../themes/ThemeToggle';

import * as _ from 'underscore';

class ActionBar extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.dashboard_component = React.createRef();
        this.state = {
            reports: props.reports,
            search_value: '',
            search_options: [],
            hideSearchContainer: true
        };
        this.searchOptionsContainerRef = React.createRef();
        this.noRecordsContainerRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        ['mousedown', 'keydown'].forEach((event) =>
            document.addEventListener(event, this.handleClickOutside, false)
        );
    }

    componentWillUnmount() {
        ['mousedown', 'keydown'].forEach((event) =>
            document.removeEventListener(event, this.handleClickOutside, false)
        );
    }

    handleClickOutside(event) {
        if (
            this.searchOptionsContainerRef.current &&
            !this.searchOptionsContainerRef.current.contains(event.target)
        ) {
            this.setState({
                hideSearchContainer: false,
                search_options: []
            });
        }
        if (
            this.noRecordsContainerRef.current &&
            !this.noRecordsContainerRef.current.contains(event.target)
        ) {
            this.setState({
                hideSearchContainer: false,
                search_options: []
            });
        }
    }

    searchText = (full_string, search_string) => {
        if (!full_string) {
            return false;
        } else {
            if (search_string.length < 3) {
                return full_string.toLowerCase().indexOf(search_string.toLowerCase()) === 0;
            } else {
                return (
                    full_string.toLowerCase().indexOf(search_string.toLowerCase()) === 0 ||
                    full_string.toLowerCase().indexOf(' ' + search_string.toLowerCase()) > 0 ||
                    full_string.toLowerCase().indexOf('/' + search_string.toLowerCase()) > 0 ||
                    full_string.toLowerCase().indexOf(',' + search_string.toLowerCase()) > 0 ||
                    full_string.toLowerCase().indexOf(':' + search_string.toLowerCase()) > 0
                );
            }
        }
    };

    navigateToDetails = (data) => {
        this.props.history.push({
            pathname: '/stories/' + data.story_id + '/details',
            state: { detail: data }
        });

        this.closeSearch();
    };

    closeSearch = () => {
        this.setState({
            search_value: '',
            search_options: []
        });
    };

    onChangeSearchValue = (event) => {
        var reports = _.union(this.state.reports.my_stories, this.state.reports.accessed_stories);
        var search_options = [];

        if (event.target.value !== '') {
            search_options = _.filter(
                reports,
                function (report) {
                    return this.searchText(report.story_name, event.target.value);
                },
                this
            );

            this.setState({
                hideSearchContainer: true
            });
        }

        this.setState({
            search_value: event.target.value,
            search_options: search_options
        });
    };

    render() {
        const { classes } = this.props;

        var input_props = {
            'aria-label': 'search',
            value: this.state.search_value,
            onChange: this.onChangeSearchValue
        };

        var local_storage_theme = localStorage.getItem('codx-products-theme');

        if (!local_storage_theme) {
            local_storage_theme = 'dark';
        }

        return [
            <AppBar key="app-bar" position="relative" className={classes.industryAppBar}>
                <Toolbar>
                    <Link to={'/dashboard'}>
                        <Nuclios
                            alt="Nuclios-logo"
                            color={this.props.theme.palette.primary.contrastText}
                            className={classes.codxLogo}
                        />
                    </Link>

                    <div className={classes.grow} />

                    <ThemeToggle />
                    <div key={'search_container'} className={classes.toolbarSearch}>
                        <InputBase
                            placeholder="Search Stories"
                            classes={{
                                root: classes.toolbarInputRoot,
                                input:
                                    local_storage_theme === 'dark'
                                        ? classes.toolbarInput
                                        : classes.toolbarInputlight
                            }}
                            inputProps={input_props}
                        />
                        <Search fontSize="large" className={classes.toolbarSearchIcon} />
                        {this.state.search_value ? (
                            <Close
                                aria-label="close-search"
                                fontSize="large"
                                className={classes.toolbarCloseSearchIcon}
                                onClick={this.closeSearch}
                            />
                        ) : null}
                        {this.state.search_options.length > 0 ? (
                            [
                                <div
                                    key={'toolbarSearchOptionsContainer'}
                                    ref={this.searchOptionsContainerRef}
                                    className={classes.toolbarSearchOptionsContainer}
                                >
                                    {_.map(
                                        this.state.search_options,
                                        function (search_option, search_option_index) {
                                            return (
                                                <div
                                                    aria-label="search-option"
                                                    key={'search_option_' + search_option_index}
                                                    className={
                                                        search_option_index ===
                                                        this.state.search_options.length - 1
                                                            ? classes.toolbarSearchOptionLast
                                                            : classes.toolbarSearchOption
                                                    }
                                                    onClick={() =>
                                                        this.navigateToDetails(search_option)
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            classes.toolbarSearchOptionFunction
                                                        }
                                                    >
                                                        {search_option.story_name}
                                                    </div>
                                                    <br />
                                                    <ArrowForwardIos
                                                        className={classes.toolbarSearchOptionIcon}
                                                    />
                                                </div>
                                            );
                                        },
                                        this
                                    )}
                                </div>
                            ]
                        ) : this.state.search_value &&
                          !this.state.search_options.length &&
                          this.state.hideSearchContainer ? (
                            <div
                                ref={this.noRecordsContainerRef}
                                className={classes.toolbarSearchOptionsContainer}
                            >
                                NO RECORDS FOUND
                            </div>
                        ) : (
                            ''
                        )}
                    </div>

                    <IconButton title="Profile">
                        <AccountCircle fontSize="large" />
                    </IconButton>
                </Toolbar>
            </AppBar>
        ];
    }
}

ActionBar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...dashboardStyle(theme)
    }),
    { withTheme: true }
)(ActionBar);
