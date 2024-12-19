import React, { useState } from 'react';
import { Button, IconButton, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import GridTable from '../gridTable/GridTable';
import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
// import { deleteProject, getProjects } from '../../services/project';
import { getProjects } from '../../services/project';
// import ConfirmPopup from '../confirmPopup/ConfirmPopup';
import CustomSnackbar from '../CustomSnackbar';
import { useRef } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
// import { logMatomoEvent } from '../../services/matomo';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    addIcon: {
        fill: theme.palette.text.btnTextColor,
        marginRight: '1rem'
    },
    action: {
        width: '100%',
        display: 'flex',
        marginBottom: theme.layoutSpacing(16)
    }
}));
function ProjectList({ user_permissions, ...props }) {
    const classes = useStyles();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification] = useState({});
    const gridRef = useRef();
    const { all_projects, my_projects, my_projects_only } = user_permissions || {};

    // const handleDelete = async (row) => {
    //     try {
    //         await deleteProject(row.data.id);
    //         setNotification({ message: 'Deleted Successfully' });
    //         setNotificationOpen(true);
    //         gridRef.current.fetchServerSideRowData();
    //     } catch (error) {
    //         // console.error(error);
    //         setNotification({ message: 'Failed to delete project. Try again.', severity: 'error' });
    //         setNotificationOpen(true);
    //     }
    // };

    const handleEdit = (row) => {
        props.dsAppConfig.setProjectDetailsState((prevState) => ({
            ...prevState,
            projectData: row
        }));
        props.history.push(
            `/ds-workbench/project/${row.data.id}/setup/project-overview?mode='edit'`
        );
    };

    const handleView = (row) => {
        props.history.push(
            `/ds-workbench/project/${row.data.id}/setup/project-overview?mode='view'`
        );
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
                    const payload = {
                        page: params.page,
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
                            { id: 'origin', value: 'DS-Workbench' }
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
                        {/* {row.data.user_access.delete ? (
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
                        ) : null} */}
                    </div>
                ),
                editable: false
            }
        ]
    };

    return (
        <div
            aria-label="ds workbench projects root"
            style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'flex-start'
            }}
        >
            <div className={classes.action}>
                <div style={{ flex: 1 }} />
                {all_projects || my_projects_only || my_projects ? (
                    <Link
                        underline="none"
                        variant="h5"
                        component={(p) => <Button size="small" variant="contained" {...p} />}
                        onClick={() => {
                            props.history.push('/ds-workbench/project/0/setup/project-overview');
                        }}
                    >
                        <AddIcon className={classes.addIcon} fontSize="large" />
                        <span>Create</span>
                    </Link>
                ) : null}
            </div>
            <GridTable ref={gridRef} params={tableParams} />
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </div>
    );
}

export default withRouter(ProjectList);
