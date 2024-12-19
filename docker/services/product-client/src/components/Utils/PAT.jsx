import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button, alpha } from '@material-ui/core';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { Link } from 'react-router-dom';
import PATdialog from './PATdialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import StyledTableRow from 'components/elements/styled-table-row/styled-table-row';
import StickyTableCell from 'components/elements/sticky-table-cell/sticky-table-cell';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteOutline } from '@material-ui/icons';
import { deleteUserToken, getJwtTokenByUser } from '../../services/alerts';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import ConfirmPopup from '../confirmPopup/ConfirmPopup';
import CustomSnackbar from '../CustomSnackbar';
import { ReactComponent as AccessDeniedIcon } from 'assets/img/common_access_denied.svg';

const useStyles = makeStyles((theme) => ({
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
    text: {
        color: theme.palette.text.default,
        fontSize: '2rem'
    },
    button: {
        float: 'right',
        margin: theme.spacing(2, 2),
        '& svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    permissonsection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%',
        gap: '2.5rem'
    },
    permissiontext1: {
        color: theme.palette.text.default
    },
    permissontext: {
        color: theme.palette.text.default,
        fontSize: '1.8rem',
        textAlign: 'center'
    },
    permissionicon: {
        color: theme.palette.primary.contrastText,
        width: '5rem',
        height: '5rem'
    },
    main: {
        padding: '4rem'
    },
    generatebutton: {
        display: 'flex',
        alignItems: 'center',
        color: 'white'
    },
    topdiv: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    grid: {
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
        marginBottom: '2rem'
    },
    backbutton: {
        display: 'flex',
        alignItems: 'center',
        color: '#fff'
    },
    backIcon: {
        marginRight: '1rem',
        fill: theme.palette.text.revamp
    },
    action: {
        color: 'red',
        cursor: 'pointer'
    },
    permissiontextdiv: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pagination: {
        background: theme.palette.primary.dark,
        borderTop: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        borderRadius: '0 0 5px 5px',
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        position: 'sticky',
        bottom: 0,
        left: 0
    },
    paginationActions: {
        padding: theme.spacing(1),
        '& svg': {
            color: theme.palette.text.default,
            fontSize: theme.spacing(3)
        }
    },
    paginationCaptions: {
        color: theme.palette.text.default,
        fontSize: theme.spacing(2)
    },
    paginationSelectRoot: {
        background: theme.palette.primary.light,
        borderRadius: '5px',
        '& .MuiSelect-select.MuiSelect-select': {
            paddingRight: theme.spacing(4)
        }
    },
    paginationSelect: {
        padding: theme.spacing(1) + ' ' + theme.spacing(2)
    },
    paginationSelectIcon: {
        position: 'absolute',
        pointerEvents: 'none',
        color: theme.palette.text.default,
        fontSize: theme.spacing(3),
        top: '50%',
        transform: 'translateY(-50%)'
    },
    paginationMenu: {
        width: '100%'
    },
    paginationToolBar: {
        padding: theme.spacing(1)
    }
}));

