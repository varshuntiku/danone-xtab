import React, { useCallback, useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    IconButton,
    Typography,
    withStyles,
    makeStyles,
    Link,
    useTheme
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import PackageDetails from './icons/PackageDetails';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

import SearchIcon from '@material-ui/icons/Search';
import { useDebouncedEffect } from '../hooks/useDebounceEffect';

import clsx from 'clsx';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(4),
            roboto: 'Roboto',
            fontWeight: 500
        },
        packageDetailsButton: {
            cursor: 'pointer',
            fontSize: theme.spacing(2),
            color: theme.palette.text.contrastText,
            textTransform: 'unset',
            display: 'flex',
            gap: theme.spacing(1.5),
            alignItems: 'center'
        },
        table: {
            height: 'fit-content'
        },
        tablePaper: {
            height: '100%'
        },
        tableHead: {},
        tableBody: {},
        margin: {
            margin: theme.spacing(1)
        },
        textField: {
            width: '30%',
            color: theme.palette.text.default + ' !important',
            borderBottom: '1px solid ' + theme.palette.text.default
        },
        searchText: {
            color: theme.palette.text.default + ' !important',
            fontSize: '2rem'
        },
        searchIcon: {
            color: theme.palette.text.default + ' !important',
            fontSize: '3rem'
        },
        searchInput: {
            color: theme.palette.text.default + ' !important',
            fontSize: '2rem'
        },
        packageDetailsButtonIcon: {
            display: 'block',
            height: '100%',
            maxHeight: '18px',
            scale: 1.2
        },
        packageDetailsDialog: {
            height: '100%',
            background: 'transprent',
            margin: 'auto',
            '& .MuiDialog-paper': {
                maxWidth: theme.layoutSpacing(854),
                background: theme.palette.background.paper
            }
        },
        fixed: {
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: theme.palette.background.pureWhite,
            padding: theme.layoutSpacing(20)
        },
        packageDetailsDialogHeader: {
            background: theme.palette.background.pureWhite,
            color: theme.palette.text.titleText,
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h1.fontFamily
        },
        packageDetailsDialogBody: {
            height: theme.spacing(100),
            display: 'flex',
            paddingLeft: theme.layoutSpacing(44),
            paddingRight: theme.layoutSpacing(44),
            justifyContent: 'center',
            alignItems: 'center'
        },
        packageDetailsWrapper: {
            flex: 1,
            height: '100%',
            overflowY: 'scroll',
            padding: theme.spacing(3)
        },
        headingWrapper: {
            height: '10%',
            display: 'flex',
            gap: theme.spacing(2),
            alignItems: 'center',
            '& .MuiFormLabel-root.Mui-disabled': {
                color: theme.palette.text.default
            },
            '& .MuiInput-underline': {
                borderBottomColor: theme.palette.text.default
            },
            '& .MuiInput-underline:hover': {
                borderBottomColor: theme.palette.text.default
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: theme.palette.text.default
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottomColor: theme.palette.text.default
            }
        },
        packageDetailsList: {
            height: '90%',
            padding: theme.spacing(4) + ' 0'
        },
        closeButton: {
            position: 'absolute',
            top: '4px',
            right: 0
        },
        sepratorLine: {
            width: 'calc(100% - 32px)',
            marginTop: 0,
            marginBottom: 0
        }
    }),
    {
        withTheme: true
    }
);

const StyledTableCell = withStyles((theme) => ({
    head: {
        color: theme.palette.text.default,
        border: 'none',
        background: theme.palette.background.tableHeader,
        fontSize: 13,
        height: '2rem',
        minWidth: '20rem'
    },
    body: {
        fontSize: 12,
        color: theme.palette.text.default,
        border: 'none',
        fontWeight: 400,
        height: '2rem',
        minWidth: '20rem'
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? '#0C2744'
                : theme.palette.background.paper,
        color: theme.palette.text.default
    }
}))(TableRow);

const AppScreenPackageDetails = ({ ...props }) => {
    const classes = useStyles();

    const [showDialog, setShowDialog] = useState(false);
    const [packages, setPackages] = useState([]);
    const [search, setSearch] = React.useState('');
    const theme = useTheme();

    useEffect(() => {
        setPackages(props.packages);
    }, [props.packages]);

    const closeDialog = useCallback(() => {
        setShowDialog(false);
        setSearch('');
    }, []);

    const openDialog = useCallback(() => {
        setShowDialog(true);
    }, []);

    const handleSearch = (searchText) => {
        let newPackages = props.packages.filter((o) =>
            Object.keys(o).some((k) =>
                o[k].toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );
        if (newPackages.length > 0) {
            setPackages(newPackages);
        } else {
            setPackages(props.packages);
        }
    };

    useDebouncedEffect(
        () => {
            handleSearch(search);
        },
        [search],
        1000
    );

    const handleChange = (event) => {
        let searchText = event.target.value;
        setSearch(searchText);
    };

    const handleSearchClick = () => {
        handleSearch(search);
    };

    const handleMouseDownSearch = (event) => {
        event.preventDefault();
        handleSearch(search);
    };

    return (
        <div className={classes.root}>
            <Link variant="button" className={classes.packageDetailsButton} onClick={openDialog}>
                <PackageDetails
                    color={theme.palette.text.contrastText}
                    className={classes.packageDetailsButtonIcon}
                />
                Packages Available
            </Link>
            <Dialog
                open={showDialog}
                fullWidth
                maxWidth="xl"
                className={classes.packageDetailsDialog}
                onClose={closeDialog}
            >
                <DialogTitle disableTypography className={classes.fixed}>
                    <Typography variant="h4" className={classes.packageDetailsDialogHeader}>
                        Packages Used
                    </Typography>
                    <IconButton title="Close" className={classes.closeButton} onClick={closeDialog}>
                        <Close fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorLine} />
                <div className={classes.packageDetailsDialogBody}>
                    <div className={classes.packageDetailsWrapper}>
                        <div className={classes.headingWrapper}>
                            <FormControl className={clsx(classes.margin, classes.textField)}>
                                <InputLabel
                                    className={classes.searchText}
                                    htmlFor="standard-adornment-search"
                                >
                                    Search
                                </InputLabel>
                                <Input
                                    id="standard-adornment-search"
                                    type="text"
                                    className={classes.searchInput}
                                    value={search}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle search visibility"
                                                onClick={handleSearchClick}
                                                onMouseDown={handleMouseDownSearch}
                                            >
                                                <SearchIcon
                                                    className={classes.searchIcon}
                                                    fontSize="large"
                                                />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>
                        <div className={classes.packageDetailsList}>
                            <TableContainer component={Paper} className={classes.tablePaper}>
                                <Table
                                    className={classes.table}
                                    aria-label="customized table"
                                    stickyHeader
                                >
                                    <TableHead className={classes.tableHead}>
                                        <TableRow>
                                            <StyledTableCell align="left" padding="normal">
                                                Package Name
                                            </StyledTableCell>
                                            <StyledTableCell align="left" padding="normal">
                                                Version
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className={classes.tableBody}>
                                        {packages?.map((row) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell align="left" padding="normal">
                                                    {row.title}
                                                </StyledTableCell>
                                                <StyledTableCell align="left" padding="normal">
                                                    {row.version}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
                <div></div>
            </Dialog>
        </div>
    );
};

export default AppScreenPackageDetails;
