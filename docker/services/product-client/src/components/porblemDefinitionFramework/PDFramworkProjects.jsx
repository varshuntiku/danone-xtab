import React, { useState } from 'react';
import { Button, IconButton, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import GridTable from '../gridTable/GridTable';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteProject, getProjects } from '../../services/project';
import ConfirmPopup from '../confirmPopup/ConfirmPopup';
import CustomSnackbar from '../CustomSnackbar';
import { useRef } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
// import { useMatomo } from '@datapunt/matomo-tracker-react'
import { connect } from 'react-redux';
import { logMatomoEvent } from '../../services/matomo';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import NucliosBox from '../NucliosBox';
import Footer from 'components/Footer.jsx';

// const useStyles = makeStyles(theme => ({
//     colorContrast: {
//         color: theme.palette.primary.contrastText
//     },
//     colorDefault: {
//         color: theme.palette.text.default
//     },
//     fontSize1: {
//         fontSize: "1.6rem"
//     },
//     fontSize2: {
//         fontSize: "1.2rem"
//     }
// }))
const useStyles = makeStyles((theme) => ({
    addIcon: {
        fill: theme.palette.text.btnTextColor,
        marginRight: '1rem'
    },
    header: {
        display: 'flex',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.layoutSpacing(16)} ${theme.layoutSpacing(14)}`
    },
    headerText: {
        fontSize: theme.layoutSpacing(31.3),
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default
    },
    backIcon: {
        fontSize: theme.layoutSpacing(31.3),
        marginLeft: theme.layoutSpacing(31.3),
        cursor: 'pointer'
    },
    container: {
        margin: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(18)}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'flex-start'
    }
}));
function PDFrameWorkProjects({ user_permissions, ...props }) {
    const classes = useStyles();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState({});
    const gridRef = useRef();
    const { all_projects, my_projects, my_projects_only } = user_permissions || {};
    // const { trackEvent } = useMatomo()

    const handleDelete = async (row) => {
        try {
            await deleteProject(row.data.id);
            setNotification({ message: 'Deleted Successfully' });
            setNotificationOpen(true);
            gridRef.current.fetchServerSideRowData();
        } catch (error) {
            // console.error(error);
            setNotification({ message: 'Failed to delete project. Try again.', severity: 'error' });
            setNotificationOpen(true);
        }
    };

    const handleEdit = (row) => {
        props.history.push(`/projects/${row.data.id}/version/${row.data.pd_version_id}/edit`);
    };

    const handleView = (row) => {
        props.history.push(`/projects/${row.data.id}/version/${row.data.pd_version_id}/view`);
    };

    const tableParams = {
        gridOptions: {
            suppressToolBar: true,
            enablePagination: true,
            tableMaxHeight: '72vh',
            stripeRow: true,
            paginationSettings: {
                rowsPerPageOptions: [10, 15, 25, 50],
                rowsPerPage: 10
            },
            serverSideDataSource: {
                getRowData: async (params) => {
                    const searchColumn = Object.keys(params?.colSearch).map((key, index) => {
                        if (params?.colSearch[key] !== '') {
                            return true;
                        }
                        if (index + 1 == params?.colSearch.length) {
                            return false;
                        }
                    });
                    const payload = {
                        page: searchColumn.includes(true) ? 0 : params.page,
                        pageSize: params.rowsPerPage,
                        sorted: params.orderedColKey
                            ? [
                                  {
                                      id: params.orderedColKey,
                                      desc: params.order === 'desc'
                                  }
                              ]
                            : [],
                        filtered: [
                            ...Object.keys(params?.colSearch).map((key) => ({
                                id: key,
                                value: params?.colSearch[key]
                            })),
                            { id: 'origin', value: 'PDF' }
                        ]
                    };
                    const resp = await getProjects(payload);
                    return {
                        rowData: resp.data,
                        page: resp.page,
                        count: resp.count
                    };
                }
            },
            editorMode: true
        },
        coldef: [
            {
                headerName: 'Account name',
                field: 'account',
                search: true,
                sortable: false
            },
            {
                headerName: 'Project Name',
                field: 'name',
                search: true,
                sortable: true
            },
            {
                headerName: 'Domain',
                field: 'industry',
                search: true,
                sortable: true
            },
            {
                headerName: 'Business Function',
                field: 'function',
                search: false,
                sortable: false
            },
            {
                headerName: 'Problem Areas',
                field: 'problem_area',
                search: false,
                sortable: false
            },
            {
                headerName: 'Assigned To',
                field: 'assignees_label',
                cellRenderer: 'stackedElemets',
                search: true
            },
            {
                headerName: 'Reviewer',
                field: 'reviewer',
                search: true,
                sortable: false
            },
            {
                headerName: 'Created By',
                field: 'created_by',
                search: true,
                sortable: false
            },
            {
                headerName: 'Updated By',
                field: 'updated_by',
                search: true,
                sortable: false
            },
            {
                headerName: 'Actions',
                cellRenderer: ({ row }) => (
                    <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                        {row.data.user_access.edit ? (
                            <IconButton title="Edit" size="small" onClick={() => handleEdit(row)}>
                                <EditIcon fontSize="large" />
                            </IconButton>
                        ) : null}
                        {!row.data.user_access.edit && row.data.user_access.view ? (
                            <IconButton title="View" size="small" onClick={() => handleView(row)}>
                                <VisibilityIcon fontSize="large" />
                            </IconButton>
                        ) : null}
                        {row.data.user_access.delete ? (
                            <ConfirmPopup
                                onConfirm={() => handleDelete(row)}
                                subTitle="Delete project?"
                            >
                                {(triggerConfirm) => (
                                    <IconButton
                                        title="Delete"
                                        size="small"
                                        onClick={triggerConfirm}
                                    >
                                        <DeleteIcon fontSize="large" />
                                    </IconButton>
                                )}
                            </ConfirmPopup>
                        ) : null}
                    </div>
                ),
                editable: false
            }
        ]
    };

    const navigateBack = () => {
        props.history.push(`/dashboard`);
    };
    return (
        <div className={classes.container}>
            <NucliosBox>
                <div
                    aria-label="pd framework projects root"
                    // className={classes.container}
                >
                    {all_projects || my_projects_only || my_projects ? (
                        <div className={classes.header}>
                            <span onClick={navigateBack}>
                                <ArrowBackIosIcon className={classes.backIcon} />
                            </span>
                            <Typography className={classes.headerText}>All Projects</Typography>
                            <Link
                                underline="none"
                                variant="h5"
                                component={(p) => (
                                    <Button size="small" variant="contained" {...p} />
                                )}
                                onClick={() => {
                                    logMatomoEvent({
                                        e_c: 'PDFramework',
                                        e_a: 'click-event-of-create-project',
                                        e_n: 'Create project',
                                        action_name: 'PDFramework',
                                        ca: 1,
                                        url: window.location.href,
                                        // urlref: window.location.href,
                                        pv_id: props.matomo.pv_id
                                    });
                                    props.history.push('/projects/create');
                                }}
                            >
                                <AddIcon className={classes.addIcon} fontSize="large" />
                                <span>Create Projects</span>
                            </Link>
                        </div>
                    ) : null}
                    <br />
                    <GridTable ref={gridRef} params={tableParams} />
                    <CustomSnackbar
                        open={notificationOpen && notification?.message}
                        autoHideDuration={3000}
                        onClose={setNotificationOpen.bind(null, false)}
                        severity={notification?.severity || 'success'}
                        message={notification?.message}
                    />
                </div>
            </NucliosBox>
            <Footer projects />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        matomo: state.matomo
    };
};

const mapDispatchToProps = () => {
    return {
        // getMatomoPvid: (pageType) => dispatch(getMatomoPvid(pageType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    PDFrameWorkProjects
);
