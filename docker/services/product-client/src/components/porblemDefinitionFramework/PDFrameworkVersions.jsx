import { IconButton, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import ConfirmPopup from '../confirmPopup/ConfirmPopup';
import GridTable from '../gridTable/GridTable';
import CustomSnackbar from '../CustomSnackbar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteVersion, getVersionData, getVersions } from '../../services/project';
import { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles(() => ({
    deleteBtn: {
        '&.MuiIconButton-root.Mui-disabled': {
            '&>.MuiIconButton-label svg': {
                opacity: '0.3'
            },
            pointerEvents: 'auto'
        }
    },
    firstIcon: {
        '&:hover': {
            backgroundColor: 'none'
        }
    }
}));

function PDFrameworkVersions({ projectId, setHistoryPopup, user_access, ...props }) {
    const classes = useStyles();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState({});
    const gridRef = useRef();
    const handleDelete = async (row) => {
        try {
            await deleteVersion(projectId, row.data.version_id);
            setNotification({ message: 'Deleted Successfully' });
            setNotificationOpen(true);
            gridRef.current.fetchServerSideRowData();
        } catch (error) {
            setNotification({ message: 'Failed to delete project. Try again.', severity: 'error' });
            setNotificationOpen(true);
        }
    };

    const isCurrentTrue = (
        <IconButton title="current version" size="medium">
            <DoneIcon fontSize="Large"></DoneIcon>
        </IconButton>
    );

    const isCurrentFalse = (
        <IconButton title="not a current version" size="medium">
            <ClearIcon fontSize="Large"></ClearIcon>
        </IconButton>
    );

    const handleEdit = async (row) => {
        setHistoryPopup(false);
        try {
            const response = await getVersionData(projectId, row.data.version_id);
            props.history.push(`/projects/${projectId}/version/${row.data.version_id}/edit`, {
                versionData: response
            });
        } catch (error) {
            setNotification({
                message: 'Failed to Fetch data. Try again.',
                severity: 'error'
            });
            setNotificationOpen(true);
        }
    };

    const handleView = async (row) => {
        setHistoryPopup(false);
        try {
            const response = await getVersionData(projectId, row.data.version_id);
            props.history.push(`/projects/${projectId}/version/${row.data.version_id}/view`, {
                versionData: response
            });
        } catch (error) {
            setNotification({
                message: 'Failed to Fetch data. Try again.',
                severity: 'error'
            });
            setNotificationOpen(true);
        }
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
                        sorted: JSON.stringify(
                            params.orderedColKey
                                ? [
                                      {
                                          id: params.orderedColKey,
                                          desc: params.order === 'desc'
                                      }
                                  ]
                                : []
                        ),
                        filtered: JSON.stringify([
                            ...Object.keys(params?.colSearch).map((key) => ({
                                id: key,
                                value: params?.colSearch[key]
                            }))
                        ])
                    };

                    const response = await getVersions({ projectId: projectId, payload: payload });
                    const resp =
                        response.data &&
                        [...response.data].map((data) => {
                            return {
                                ...data,
                                created_at: new Date(data.created_at * 1000).toLocaleDateString(
                                    'default',
                                    {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }
                                ),
                                is_current_icon: data.is_current ? isCurrentTrue : isCurrentFalse
                            };
                        });

                    return {
                        rowData:
                            resp.length < 5
                                ? resp.concat(
                                      Array(5 - resp.length).fill({
                                          version_name: '',
                                          is_current_icon: '',
                                          created_by_user: '',
                                          created_at: '',
                                          updated_by_user: '',
                                          is_current: '',
                                          version_id: ''
                                      })
                                  )
                                : resp,
                        page: response.page,
                        count: response.count
                    };
                }
            },
            editorMode: true
        },
        coldef: [
            {
                headerName: 'Version',
                field: 'version_name',
                search: true,
                sortable: true
            },
            {
                headerName: 'Current version',
                field: 'is_current_icon',
                search: false,
                sortable: false
            },
            {
                headerName: 'Created by',
                field: 'created_by_user',
                search: true,
                sortable: false
            },
            {
                headerName: 'Created on',
                field: 'created_at',
                search: false,
                sortable: true
            },
            {
                headerName: 'Last updated by',
                field: 'updated_by_user',
                search: true,
                sortable: false
            },

            {
                headerName: 'Actions',
                cellRenderer: ({ row }) => {
                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'nowrap',
                                visibility: `${row.data.version_id ? '' : 'hidden'}`
                            }}
                        >
                            {user_access.edit ? (
                                <IconButton
                                    title="Edit"
                                    size="small"
                                    onClick={() => handleEdit(row)}
                                >
                                    <EditIcon fontSize="large" />
                                </IconButton>
                            ) : null}
                            {!user_access.edit && user_access.view ? (
                                <IconButton
                                    title="View"
                                    size="small"
                                    onClick={() => handleView(row)}
                                >
                                    <VisibilityIcon fontSize="large" />
                                </IconButton>
                            ) : null}
                            {user_access.edit ? (
                                <ConfirmPopup
                                    onConfirm={() => handleDelete(row)}
                                    subTitle="Delete version?"
                                >
                                    {(triggerConfirm) => (
                                        <IconButton
                                            title={
                                                row.data.is_current
                                                    ? 'cannot delete current version'
                                                    : 'Delete'
                                            }
                                            className={classes.firstIcon}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={triggerConfirm}
                                                className={classes.deleteBtn}
                                                disabled={row.data.is_current}
                                            >
                                                <DeleteIcon fontSize="large" />
                                            </IconButton>
                                        </IconButton>
                                    )}
                                </ConfirmPopup>
                            ) : null}
                        </div>
                    );
                },
                editable: false
            }
        ]
    };
    return (
        <div
            aria-label="pd framework projects root"
            style={{
                display: 'flex',
                height: '100%',
                width: '100%'
            }}
        >
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
export default withRouter(PDFrameworkVersions);
