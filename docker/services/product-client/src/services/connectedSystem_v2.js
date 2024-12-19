import httpClient from 'services/httpClient.js';

export async function getConnectedSystems(params) {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function getConnectedSystem(params) {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateConnectedSystem(params) {
    try {
        const response = await httpClient.put(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function createConnectedSystem(params) {
    try {
        const response = await httpClient.post(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteConnectedSystem(params) {
    try {
        const response = await httpClient.delete(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }`,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

/*Dashboard Tabs*/
export async function getDashboardTabs(params) {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/tab`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function getDashboardTabData(params) {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/tab/${
                params.connSystemDashboardTabId
            }`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function createDashboardTab(params) {
    try {
        const response = await httpClient.post(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/tab`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateDashboardTab(params) {
    try {
        const response = await httpClient.put(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/tab/${
                params.dashboard_tab_id
            }`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteDashboardTab(params) {
    try {
        const response = await httpClient.delete(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/tab/${
                params.id
            }`,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

/*Goals*/
export const getGoalDetails = async (params) => {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/goal/details`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
};
export const getGoals = async (params) => {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/goal`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
};

export async function getGoalData(params) {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/goal/${
                params.connSystemGoalId
            }`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function createGoal(params) {
    try {
        const response = await httpClient.post(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/goal`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateGoal(params) {
    try {
        const response = await httpClient.put(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/goal/${
                params.goal_id
            }`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteGoal(params) {
    try {
        const response = await httpClient.delete(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/goal/${
                params.id
            }`,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

/*Initiatives*/
export const getInitiatives = async (params) => {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/initiative`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
};

export async function getInitiativeData(params) {
    try {
        const response = await httpClient.get(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/initiative/${params.connSystemInitiativeId}`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function createInitiative(params) {
    try {
        const response = await httpClient.post(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/goal/${
                params.connSystemGoalId
            }/initiative`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateInitiative(params) {
    try {
        const response = await httpClient.put(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/initiative/${params.initiative_id}`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteInitiative(params) {
    try {
        const response = await httpClient.delete(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/initiative/${params.id}`,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

/*Drivers*/
export const getDriverDetails = async (params) => {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/driver/details`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
};
export const getDrivers = async (params) => {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/driver`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
};

export async function getDriverData(params) {
    try {
        const response = await httpClient.get(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/driver/${params.connSystemDriverId}`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function createDriver(params) {
    try {
        const response = await httpClient.post(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/driver`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateDriver(params) {
    try {
        const response = await httpClient.put(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/driver/${params.driver_id}`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteDriver(params) {
    try {
        const response = await httpClient.delete(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/driver/${params.id}`,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

/*Business Processes*/
export const getBusinessProcesses = async (params) => {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/business-process`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
};
export const getBusinessProcessesByDriver = async (params) => {
    try {
        const response = await httpClient.get(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/driver/${params.connSystemDriverId}/business-process`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
};

export async function getBusinessProcessData(params) {
    try {
        const response = await httpClient.get(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/business-process/${params.connSystemBusinessProcessId}`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function createBusinessProcess(params) {
    try {
        const response = await httpClient.post(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/driver/${params.connSystemDriverId}/business-process`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateBusinessProcess(params) {
    try {
        const response = await httpClient.put(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/business-process/${params.business_process_id}`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteBusinessProcess(params) {
    try {
        const response = await httpClient.delete(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/business-process/${params.id}`,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function createBusinessProcessFromTemplate(params) {
    try {
        const response = await httpClient.post(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/driver/${
                params.connSystemDriverId
            }/business-process-from-template`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

/*Business Process Templates*/
export const getBusinessProcessTemplates = async (params) => {
    try {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/${
                params.connSystemDashboardId
            }/business-process-template`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
};
export const getBusinessProcessTemplatesByDriver = async (params) => {
    try {
        const response = await httpClient.get(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/driver/${
                params.connSystemDriverId
            }/business-process-template`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
};

export async function getBusinessProcessTemplateData(params) {
    try {
        const response = await httpClient.get(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/business-process-template/${
                params.connSystemBusinessProcessTemplateId
            }`,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function createBusinessProcessTemplate(params) {
    try {
        const response = await httpClient.post(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/driver/${
                params.connSystemDriverId
            }/business-process-template`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateBusinessProcessTemplate(params) {
    try {
        const response = await httpClient.put(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/business-process-template/${
                params.business_process_template_id
            }`,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteBusinessProcessTemplate(params) {
    try {
        const response = await httpClient.delete(
            `${
                import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            }/connected-system/dashboard/business-process-template/${params.id}`,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

// export const getBusinessProcessFlow = async (connSystemBusinessProcessId) => {
//     try {
//         const response = await httpClient.get(
//             `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/connected-system/dashboard/business-process/${connSystemBusinessProcessId}/flow`,
//             {}
//         );
//         return response['data'];
//     } catch (error) {
//         throw new Error(error);
//     }
// };

// export const getBusinessProcesses = async (dashboardCode) => {
//     const business_processes = await import(`./connSystemJson_v2/${dashboardCode}/business_processes.json`);
//     return new Promise((resolve) => {
//         setTimeout(() => resolve(business_processes), 0);
//     });
// };

export const getIntelligenceData = async (dashboardCode) => {
    const intelligence_data = await import(
        `./connSystemJson_v2/${dashboardCode}/intelligence.json`
    );
    return new Promise((resolve) => {
        setTimeout(() => resolve(intelligence_data), 0);
    });
};

export const getInsightsData = async (dashboardCode) => {
    const insights_data = await import(`./connSystemJson_v2/${dashboardCode}/insights.json`);
    return new Promise((resolve) => {
        setTimeout(() => resolve(insights_data), 0);
    });
};

export const getInitiativesData = async (dashboardCode) => {
    const initiatives_data = await import(`./connSystemJson_v2/${dashboardCode}/initiatives.json`);
    return new Promise((resolve) => {
        setTimeout(() => resolve(initiatives_data), 0);
    });
};

export const getSolutionsData = async (dashboardCode) => {
    const solutions_data = await import(`./connSystemJson_v2/${dashboardCode}/solutions.json`);
    return new Promise((resolve) => {
        setTimeout(() => resolve(solutions_data), 0);
    });
};

export const getDriversData = async (dashboardCode) => {
    const drivers_data = await import(`./connSystemJson_v2/${dashboardCode}/drivers.json`);
    return new Promise((resolve) => {
        setTimeout(() => resolve(drivers_data), 0);
    });
};

export const getProcessDetailsData = async (dashboardCode) => {
    const processDetails_data = await import(
        `./connSystemJson_v2/${dashboardCode}/processDetails.json`
    );
    return new Promise((resolve) => {
        setTimeout(() => resolve(processDetails_data), 0);
    });
};

export const getFoundationData = async (dashboardCode) => {
    const foundation_data = await import(`./connSystemJson_v2/${dashboardCode}/foundation.json`);
    return new Promise((resolve) => {
        setTimeout(() => resolve(foundation_data), 0);
    });
};
