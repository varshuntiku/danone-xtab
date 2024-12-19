export const cloudProviders = Object.freeze([
    {
        label: 'Azure',
        value: 1,
        is_active: true
    },
    {
        label: 'AWS',
        value: 2,
        is_active: false
    }
]).filter((x) => x.is_active);

export const infrastructures = Object.freeze([
    {
        label: 'App Service',
        value: 'app',
        cloud_provider_id: 1,
        is_active: false
    },
    {
        label: 'Kubernetes Service',
        value: 'k8',
        cloud_provider_id: 1,
        is_active: true
    },
    {
        label: 'Container Instance',
        value: 'container',
        cloud_provider_id: 1,
        is_active: false
    },
    {
        label: 'Virtual Machine',
        value: 'vm',
        cloud_provider_id: 1,
        is_active: false
    }
]);

export const hostingTypes = Object.freeze([
    {
        label: 'Dedicated Compute',
        value: 'dedicated'
    },
    {
        label: 'Shared Compute',
        value: 'shared'
    }
]);

export const sku = Object.freeze([
    {
        label: 'A100',
        value: 1
    },
    {
        label: 'T4',
        value: 2
    }
]);

export const envTypes = [
    {
        label: 'Default',
        value: 'default'
    },
    {
        label: 'Custom',
        value: 'custom'
    }
];

export const runTimes = Object.freeze([
    {
        label: 'Python',
        value: 'python'
    },
    {
        label: 'Rust',
        value: 'rust'
    }
]);

export const runTimeVersions = Object.freeze([
    {
        label: '3.10',
        value: '3.10',
        run_time: 'python'
    },
    {
        label: '3.9',
        value: '3.9',
        run_time: 'python'
    }
]);

export const packageListPayload = {
    name: '',
    cloud_provider_id: 1,
    infra_type: 'k8',
    hosting_type: 'shared',
    env_type: 'custom',
    run_time: 'python',
    run_time_version: '3.10',
    // replicas: 1,
    packages: []
};

export const packageErrors = {
    not_compatible: 'compatible_versions',
    not_compatibleText: 'Not Compatible',
    not_allowedText: 'Not Allowed',
    not_foundText: 'Not Found',
    compatible_versionsText: 'Compatible Versions'
};

export const proressStatusPercentage = {
    failed: 0,
    'initialized update': 10,
    initialized: 10,
    initializing: 10,
    'generating artifact': 50,
    'creating nodepool': 40,
    inprogress: 60,
    'creating environment': 80,
    running: 100
};

export const progressStatusText = [
    'creating environment',
    'generating artifact',
    'initialized',
    'initializing',
    'initialized update',
    'creating nodepool',
    'inprogress'
];

export const statusText = {
    'creating environment': 'In Progress',
    initialized: 'In Progress',
    initializing: 'In Progress',
    'initialized update': 'In Progress',
    'generating artifact': 'In Progress',
    inprogress: 'In Progress',
    failed: 'Failed',
    running: 'Running'
};

export const execEnvTitle = 'Execution Environments';

