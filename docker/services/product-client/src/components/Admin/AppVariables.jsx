import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import {
    getAllAppVariables,
    deleteAppVariable,
    getAppVariable
} from '../../services/app_variables.js';
import AppVariablesPopup from './AppVariablesPopup.jsx';
import { DeleteOutline } from '@material-ui/icons';
import { Button, IconButton } from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { Typography } from '@material-ui/core';
import SearchBar from '../CustomSearchComponent/SearchComponent.jsx';
import ConfirmPopup from '../confirmPopup/ConfirmPopup';
import Skeleton from '@material-ui/lab/Skeleton';
import { UserInfoContext } from '../../context/userInfoContent';
import { decodeHtmlEntities } from '../../util/decodeHtmlEntities.js';
import * as _ from 'underscore';

export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.revamp,
        fontSize: theme.spacing(1.75),
        height: theme.spacing(7.5),
        border: 'none',
        padding: theme.spacing(0.5, 2)
    },
    body: {
        fontSize: theme.spacing(1.75),
        border: 'none',
        color: theme.palette.text.revamp,
        padding: theme.spacing(0.5, 2)
    }
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.dark
    }
}))(TableRow);

class AppVariables extends Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            rowsPerPage: 10,
            page: 0,
            appVariableKeys: [],
            snackbar: {
                open: false
            },
            //deletion_id: '',
            open: false,
            searchText: '',
            loading: false
        };
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });
    };

    componentDidMount() {
        this.getAppVariableList();
    }

    getAppVariableList = () => {
        getAllAppVariables({
            appId: this.props.appId,
            callback: this.onResponseGetAppVariableList
        });
    };

    onResponseGetAppVariableList = (response_data, status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to load Application Variables', 'error');
        } else {
            const updatedAppVariables = response_data.keys.map((key) => {
                return { key: key, value: false, hidden: true, loading: false };
            });
            this.setState({
                appVariableKeys: updatedAppVariables
            });
        }
    };

    getAppVarValue = (varKey) => {
        getAppVariable({
            appId: this.props.appId,
            key: varKey,
            callback: this.onResponseGetAppVariable
        });
    };

    onResponseGetAppVariable = (response_data, status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to load Application Variables', 'error');
        } else {
            const updatedAppVariables = this.state.appVariableKeys;
            updatedAppVariables.find((appVar) => {
                if (appVar.key === response_data.key) {
                    return (appVar['value'] = response_data.value), (appVar['loading'] = false);
                }
            });

            this.setState({
                appVariableKeys: updatedAppVariables
            });
        }
    };

    deleteAppVariable = (key) => {
        deleteAppVariable({
            appId: this.props.appId,
            key: key,
            callback: this.onResponseDeleteAppVariable
        });
    };

    onResponseDeleteAppVariable = (status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to delete Application Variable', 'error');
        } else {
            this.setSnackbarStatus('Application Variable deleted successfully');
            _.delay(
                () => {
                    this.getAppVariableList();
                },
                1000,
                ''
            );
        }
    };

    setSnackbarStatus = (message, severity = 'success') => {
        this.setState((prevState) => ({
            snackbar: {
                ...prevState.snackbar,
                open: true,
                message: message,
                severity: severity
            }
        }));
    };

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    handleSearch = (searchKey) => {
        this.setState({
            searchText: searchKey,
            page: 0
        });
    };

    paginationLabelDisplay = ({ from, to, count }) => {
        return `${from}-${to} of ${count !== -1 ? count : ''} variables`;
    };

    handleValueShowClick = (index, varKey) => {
        const updatedAppVars = this.state.appVariableKeys;
        updatedAppVars.map((appVar) => {
            if (appVar.key === varKey) {
                appVar.hidden = false;
                appVar.loading = true;
            }
        });
        this.setState({
            appVariableKeys: updatedAppVars
        });
        this.getAppVarValue(varKey);
    };

    render() {
        const { classes } = this.props;
        const var_keys = this.state.appVariableKeys.map((o) => o.key);
        let create_variable = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'CREATE_VARIABLE'
        );

        return (
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="app-variable-table" size="medium">
                        <TableHead>
                            <StyledTableRow className={classes.tableColHeading}>
                                <StyledTableCell
                                    className={this.props.editDisabled && classes.disabledButton}
                                >
                                    <AppVariablesPopup
                                        createAppVariableFlag={true}
                                        appId={this.props.appId}
                                        getAppVariableList={this.getAppVariableList}
                                        keys={var_keys}
                                        editDisabled={this.props.editDisabled || !create_variable}
                                    />
                                </StyledTableCell>
                                <StyledTableCell />
                                <StyledTableCell align="left">
                                    <SearchBar
                                        value={this.state.searchText}
                                        onChangeWithDebounce={this.handleSearch}
                                        placeholder="Search"
                                    />
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>Variable Name</StyledTableCell>
                                <StyledTableCell style={{ width: '60rem' }}>Value</StyledTableCell>
                                <StyledTableCell align="right" style={{ paddingRight: '4.5rem' }}>
                                    Actions
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowsPerPage > 0
                                ? this.state.appVariableKeys
                                      .filter((appVar) => {
                                          return appVar.key
                                              ?.toLowerCase()
                                              .includes(this.state.searchText?.toLowerCase());
                                      })
                                      .slice(
                                          this.state.page * this.state.rowsPerPage,
                                          this.state.page * this.state.rowsPerPage +
                                              this.state.rowsPerPage
                                      )
                                : this.state.appVariableKeys.filter((appVar) => {
                                      return appVar.key
                                          ?.toLowerCase()
                                          .includes(this.state.searchText?.toLowerCase());
                                  })
                            ).map((variableKey, index) => (
                                <StyledTableRow key={variableKey.key}>
                                    <StyledTableCell component="th" scope="row">
                                        {variableKey.key}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '60rem' }}>
                                        <div>
                                            {variableKey.hidden ? (
                                                <Button
                                                    variant="text"
                                                    onClick={() =>
                                                        this.handleValueShowClick(
                                                            index,
                                                            variableKey.key
                                                        )
                                                    }
                                                    aria-label="Hidden Value. Click to show value."
                                                >
                                                    Hidden Value. Click to show value.
                                                </Button>
                                            ) : (
                                                <Typography
                                                    variant="h5"
                                                    style={{ wordBreak: 'break-word' }}
                                                >
                                                    {variableKey.loading ? (
                                                        <Skeleton
                                                            variant="text"
                                                            animation="wave"
                                                            className={classes.skeletonWave}
                                                        />
                                                    ) : (
                                                        decodeHtmlEntities(variableKey.value)
                                                    )}
                                                </Typography>
                                            )}
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <AppVariablesPopup
                                            createAppVariableFlag={false}
                                            appId={this.props.appId}
                                            varKey={variableKey.key}
                                            varValue={variableKey.value}
                                            getAppVariableList={this.getAppVariableList}
                                            keys={var_keys}
                                            editDisabled={
                                                this.props.editDisabled || !create_variable
                                            }
                                        />
                                        <ConfirmPopup
                                            onConfirm={() =>
                                                this.deleteAppVariable(variableKey.key)
                                            }
                                            title="Delete Application Variable"
                                            subTitle="Are you sure you want to delete the variable ?"
                                            warningMessage="This variable will no longer be available for use in UIaC"
                                            cancelText="Cancel"
                                            confirmText="Delete"
                                        >
                                            {(triggerConfirm) => (
                                                <IconButton
                                                    key={2}
                                                    title="Delete Application Variable"
                                                    onClick={triggerConfirm}
                                                    disabled={
                                                        this.props.editDisabled || !create_variable
                                                    }
                                                    className={classes.iconBtn}
                                                    // aria-label='Delete'
                                                >
                                                    <DeleteOutline
                                                        fontSize="large"
                                                        style={{ color: 'red' }}
                                                    />
                                                </IconButton>
                                            )}
                                        </ConfirmPopup>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component={'div'}
                    rowsPerPageOptions={[5, 10, 25]}
                    count={
                        this.state.searchText.length > 0
                            ? this.state.appVariableKeys.filter((appVar) => {
                                  return appVar.key
                                      ?.toLowerCase()
                                      .includes(this.state.searchText?.toLowerCase());
                              }).length
                            : this.state.appVariableKeys.length
                    }
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onPageChange={this.handleChangePage}
                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                    className={classes.tablePagination}
                />
                <CustomSnackbar
                    key={4}
                    open={this.state.snackbar.open}
                    message={this.state.snackbar.message}
                    autoHideDuration={2000}
                    onClose={() => {
                        this.setState({
                            snackbar: {
                                open: false
                            }
                        });
                    }}
                    severity={this.state.snackbar.severity}
                />
            </div>
        );
    }
}

