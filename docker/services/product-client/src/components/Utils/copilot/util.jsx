import { ReactComponent as PostgresIcon } from 'assets/img/postgres-sql-icon.svg';
import { ReactComponent as AzureDatabrickIcon } from 'assets/img/azure-databricks-icon.svg';
import { ReactComponent as MySQLIcon } from 'assets/img/my-sql-icon.svg';
import { ReactComponent as DocumentIcon } from 'assets/img/document-datasource-icon.svg';
import { ReactComponent as BlobStorageIcon } from 'assets/img/azure-blob-storage-icon.svg';
import { ReactComponent as AmazonS3Icon } from 'assets/img/amazon-s3-icon.svg';
import { ReactComponent as SharepointIcon } from 'assets/img/microsoft-sharepoint-icon.svg';
import { ReactComponent as CSVIcon } from 'assets/img/csv-datasource-icon.svg';
import { ReactComponent as PresentationIcon } from 'assets/img/ppt-datasource-icon.svg';
import { ReactComponent as DataMetaDataIcon } from 'assets/img/data-metadata-icon.svg';
import { ReactComponent as MetricsKPIIcon } from 'assets/img/metrics-kpi-icon.svg';
import { ReactComponent as UserPersonaIcon } from 'assets/img/org-user-persona-icon.svg';
import { ReactComponent as BusinessWorkflowIcon } from 'assets/img/business-workflow-icon.svg';

export const DataSourceTypeJSON = [
    {
        label: 'Document',
        value: 'upload',
        icon: <DocumentIcon />
    },
    {
        label: 'Slidemaster PPT',
        value: 'storyboard_slidemaster',
        icon: <PresentationIcon />
    },
    {
        label: 'CSV Upload',
        value: 'csv',
        icon: <CSVIcon />
    },
    {
        label: 'SQL Database',
        value: 'sql',
        options: [
            {
                name: 'PostgresSQL',
                value: 'postgresql',
                icon: <PostgresIcon />
            },
            {
                name: 'Azure Databricks (Native)',
                value: 'azure_databricks',
                icon: <AzureDatabrickIcon />
            },
            {
                name: 'MySQL',
                value: 'mysql',
                icon: <MySQLIcon />
            }
        ]
    },
    {
        label: 'NoSQL Database',
        value: 'no_sql'
    },
    {
        label: 'File Storage',
        value: 'file_storage',
        options: [
            {
                label: 'Azure Blob Storage',
                name: 'azure_blob_storage',
                icon: <BlobStorageIcon />,
                validate: true
            },
            {
                label: 'Amazon S3',
                name: 'amazon_s3',
                icon: <AmazonS3Icon />
            },
            {
                label: 'Microsoft Sharepoint',
                name: 'microsoft_sharepoint',
                icon: <SharepointIcon />
            }
        ]
    }
];

export const getListItemIcon = (item) => {
    const datasource = DataSourceTypeJSON.find((obj) => obj.value === item.type);
    if (item.type === 'sql') {
        // const sqlDatasource = DataSourceTypeJSON.find((obj) => obj.value === 'sql');
        const sqlDbType = datasource.options.find(
            (obj) => obj.value === item.config['database_type']
        );

        return sqlDbType.icon;
    } else if (item.type === 'file_storage') {
        const fileStorageType = datasource.options.find(
            (obj) => obj.name === item.config['file_storage_type']
        );

        return fileStorageType.icon;
    } else {
        return datasource.icon;
    }
};

export const getDatasourceLabel = (item) => {
    const datasourceItem = DataSourceTypeJSON.find((obj) => obj.value === item.type);

    if (item.type === 'storyboard_slidemaster') {
        return '';
    }

    if (item.type === 'sql') {
        let sqlDbType = {};

        sqlDbType = datasourceItem.options.find(
            (obj) => obj.value === item.config['database_type']
        );

        return datasourceItem.label + ' - ' + sqlDbType.name;
    } else if (item.type === 'file_storage') {
        let fileStorageType = {};

        fileStorageType = datasourceItem.options.find(
            (obj) => obj.name === item.config['file_storage_type']
        );

        return datasourceItem.label + ' - ' + fileStorageType.label;
    } else {
        return datasourceItem.label;
    }
};

export const requiredField = <sup> *</sup>;

// export const defaultLLMModelName = 'Openai - GPT 3.5 (16k)';
export const defaultLLMModelName = 'gpt-4-turbo';
export const defaultTTSModelName = 'tts';

export const ContextOnboardTypeJSON = [
    {
        label: 'Data & MetaData',
        value: 'data_metadata',
        icon: <DataMetaDataIcon />,
        guidelineUrls: [
            {
                label: 'Download Template',
                url: `${
                    import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                }/codex-data-static-assets/data_dictionary_template.csv`
            }
        ],
        defaultSourceType: 'csv',
        sourceTypeOptions: [
            {
                label: 'CSV upload',
                value: 'csv',
                accepted_files: ['.csv']
            }
        ]
    },
    {
        label: 'Metrics & KPI',
        value: 'metrics_kpi',
        icon: <MetricsKPIIcon />,
        defaultSourceType: 'upload',
        guidelineUrls: [
            {
                label: 'Download Template',
                url: `${
                    import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                }/codex-data-static-assets/business_document_template.doc`
            }
        ],
        sourceTypeOptions: [
            {
                label: 'Document',
                value: 'upload',
                accepted_files: ['.doc', '.docx', '.pdf', '.txt']
            }
        ]
    },
    {
        label: 'Org & User Persona',
        value: 'org_persona',
        icon: <UserPersonaIcon />,
        disabled: true
    },
    {
        label: 'Business Workflow',
        value: 'business_workflow',
        icon: <BusinessWorkflowIcon />,
        disabled: true
    }
];

export const getContextListItemIcon = (item) => {
    const context = ContextOnboardTypeJSON.find((obj) => obj.value === item.type);
    return context.icon;
};

export const getContextLabel = (type) => {
    const context = ContextOnboardTypeJSON.find((obj) => obj.value === type);
    return context.label;
};

export const getContextTemplate = (item) => {
    const context = ContextOnboardTypeJSON.find((obj) => obj.value === item.type);
    return context.guidelineUrls;
};