export const execEnvInitialContextData = {
    envWinTitle: '', // title for the window for create and update env windows.
    error_in_name: false,
    showEditWin: false,
    showBrowseEnv: false,
    isListLoading: true, // before fetching the packae list showing load mask, once we get the response if it failed or updated we are seting false.
    mainExecEnvLoading: true, // main flag for exe env module.
    mainExecEnvLoadMask: 'Fetching Environments',
    loadMaskMsg: 'Loading...',
    packageLists: [],
    errorPackages: [],
    showCreateNewEnv: false,
    createEnvIsLoading: true,
    disableCreateExecEnvBtn: true,
    disableExitExecEnvBtn: false,
    packageListForEditor: '',
    showBulkEditCmp: false,
    execEnvWinMessage: '',
    newEnvName: '',
    execEnvName: '',
    isAddNewPack: false,
    disableExecEnvName: false,
    showPackUpdateWin: false,
    packages: [],
    dynamicExecEnvs: [],
    ds_project_id: false,
    disableCreateNewBtn: false,
    details: {
        name: ''
    },
    packageList: {
        id: '',
        name: '',
        version: ''
    },
    dynamicExecEnv: {
        id: '',
        packages: []
    },
    snackbar: {
        open: false
    },
    packageError: false,
    verifyPackagesLoadMask: false,
    createNewEnv: {
        envPackageLists: [], // storing all the pcakages when we create new env.
        activeStep: 0,
        envTypes: {
            currentEnv: 'shared_env',
            shared_env: {
                execEnvWinMessage: '',
                disableCreateEnvBtn: true,
                packageError: false,
                execEnvFieldMsg: '',
                value: 'shared_env',
                label: 'Shared',
                envName: '',
                replicas: '1',
                runTime: 'Python',
                runTimeVersion: '3.10',
                indexUrl: ''
            },
            dedicated_env: {
                execEnvWinMessage: '',
                disableCreateEnvBtn: true,
                packageError: false,
                execEnvFieldMsg: '',
                value: 'dedicated_env',
                label: 'Dedicated',
                envName: '',
                replicas: '1',
                runTime: 'Python',
                runTimeVersion: '3.10',
                indexUrl: '',
                dedicatedEnvSteps: [
                    {
                        activeStep: 0,
                        title: 'Select Type',
                        name: '1',
                        stepStatus: false
                    },
                    {
                        activeStep: 1,
                        title: 'Select Service',
                        name: '2',
                        stepStatus: false
                    },
                    {
                        activeStep: 2,
                        title: 'SKU',
                        name: '3',
                        stepStatus: false
                    }
                ],
                select_types: [
                    {
                        id: 1,
                        title: 'Cloud Provider',
                        defaultSelect: 'Azure',
                        radioOptions: [
                            {
                                value: 'Azure',
                                label: 'Azure',
                                disabled: false
                            },
                            {
                                value: 'AWS',
                                label: 'AWS',
                                disabled: true
                            },
                            {
                                value: 'GCP',
                                label: 'GCP',
                                disabled: true
                            }
                        ]
                    },
                    {
                        id: 2,
                        title: 'Compute Type',
                        defaultSelect: 'CPU',
                        radioOptions: [
                            {
                                value: 'CPU',
                                label: 'CPU',
                                disabled: false
                            },
                            {
                                value: 'GPU',
                                label: 'GPU',
                                disabled: true
                            }
                        ]
                    }
                ],
                sku: {
                    defaultValue: '',
                    list: []
                }
            },
            all_env: {
                value: 'all_env',
                label: 'All'
            }
        }
    },
    browseEnv: {
        defaultEnv: {
            id: null,
            packages: [],
            name: '',
            replicas: '',
            runTime: '',
            runTimeVersion: '',
            indexUrl: ''
        },
        envTypes: {
            currentEnv: 'shared_env',
            shared_env: {
                cloneConfig: false,
                disableCreateEnvBtn: true,
                value: 'shared_env',
                label: 'Shared',
                envName: 'Shared-env-1',
                replicas: '1',
                runTime: 'Python',
                runTimeVersion: '3.10',
                name: '',
                indexUrl: ''
            },
            dedicated_env: {
                cloneConfig: false,
                disableCreateEnvBtn: true,
                value: 'dedicated_env',
                label: 'Dedicated',
                envName: 'Dedicated env-1',
                replicas: '1',
                runTime: 'Python',
                runTimeVersion: '3.10',
                name: '',
                indexUrl: ''
            },
            all_env: {
                value: 'all_env',
                label: 'All',
                envName: 'All env-1',
                replicas: '1',
                runTime: 'Python',
                runTimeVersion: '3.10',
                indexUrl: ''
            }
        }
    }
};