const styles = (theme) => ({
    main: {
        padding: '4rem'
    },
    heading: {
        color: theme.palette.primary.contrastText
    },
    paginationWrapper: {
        '& .MuiToolbar-root': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        },
        '& .MuiTablePagination-caption': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        },
        '& .MuiTablePagination-selectIcon': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        }
    },
    cursorPointer: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
    iconBtn: {
        '& svg': {
            color: theme.palette.primary.contrastText
        }
    },
    fontSize1: {
        fontSize: '2rem',
        marginBottom: '1%'
    },
    fontSize2: {
        fontSize: '2rem'
    },
    fontColor: {
        color: theme.palette.text.default
    },
    table: {
        '& .MuiTableCell-root': {
            borderBottom: 'none !important'
        },
        border: 'none',
        '& .MuiIconButton-root.Mui-disabled': {
            opacity: localStorage.getItem('codx-products-theme') === 'dark' ? '0.25' : '0.5'
        }
    },
    tableColHeading: {
        '& .MuiTableCell-body': {
            fontSize: '2rem',
            padding: '1.5rem 1rem 1.5rem 1rem'
        },
        borderBottom: '1px solid rgba(151, 151, 151, 0.4)'
    },
    tableFooter: {
        '& .MuiTablePagination-selectRoot': {
            display: 'none'
        },
        '& .MuiTablePagination-caption': {
            fontSize: '1.5rem',
            color: theme.palette.text.titleText
        },
        '& .MuiTableRow-footer': {
            borderTop: '1px solid rgba(151, 151, 151, 0.4)'
        }
    },
    tablePagination: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        '& .MuiTablePagination-toolbar': {
            '& .MuiTablePagination-caption': {
                fontSize: '1.5rem'
            },
            '& .MuiTablePagination-selectRoot': {
                margin: '0rem 1rem 0rem 0rem',
                '& .MuiSelect-icon': {
                    color: 'inherit',
                    top: 'auto'
                }
            },
            '& .MuiTablePagination-actions': {
                marginLeft: 0
            }
        },
        '&.MuiTableCell-root': {
            borderBottom: 'none'
        }
    },
    skeletonWave: {
        background: '#C4C4C4',
        opacity: '10%',
        '&:after': {
            animation: 'MuiSkeleton-keyframes-wave 0.2s linear 0.5s infinite'
        }
    }
});

export default withStyles(styles)(AppVariables);
