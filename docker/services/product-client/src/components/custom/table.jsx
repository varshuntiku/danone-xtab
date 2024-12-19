import React, { Component } from 'react';

import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DateRangeSharpIcon from '@material-ui/icons/DateRangeSharp';
import { storytheme } from '../createStory/CreateStory';
import DownloadStory from '../createStory/downloadStory';
import ScheduleStoriesDialog from 'components/ScheduleStoriesDialog.jsx';
import ShareStory from '../createStory/ShareStory';
import DeleteStory from '../createStory/DeleteStory';
import clsx from 'clsx';

export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.titleText,
        fontSize: theme.layoutSpacing(18),
        fontFamily: theme.title.h1.fontFamily,
        height: theme.spacing(7.5),
        border: 'none',
        padding: theme.spacing(0.5, 2)
    },
    body: {
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.body.B5.fontFamily,
        border: 'none',
        color: theme.palette.text.titleText,
        padding: theme.spacing(0.3, 2)
    }
}))(TableCell);

export const StyledTableRow = withStyles(() => ({
    root: {}
}))(TableRow);

class CustomizedTables extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            rowsPerPage: 10,
            page: 0,
            scheduleStoriesDialog: false,
            storyData: false
        };
    }

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

    handleClickView = (data) => {
        this.props.previewStories(data);
    };

    handleClickEdit = (data) => {
        this.props.navigate(data);
    };

    openStoriesScheduleDialog = (data) => {
        this.setState({
            scheduleStoriesDialog: true,
            storyData: data
        });
    };

    closeStoriesScheduleDialog = () => {
        this.setState({
            scheduleStoriesDialog: false
        });
    };

    onResponseScheduleStory = () => {
        this.setState({
            scheduleStoriesDialog: false
        });
        this.props.onResponseScheduleStory();
    };

    getAppNames = (apps) => {
        if (apps.length > 2) {
            return apps.slice(0, 2).join(', ') + ' + ' + (apps.length - 2);
        }
        return apps.join(', ');
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {this.props.insideApp ? null : (
                                    <StyledTableCell>Application Name</StyledTableCell>
                                )}
                                <StyledTableCell>Story Name</StyledTableCell>
                                <StyledTableCell>Story Description</StyledTableCell>
                                <StyledTableCell>No of Items</StyledTableCell>
                                <StyledTableCell>Scheduled</StyledTableCell>
                                <StyledTableCell>Shared With</StyledTableCell>
                                <StyledTableCell>Actions </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.tableData
                                .slice(
                                    this.state.page * this.state.rowsPerPage,
                                    this.state.page * this.state.rowsPerPage +
                                        this.state.rowsPerPage
                                )
                                .map((row) => (
                                    <StyledTableRow key={row.story_id}>
                                        {this.props.insideApp ? null : (
                                            <StyledTableCell
                                                title={row.apps.map((a) => a.name).join(', ')}
                                            >
                                                {row.apps.map((a) => a.name).join(', ')}
                                            </StyledTableCell>
                                        )}
                                        <StyledTableCell
                                            title={
                                                row.story_page_count
                                                    ? 'Click to preview published story'
                                                    : 'Not yet published'
                                            }
                                            scope="row"
                                            className={clsx(
                                                row.story_page_count ? classes.cursorPointer : ''
                                            )}
                                            onClick={() =>
                                                row.story_page_count
                                                    ? this.handleClickView(row)
                                                    : null
                                            }
                                        >
                                            {row.story_name}
                                        </StyledTableCell>
                                        <StyledTableCell>{row.story_desc}</StyledTableCell>
                                        <StyledTableCell>{row.story_content_count}</StyledTableCell>
                                        <StyledTableCell>
                                            {row.story_schedule_status}
                                            {/* <IconButton aria-label="edit" onClick={() => this.openStoriesScheduleDialog(row)}>
                                            <EditOutlinedIcon fontSize="large" />
                                        </IconButton>  */}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.story_access_users.length
                                                ? row.story_access_users.join(', ')
                                                : '--'}
                                        </StyledTableCell>
                                        <StyledTableCell align="start">
                                            <IconButton
                                                aria-label="edit"
                                                className={classes.shareIconBtn}
                                                onClick={() => this.handleClickEdit(row)}
                                            >
                                                <EditOutlinedIcon fontSize="large" />
                                            </IconButton>

                                            {/* <IconButton aria-label="share">
                                            <ShareIcon fontSize="large" />
                                        </IconButton> {story_id:row.story_id}    */}
                                            <ThemeProvider theme={storytheme}>
                                                <ShareStory
                                                    story={{
                                                        name: row.story_name,
                                                        story_id: row.story_id,
                                                        id_token: row.id_token
                                                    }}
                                                    classes={{
                                                        iconBtn: classes.shareIconBtn
                                                    }}
                                                    logged_in_user_info={
                                                        this.props.logged_in_user_info
                                                    }
                                                />
                                            </ThemeProvider>

                                            {row.story_type === 'recurring' ? (
                                                <IconButton
                                                    title="Schedule story"
                                                    onClick={() =>
                                                        this.openStoriesScheduleDialog(row)
                                                    }
                                                    className={classes.shareIconBtn}
                                                >
                                                    <DateRangeSharpIcon fontSize="large" />
                                                </IconButton>
                                            ) : (
                                                ''
                                            )}

                                            <ThemeProvider theme={storytheme}>
                                                <DownloadStory
                                                    storyname={row.story_name}
                                                    story={row.story_id}
                                                />
                                            </ThemeProvider>

                                            <ThemeProvider theme={storytheme}>
                                                <DeleteStory
                                                    story={{
                                                        name: row.story_name,
                                                        story_id: row.story_id,
                                                        apps: row.apps
                                                    }}
                                                    classes={{
                                                        iconBtn: classes.shareIconBtn
                                                    }}
                                                />
                                            </ThemeProvider>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    className={classes.paginationWrapper}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={this.props.tableData.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                {this.state.scheduleStoriesDialog && (
                    <ScheduleStoriesDialog
                        logged_in_user_info={this.props.logged_in_user_info}
                        onClose={this.closeStoriesScheduleDialog}
                        onResponseScheduleStory={this.onResponseScheduleStory}
                        storyData={this.state.storyData}
                    ></ScheduleStoriesDialog>
                )}
            </div>
        );
    }
}

const styles = (theme) => ({
    emptyCell: {
        padding: '8px'
    },
    iconBtnn: {
        color: 'black'
    },
    paginationWrapper: {
        '& .MuiToolbar-root': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.layoutSpacing(14)
        },
        '& .MuiTablePagination-caption': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.layoutSpacing(14)
        },
        '& .MuiTablePagination-selectIcon': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.layoutSpacing(14)
        }
        // '& .MuiToolbar-root': {
        //     color: theme.palette.primary.contrastText,
        //     fontSize : theme.spacing(1.5),
        // },
        // '& .MuiToolbar-root': {
        //     color: theme.palette.primary.contrastText,
        //     fontSize : theme.spacing(1.5),
        // }
    },
    cursorPointer: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
    shareIconBtn: {
        '& svg': {
            color: theme.palette.text.titleText,
            fontSize: '2.5rem'
        }
    }
});

export default withStyles(styles)(CustomizedTables);