function PAT(props) {
    const { user_permissions } = props;
    const [tokendailog, setTokendialog] = useState(false);
    const [userTokens, setUserTokens] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loader, setLoader] = useState(true);
    const [deleteNotification, setDeleteNotification] = useState({
        showNotification: false,
        message: ''
    });
    const classes = useStyles();
    const tableHeaderCells = [
        { id: 'created_at', label: 'created_at' },
        { id: 'access', label: 'access' },
        { id: 'actions', label: 'actions' }
    ];

    const showTokenDialog = () => {
        setTokendialog(true);
    };

    const deleteToken = async (id, user_email) => {
        try {
            await deleteUserToken({
                id: id,
                payload: { id: id, user_email: user_email },
                callback: deleteTokenResponse
            });
        } catch (error) {
            setDeleteNotification((prevstate) => ({
                ...prevstate,
                showNotification: true,
                message: error.response?.data?.error || 'Failed to delete.Try again'
            }));
        }
    };

    const deleteTokenResponse = (response) => {
        if (response) {
            setDeleteNotification((prevstate) => ({
                ...prevstate,
                showNotification: true,
                message: response.message
            }));
        }
        reloadData();
    };
    useEffect(() => {
        if (user_permissions?.app_publish || user_permissions?.admin) {
            loadData();
        }
    }, []);

    const loadData = async () => {
        setLoader(true);
        try {
            await getJwtTokenByUser({
                callback: (response) => {
                    setUserTokens(response.tokens);
                }
            });
        } catch (error) {
            setDeleteNotification((prevstate) => ({
                ...prevstate,
                showNotification: true,
                message: error.response?.data?.error || 'Failed to load.Try again',
                severity: 'error'
            }));
        }
        setLoader(false);
    };

    const reloadData = async () => {
        setLoader(true);
        try {
            if (user_permissions?.app_publish || user_permissions?.admin) {
                await getJwtTokenByUser({
                    callback: (response) => {
                        setUserTokens(response.tokens);
                    }
                });
            }
        } catch (error) {
            setDeleteNotification((prevstate) => ({
                ...prevstate,
                showNotification: true,
                message: error.response?.data?.error || 'Failed to load.Try again!',
                severity: 'error'
            }));
        }
        setLoader(false);
    };
    const table = loader ? (
        <CodxCircularLoader size={60} center />
    ) : (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {tableHeaderCells.map((item) => (
                                <StickyTableCell key={item.id}>{item.label}</StickyTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userTokens
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((item) => {
                                let content = [];
                                if (item.access) {
                                    let obj = JSON.parse(item.access);
                                    let objKeys = Object.keys(obj);
                                    objKeys.map((el) => {
                                        if (obj[el]) {
                                            content.push(el.toUpperCase().replace(/_/g, ' '));
                                        }
                                    });
                                }
                                return (
                                    <StyledTableRow key={item.id}>
                                        <StickyTableCell>
                                            {new Date(item.created_at).toLocaleString()}
                                        </StickyTableCell>
                                        <StickyTableCell>{content.join(', ')}</StickyTableCell>
                                        <StickyTableCell>
                                            <ConfirmPopup
                                                onConfirm={() =>
                                                    deleteToken(item.id, item.user_email)
                                                }
                                                title="Delete Token"
                                                subTitle="Are you sure you want to delete the token?"
                                                warningMessage="This token will be deleted permanently"
                                                cancelText="Cancel"
                                                confirmText="Delete"
                                            >
                                                {(triggerConfirm) => (
                                                    <DeleteOutline
                                                        fontSize="large"
                                                        onClick={triggerConfirm}
                                                        className={classes.action}
                                                    />
                                                )}
                                            </ConfirmPopup>
                                        </StickyTableCell>
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                className={classes.pagination}
                classes={{
                    actions: classes.paginationActions,
                    caption: classes.paginationCaptions,
                    select: classes.paginationSelect,
                    selectIcon: classes.paginationSelectIcon,
                    selectRoot: classes.paginationSelectRoot,
                    menuItem: classes.paginationMenu,
                    toolbar: classes.paginationToolBar
                }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={userTokens?.length || 1}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
            <CustomSnackbar
                open={deleteNotification.showNotification}
                autoHideDuration={2000}
                onClose={() => {
                    setDeleteNotification((prevstate) => ({
                        ...prevstate,
                        showNotification: false,
                        message: ''
                    }));
                }}
                severity={deleteNotification.severity}
                message={deleteNotification.message}
            />
        </div>
    );

    const permissionsection = !user_permissions ? (
        <CodxCircularLoader size={60} center />
    ) : (
        <div className={classes.permissonsection}>
            <AccessDeniedIcon />
            <div className={classes.permissiontextdiv}>
                <Typography variant="h2" className={classes.permissiontext1}>
                    Access Denied
                </Typography>
                <Typography className={classes.permissontext}>
                    It&apos;s look like you don&apos;t have permission to generate token.
                    <br />
                    Contact to your adminstartor for more details.{' '}
                </Typography>
            </div>
        </div>
    );

    return (
        <div className={classes.main}>
            <Grid item sx={12} md={12} className={classes.grid}>
                <div className={classes.topdiv}>
                    <div id="go-back-link-container" className={classes.backbutton}>
                        <Link to={'/platform-utils'} aria-label="plaform-utils">
                            <ArrowBackIosRoundedIcon
                                fontSize="large"
                                className={classes.backIcon}
                            />
                        </Link>
                        <div id="page-header-container" className={classes.generatebutton}>
                            <Typography variant="subtitle2" className={classes.text}>
                                Generate PAT
                            </Typography>
                        </div>
                    </div>

                    {(user_permissions?.app_publish || user_permissions?.admin) &&
                    user_permissions ? (
                        <div id="cta-buttons">
                            <Button
                                key={2}
                                variant="outlined"
                                className={classes.button}
                                onClick={showTokenDialog}
                                startIcon={<AddCircleOutlineOutlinedIcon />}
                                // disabled={loading}
                                aria-label="Generate token"
                            >
                                Generate Token
                            </Button>
                        </div>
                    ) : null}
                </div>
            </Grid>
            {user_permissions?.app_publish || user_permissions?.admin ? table : permissionsection}
            <PATdialog
                showDialog={tokendailog}
                setTokendialog={setTokendialog}
                classes={classes}
                reloadData={reloadData}
            />
        </div>
    );
}

export default PAT;
