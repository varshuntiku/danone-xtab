import React, { useState, useEffect } from 'react';
import { Checkbox, FormControl, Typography, Grid } from '@material-ui/core';
import { apiHelper } from 'services/allServicesStatus.js';
import UtilsDataTable from './UtilsDataTable';

export default function AllServicesStatus() {
    const tableHeaderCells = [
        {
            id: 'service',
            label: 'Service'
        },
        {
            id: 'check',
            label: 'Check'
        },
        {
            id: 'status',
            label: 'Status'
        }
    ];
    const [serviceStatusDict, setServiceStatusDict] = useState({});
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [autoRefreshToggle, setAutoRefreshToggle] = useState(0);
    const [autoRefreshNumber, setAutoRefreshNumber] = useState(0);
    const [servicesStatus, setServicesStatus] = useState([]);
    const [services, setServices] = useState([
        {
            name: 'API',
            params: {},
            allChecks: [
                {
                    name: 'Healthcheck',
                    endpoint: '/healthcheck',
                    method: 'get',
                    status: 'checking',
                    successStatus: 200
                },
                {
                    name: 'DB Connection',
                    endpoint: '/nuclios-product-api/users/user-groups',
                    method: 'get',
                    status: 'checking',
                    successStatus: 200
                }
            ]
        },
        {
            name: 'DEE Service',
            params: {
                urlMapper: 'dee'
            },
            allChecks: [
                {
                    name: 'Healthcheck',
                    endpoint: '/healthcheck',
                    method: 'get',
                    status: 'checking',
                    successStatus: 200
                },
                {
                    name: 'DB Connection',
                    endpoint: '/services/dynamic-execution-environment/compute/configurations',
                    method: 'get',
                    status: 'checking',
                    successStatus: 200
                },
                {
                    name: 'Fileshare Connection',
                    endpoint: '/services/envs/packages/list',
                    method: 'get',
                    status: 'checking',
                    successStatus: 200
                },
                {
                    name: 'Exec ENV',
                    endpoint: '/services/execute/uiac/test',
                    method: 'post',
                    payload: { code: 'dynamic_outputs = "{}"', filters: {}, app_id: 2 },
                    status: 'checking',
                    successStatus: 200
                }
            ]
        },
        {
            name: 'Minerva Service',
            params: {
                urlMapper: 'minerva'
            },
            allChecks: [
                {
                    name: 'Healthcheck',
                    endpoint: '/healthcheck',
                    method: 'get',
                    status: 'checking',
                    successStatus: 200
                },
                {
                    name: 'DB Connection',
                    endpoint: '/copilot_tool/tool/list?limit=2',
                    method: 'get',
                    status: 'checking',
                    successStatus: 200
                }
            ]
        },
        {
            name: 'Genai Service',
            params: {
                urlMapper: 'genai'
            },
            allChecks: [
                {
                    name: 'Healthcheck',
                    endpoint: '/healthcheck',
                    method: 'get',
                    status: 'checking',
                    successStatus: 200
                },
                {
                    name: 'DB Connection',
                    endpoint: '/services/ml-models/table-configurations/deployed',
                    method: 'get',
                    status: 'checking',
                    successStatus: 200
                }
            ]
        }
    ]);

    useEffect(() => {
        let services_ = services;
        if (
            !(
                import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] &&
                ('' + import.meta.env['REACT_APP_DEE_ENV_BASE_URL']).length > 5
            )
        ) {
            services_ = services_.filter((service) => service.name !== 'DEE Service');
        }
        setServices(services_);
    }, []);

    useEffect(() => {
        let servicesStatus_ = [];
        for (let service of services) {
            for (let i = 0; i < service.allChecks.length; i++) {
                const check = service.allChecks[i];
                servicesStatus_.push({
                    service: service.name,
                    check: check.name,
                    status: serviceStatusDict?.[service.name + check.name] || 'checking'
                });
            }
        }
        setServicesStatus(servicesStatus_);
    }, [serviceStatusDict]);

    useEffect(() => {
        async function fetchServicesStatus() {
            for (let service of services) {
                service.allChecks.map((check) => {
                    return apiHelper({
                        ...check,
                        ...service.params,
                        callback: (response) => {
                            setServiceStatusDict((serviceStatusDict_) => ({
                                ...serviceStatusDict_,
                                [service.name + check.name]:
                                    response?.statusCode === check.successStatus ? 'OK' : 'Error'
                            }));
                        }
                    });
                });
            }
            setLastRefresh(new Date());
        }
        setServiceStatusDict({});
        fetchServicesStatus();
    }, [autoRefreshToggle]);

    const setAutoRefreshHelper = () => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                setAutoRefreshToggle((autoRefreshToggle) => autoRefreshToggle + 1);
            }, 30000);
            setAutoRefreshNumber(interval);
        } else if (autoRefreshNumber) {
            clearInterval(autoRefreshNumber);
            setAutoRefreshNumber(0);
        }
    };

    useEffect(() => {
        setAutoRefreshHelper();
        return () => {
            if (autoRefreshNumber) {
                clearInterval(autoRefreshNumber);
                setAutoRefreshNumber(0);
            }
        };
    }, [autoRefresh]);

    return (
        <>
            <Grid key="form-body" container justifyContent="space-evenly" alignItems="center">
                <Grid item xs={8} alignItems="center">
                    <FormControl
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Checkbox
                            checked={autoRefresh}
                            onChange={() => setAutoRefresh(!autoRefresh)}
                        />
                        <Typography variant="h4">Auto Refresh Every 30 seconds</Typography>
                    </FormControl>
                </Grid>
                <Grid>
                    <Typography variant="h4">
                        Last Refresh: {lastRefresh.toLocaleTimeString()}
                    </Typography>
                </Grid>
            </Grid>

            {servicesStatus?.length && (
                <div>
                    <UtilsDataTable
                        onHandleSearch={() => {}}
                        tableHeaderCells={tableHeaderCells}
                        tableData={servicesStatus}
                        page="services"
                        hidePagination
                        paginationInfo={{
                            page: 1,
                            rowsPerPage: 25,
                            totalCount: servicesStatus?.length
                        }}
                    />
                </div>
            )}
        </>
    );
}
