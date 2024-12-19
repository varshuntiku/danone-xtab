import React, { useCallback, useEffect, useState } from 'react';
import { getDownloadStatus } from '../../services/reports';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles, Paper, withStyles, IconButton, Typography } from '@material-ui/core';
import { Table } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableBody from '@material-ui/core/TableBody';
import { StyledTableCell as TableCell, StyledTableRow } from '../custom/table';
import { Link } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';
import RefreshIcon from '@material-ui/icons/Refresh';
import Toolbar from '@material-ui/core/Toolbar';

export const StyledTableCell = withStyles((theme) => ({
    body: {
        padding: theme.spacing(3, 2)
    }
}))(TableCell);

const useStyles = makeStyles((theme) => ({
    paginationRoot: {
        color: theme.palette.primary.contrastText,
        fontSize: theme.spacing(1.7)
    },
    paginationCaption: {
        color: theme.palette.primary.contrastText,
        fontSize: theme.spacing(1.7)
    },
    iconButtonProgress: {
        backgroundColor: theme.palette.primary.contrastText
    },
    statusCell: {
        '&.SUCCESS': {
            color: green[500]
        },
        '&.FAILURE': {
            color: red[500]
        }
    },
    message: {
        padding: '0 1em',
        color: theme.palette.text.titleText
    }
}));

export default function StoryDownloadStatusTable({ appId }) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [message, setMessage] = useState('');

    const fetchData = useCallback(() => {
        setLoading(true);
        setMessage('');
        try {
            getDownloadStatus({
                payload: { app_id: appId },
                callback: (d) => {
                    setLoading(false);
                    setData(d);
                    setMessage(d.length ? '' : 'No recrod found');
                }
            });
        } catch (err) {
            setLoading(false);
        }
    }, [appId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    }, []);

    return (
        <div>
            <Toolbar style={{ justifyContent: 'flex-end', minHeight: 'unset', padding: '0.5rem' }}>
                {message && (
                    <Typography variant="h4" className={classes.message}>
                        {message}
                    </Typography>
                )}
                <div style={{ flex: 1 }}></div>
                <IconButton title="refresh data" onClick={fetchData}>
                    <RefreshIcon style={{ fontSize: '2.5rem' }} />
                </IconButton>
            </Toolbar>
            {loading && <LinearProgress className={classes.iconButtonProgress} size={40} />}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {!appId && <StyledTableCell>Applications</StyledTableCell>}
                            <StyledTableCell>Story name</StyledTableCell>
                            <StyledTableCell>Triggered at</StyledTableCell>
                            <StyledTableCell>Updated at</StyledTableCell>
                            <StyledTableCell>File type</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell align="right">Download link</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, i) => (
                            <StyledTableRow key={i}>
                                {!appId && (
                                    <StyledTableCell>
                                        {row.apps.map((el) => el.name).join(', ')}
                                    </StyledTableCell>
                                )}
                                <StyledTableCell>{row.story_name}</StyledTableCell>
                                <StyledTableCell>
                                    {new Date(row.triggered_at).toLocaleString()}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {row.updated_at && new Date(row.updated_at).toLocaleString()}
                                </StyledTableCell>
                                <StyledTableCell>{row.file_type}</StyledTableCell>
                                <StyledTableCell
                                    className={clsx(classes.statusCell, row.download_status)}
                                >
                                    {row.download_status}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {row.download_status === 'SUCCESS' && row.link ? (
                                        <Link
                                            color="inherit"
                                            href={row.link}
                                            download={
                                                row.story_name +
                                                '.' +
                                                row?.file_name?.split('.').splice(-1)[0]
                                            }
                                            underline="always"
                                        >
                                            {row.story_name +
                                                '.' +
                                                row?.file_name?.split('.').splice(-1)[0]}
                                        </Link>
                                    ) : null}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                classes={{
                    root: classes.paginationRoot,
                    caption: classes.paginationCaption
                }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={setPage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    );
}
