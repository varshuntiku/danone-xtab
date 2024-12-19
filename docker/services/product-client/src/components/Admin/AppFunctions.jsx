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
import { getAllAppFunctions, deleteAppFunction } from '../../services/app_functions.js';
import AppFunctionsPopup from './AppFunctionsPopup.jsx';
import { DeleteOutline } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import SearchBar from '../CustomSearchComponent/SearchComponent.jsx';
import ConfirmPopup from '../confirmPopup/ConfirmPopup';
import { UserInfoContext } from 'context/userInfoContent.js';
import { decodeHtmlEntities } from '../../util/decodeHtmlEntities.js';
import * as _ from 'underscore';

export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.titleText,
        fontSize: theme.spacing(1.75),
        height: theme.spacing(7.5),
        border: 'none',
        padding: theme.spacing(0.5, 2)
    },
    body: {
        fontSize: theme.spacing(1.75),
        border: 'none',
        color: theme.palette.text.titleText,
        padding: theme.spacing(0.5, 2)
    }
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.dark
    }
}))(TableRow);

class AppFunctions extends Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            rowsPerPage: 10,
            page: 0,
            appFunctionKeys: [],
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
        this.getAppFunctionList();
    }

    getAppFunctionList = () => {
        getAllAppFunctions({
            appId: this.props.appId,
            callback: this.onResponseGetAppFunctionList
        });
    };

    onResponseGetAppFunctionList = (response_data, status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to load Application Functions', 'error');
        } else {
            const updatedAppFunctions = response_data;
            this.setState({
                appFunctionKeys: updatedAppFunctions
            });
        }
    };

    // getAppVarValue = (varKey) => {
    //     getAppFunction({
    //         appId: this.props.appId,
    //         key: varKey,
    //         callback: this.onResponseGetAppFunction
    //     });
    // };

    // onResponseGetAppFunction = (response_data, status = 'success') => {
    //     if (status === 'error') {
    //         this.setSnackbarStatus('Failed to load Application Functions', 'error');
    //     } else {
    //         const updatedAppFunctions = this.state.appFunctionKeys;
    //         updatedAppFunctions.find((appVar) => {
    //             if (appVar.key === response_data.key) {
    //                 return (appVar['value'] = response_data.value), (appVar['test'] = response_data.test), (appVar['loading'] = false);
    //             }
    //         });

    //         this.setState({
    //             appFunctionKeys: updatedAppFunctions
    //         });
    //     }
    // };

    deleteAppFunction = (key) => {
        deleteAppFunction({
            appId: this.props.appId,
            key: key,
            callback: this.onResponseDeleteAppFunction
        });
    };

    onResponseDeleteAppFunction = (status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to delete Application Function', 'error');
        } else {
            this.setSnackbarStatus('Application Function deleted successfully');
            _.delay(
                () => {
                    this.getAppFunctionList();
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
        return `${from}-${to} of ${count !== -1 ? count : ''} functions`;
    };

    // handleValueShowClick = (index, varKey) => {
    //     const updatedAppVars = this.state.appFunctionKeys;
    //     updatedAppVars.map((appVar) => {
    //         if (appVar.key === varKey) {
    //             appVar.hidden = false;
    //             appVar.loading = true;
    //         }
    //     });
    //     this.setState({
    //         appFunctionKeys: updatedAppVars
    //     });
    //     this.getAppVarValue(varKey);
    // };

    render() {
        const { classes } = this.props;
        const var_keys = this.state.appFunctionKeys.map((o) => o.key);
        let create_variable = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'CREATE_VARIABLE'
        );

        return (
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="app-function-table" size="medium">
                        <TableHead>
                            <StyledTableRow className={classes.tableColHeading}>
                                <StyledTableCell>
                                    <AppFunctionsPopup
                                        createAppFunctionFlag={true}
                                        appId={this.props.appId}
                                        getAppFunctionList={this.getAppFunctionList}
                                        keys={var_keys}
                                        funcValue={`# def func1():\n#     pass`}
                                        funcTest={`# # import the module using the following code: \n# app_func = import_app_func(<Function Name>)\n# app_func.func1()`}
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
                                <StyledTableCell>Function Name</StyledTableCell>
                                <StyledTableCell style={{ width: '60rem' }}>
                                    Description
                                </StyledTableCell>
                                <StyledTableCell align="right" style={{ paddingRight: '4.5rem' }}>
                                    Actions
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowsPerPage > 0
                                ? this.state.appFunctionKeys
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
                                : this.state.appFunctionKeys.filter((appVar) => {
                                      return appVar.key
                                          ?.toLowerCase()
                                          .includes(this.state.searchText?.toLowerCase());
                                  })
                            ).map((functionKey) => (
                                <StyledTableRow key={functionKey.key}>
                                    <StyledTableCell component="th" scope="row">
                                        {decodeHtmlEntities(functionKey.key)}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '60rem' }}>
                                        {decodeHtmlEntities(functionKey.desc)}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <AppFunctionsPopup
                                            createAppFunctionFlag={false}
                                            appId={this.props.appId}
                                            funcKey={functionKey.key}
                                            funcValue={functionKey.value}
                                            funcDesc={functionKey.desc}
                                            funcTest={functionKey.test}
                                            getAppFunctionList={this.getAppFunctionList}
                                            keys={var_keys}
                                            editDisabled={
                                                this.props.editDisabled || !create_variable
                                            }
                                        />
                                        <ConfirmPopup
                                            onConfirm={() =>
                                                this.deleteAppFunction(functionKey.key)
                                            }
                                            title="Delete Application Function"
                                            subTitle="Are you sure you want to delete the function ?"
                                            warningMessage="This function will no longer be available for use in UIaC"
                                            cancelText="Cancel"
                                            confirmText="Delete"
                                        >
                                            {(triggerConfirm) => (
                                                <IconButton
                                                    key={2}
                                                    title="Delete Application Function"
                                                    onClick={triggerConfirm}
                                                    disabled={
                                                        this.props.editDisabled || !create_variable
                                                    }
                                                    className={classes.iconBtn}
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
                            ? this.state.appFunctionKeys.filter((appVar) => {
                                  return appVar.key
                                      ?.toLowerCase()
                                      .includes(this.state.searchText?.toLowerCase());
                              }).length
                            : this.state.appFunctionKeys.length
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

export default withStyles(styles)(AppFunctions);
