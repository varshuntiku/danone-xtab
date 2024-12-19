import React, { useState, useEffect } from 'react';
import {
    TextField,
    Typography,
    Grid,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    ListItemIcon
} from '@material-ui/core';
import SimpleSelect from 'components/dynamic-form/inputFields/select';
import CheckboxesGroup from '../../dynamic-form/inputFields/checkboxgroup.jsx';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import {
    validateConnectionString,
    listStorageFiles,
    listTables,
    listModels
} from '../../../services/minerva_utils.js';
import defaultMinervaAppData from './minervaDefault.json';
import minervaWizardStyle from './minervaWizardStyle';
import clsx from 'clsx';
import FileUpload from '../../dynamic-form/inputFields/fileUpload.jsx';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import RestorePageIcon from '@material-ui/icons/RestorePage';
import CustomCheckbox from 'components/dynamic-form/inputFields/checkbox.jsx';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

export default function MinervaStepperAppDataConfig({
    appData,
    appActions,
    formOptions,
    ...props
}) {
    const classes = minervaWizardStyle();
    const [appDataObj, setAppDataObj] = useState(appData);
    const [storageFilesList, setStorageFilesList] = useState([]);
    const [minervaLlmModels, setMinervaLlmModels] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [minervaEmbeddingModels, setMinervaEmbeddingModels] = useState([]);
    const [loader, setLoader] = useState(false);
    const [validConnectionString, setValidConnectionString] = useState({
        schema_required: true,
        valid_connection_string:
            appData.app_config && appData.app_config[0]?.config?.context?.table_config?.length > 0
                ? true
                : false
    });

    useEffect(() => {
        let temp = { ...appData };
        if (!appData.app_config || appData.app_config.length === 0) {
            temp.app_config = [JSON.parse(JSON.stringify(defaultMinervaAppData.sqlConfig))];
        }
        setAppDataObj(temp);
    }, [appData]);

    useEffect(() => {
        fetchMinervaModels();
        fetchStorageFiles();
    }, []);

    const onHandleFieldChange = (id, value) => {
        let temp = { ...appDataObj };
        if (id === 'context_db_connection_uri') {
            temp.app_config[0].config[id] = value;
            validateConnectionString({
                connectionString: value,
                callback: onResponseValidateConnectionString
            });
        } else if (id === 'context_db_connection_schema') {
            temp.app_config[0].config[id] = value;
            //
            listTables({
                connectionString: appDataObj.app_config[0].config.context_db_connection_uri,
                schema: value,
                callback: onResponseListTables
            });
        } else if (id === 'data_source') {
            if (appData?.app_config && appData?.app_config[0]?.type === value) {
                temp.app_config = appData.app_config;
            } else if (value === 'sql') {
                temp.app_config = [JSON.parse(JSON.stringify(defaultMinervaAppData.sqlConfig))];
            } else if (value === 'index_file') {
                temp.app_config = [
                    JSON.parse(JSON.stringify(defaultMinervaAppData.embeddingFileConfig))
                ];
            } else if (value === 'document_query') {
                temp.app_config = [
                    JSON.parse(JSON.stringify(defaultMinervaAppData.documentConfig))
                ];
            } else if (value === 'csv_file') {
                temp.app_config = [JSON.parse(JSON.stringify(defaultMinervaAppData.csvFile))];
            }
            temp.app_config[0].data_summary = false;
        } else if (id === 'llm_model') {
            temp.app_config[0][id] = value;
        } else if (id === 'index_name') {
            temp.app_config[0].config[id] = value;
        } else if (id === 'embedding_model') {
            temp.app_config[0][id] = value;
        } else if (id == 'vector_embedding_enabled') {
            temp.app_config[0][id] = value;
        } else if (id == 'data_summary') {
            temp.app_config[0][id] = value;
        } else if (id == 'memory') {
            temp.app_config[0][id] = value;
        } else if (id == 'additional_prompt') {
            temp.app_config[0].config[id] = value;
        }

        setAppDataObj(temp);
    };

    const fetchStorageFiles = () => {
        listStorageFiles({
            callback: fetchStorageFilesResponse
        });
    };

    const fetchStorageFilesResponse = (response_data, status = 'success') => {
        if (status !== 'error') {
            let temp = response_data.file_list;
            temp = temp.map((o) => {
                return {
                    label: o,
                    value: o
                };
            });
            setStorageFilesList(temp);
        }
    };

    const fetchMinervaModels = () => {
        setLoader(true);
        listModels({
            callback: fetchMinervaModelsResponse
        });
    };

    const fetchMinervaModelsResponse = (response_data, status = 'success') => {
        setLoader(false);
        if (status !== 'error') {
            let tempLlmModels = response_data.minerva_models.filter((o) => o.type === 'llm');
            let tempEmbeddingModels = response_data.minerva_models.filter(
                (o) => o.type === 'embedding'
            );
            setMinervaLlmModels(tempLlmModels);
            setMinervaEmbeddingModels(tempEmbeddingModels);
        }
    };

    const onResponseValidateConnectionString = (response_data, status = 'success') => {
        if (status !== 'error') {
            setValidConnectionString(response_data);
            if (
                response_data.schema_required === false &&
                response_data.valid_connection_string === true
            ) {
                listTables({
                    connectionString: appDataObj.app_config[0].config.context_db_connection_uri,
                    schema: appDataObj.app_config[0].config.context_db_connection_schema,
                    callback: onResponseListTables
                });
            }
        }
    };

    const onResponseListTables = (response_data, status = 'success') => {
        if (status !== 'error') {
            let temp = { ...appDataObj };
            if (temp.app_config[0].config?.context) {
                temp.app_config[0].config.context.table_config = response_data['table_config'];
            } else {
                temp.app_config[0].config.context = { table_config: response_data['table_config'] };
            }
            setAppDataObj(temp);
        }
    };

    const handleTableSelection = (value) => {
        let temp = { ...appDataObj };
        Object.keys(value).forEach((o) => {
            const tableConfig = temp.app_config[0].config.context.table_config.find(
                (obj) => obj.name == o
            );
            if (tableConfig) {
                tableConfig.enabled = value[o];
            }
        });
        setAppDataObj(temp);
    };

    const getCheckBoxValues = () => {
        let obj = {};
        appDataObj.app_config[0].config.context.table_config.forEach((o) => {
            obj[o['name']] = o.enabled;
        });
        return obj;
    };

    const handleNextClick = () => {
        appActions.updateApp(appDataObj, documents, true);
    };

    const checkFinishDisabled = () => {
        // check llm model
        if (!appDataObj.app_config[0]?.llm_model) {
            return true;
        }
        // check config for each datatype
        if (appDataObj.app_config[0]?.type === 'index_file') {
            return !appDataObj.app_config[0]?.config?.index_name ||
                appDataObj.app_config[0]?.config?.index_name === ''
                ? true
                : false;
        } else if (appDataObj.app_config[0]?.type === 'document_query') {
            return !(
                appDataObj.app_config[0].llm_model && appDataObj.app_config[0].embedding_model
            );
        } else if (appDataObj.app_config[0]?.type === 'sql') {
            return appDataObj.app_config[0].config?.context?.table_config
                ? appDataObj.app_config[0].config?.context?.table_config?.find(
                      (obj) => obj.enabled === true
                  )
                    ? false
                    : true
                : true;
        } else if (appDataObj.app_config[0]?.type === 'csv_file') {
            return false;
        } else {
            // return disabled for other conditions
            return true;
        }
    };

    const handleFileUpload = (data) => {
        setDocuments(data);
    };

    const handleFileDelete = (index) => {
        appDataObj.documents[index].deleted = true;
        setAppDataObj({ ...appDataObj });
    };

    const handleFileRestore = (index) => {
        appDataObj.documents[index].deleted = false;
        setAppDataObj({ ...appDataObj });
    };

    return loader === true ? (
        <CodxCircularLoader center size="90" />
    ) : appDataObj.app_config && appDataObj.app_config.length > 0 ? (
        <React.Fragment>
            <div className={classes.stepperFormContainer}>
                {appDataObj.app_config && appDataObj.app_config[0] ? (
                    <Grid
                        container
                        style={{ height: '100%' }}
                        alignItems="top"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Grid item xs={4}>
                            <Grid
                                container
                                justifyContent="space-between"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h6"
                                        className={clsx(
                                            classes.colorDefault,
                                            classes.fontSize1,
                                            classes.letterSpacing1
                                        )}
                                    >
                                        Data Source *
                                    </Typography>
                                    <SimpleSelect
                                        onChange={(v) => {
                                            onHandleFieldChange('data_source', v);
                                        }}
                                        fieldInfo={{
                                            options: formOptions.dataSourceOptions,
                                            defaultValue: appDataObj.app_config[0].type
                                                ? appDataObj.app_config[0].type
                                                : null,
                                            optionValueKey: 'name',
                                            optionLabelKey: 'label',
                                            variant: 'outlined',
                                            fullWidth: true
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h6"
                                        className={clsx(
                                            classes.colorDefault,
                                            classes.fontSize1,
                                            classes.letterSpacing1
                                        )}
                                    >
                                        LLM Model *
                                    </Typography>
                                    <SimpleSelect
                                        onChange={(v) => {
                                            onHandleFieldChange('llm_model', v);
                                        }}
                                        fieldInfo={{
                                            options: minervaLlmModels,
                                            defaultValue: appDataObj.app_config[0].llm_model
                                                ? appDataObj.app_config[0].llm_model
                                                : null,
                                            optionValueKey: 'id',
                                            optionLabelKey: 'name',
                                            variant: 'outlined',
                                            fullWidth: true
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {(appDataObj.app_config[0].type === 'sql' ||
                                        appDataObj.app_config[0].type === 'csv_file') &&
                                    minervaLlmModels.find(
                                        (el) => el.id == appDataObj.app_config?.[0]?.llm_model
                                    )?.features?.data_summary ? (
                                        <CustomCheckbox
                                            params={{
                                                value: !!appDataObj.app_config?.[0]?.data_summary,
                                                label: 'Enable Data Summary'
                                            }}
                                            onChange={(v) => {
                                                onHandleFieldChange('data_summary', v);
                                            }}
                                        />
                                    ) : null}
                                </Grid>
                                <Grid item xs={12}>
                                    {['sql', 'csv_file', 'document_query'].includes(
                                        appDataObj.app_config[0].type
                                    ) ? (
                                        <CustomCheckbox
                                            params={{
                                                value: !!appDataObj.app_config?.[0]?.memory,
                                                label: 'Conversation Memory and Context (experimental)'
                                            }}
                                            onChange={(v) => {
                                                onHandleFieldChange('memory', v);
                                            }}
                                        />
                                    ) : null}
                                </Grid>
                                {/* Todo: uncomment when additional context feature is ready */}
                                {/* <Grid item xs={12}>
                                    {appDataObj.app_config[0].type === 'sql' ?
                                    <CustomCheckbox params={{
                                            value: !!appDataObj.app_config?.[0]?.vector_embedding_enabled,
                                            label: "Enable vector embedding file for additional context.",
                                        }}
                                        onChange={v => {
                                            onHandleFieldChange('vector_embedding_enabled', v);
                                        }}
                                    /> : null}
                                </Grid> */}
                                {appDataObj.app_config[0].type === 'sql' ||
                                appDataObj.app_config[0].type === 'csv_file' ? (
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h6"
                                            className={clsx(
                                                classes.colorDefault,
                                                classes.fontSize1,
                                                classes.letterSpacing1
                                            )}
                                        >
                                            Additional Context
                                        </Typography>
                                        <TextField
                                            key="additional_prompt"
                                            onChange={(e) => {
                                                onHandleFieldChange(
                                                    'additional_prompt',
                                                    e.target.value
                                                );
                                            }}
                                            id="additional_prompt"
                                            fullWidth={true}
                                            required={true}
                                            multiline
                                            minRows={2}
                                            maxRows={3}
                                            value={
                                                appDataObj.app_config[0].config.additional_prompt
                                            }
                                            classes={{ root: classes.inputRoot }}
                                            InputLabelProps={{
                                                classes: { root: classes.inputLabel }
                                            }}
                                            InputProps={{ classes: { input: classes.input } }}
                                        />
                                    </Grid>
                                ) : null}
                                {appDataObj.app_config[0].type === 'document_query' ||
                                appDataObj.app_config[0].type === 'index_file' ||
                                appDataObj.app_config?.[0]?.vector_embedding_enabled ? (
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h6"
                                            className={clsx(
                                                classes.colorDefault,
                                                classes.fontSize1,
                                                classes.letterSpacing1
                                            )}
                                        >
                                            Embedding Model *
                                        </Typography>
                                        <SimpleSelect
                                            key="embedding"
                                            onChange={(v) => {
                                                onHandleFieldChange('embedding_model', v);
                                            }}
                                            fieldInfo={{
                                                options: minervaEmbeddingModels,
                                                defaultValue: appDataObj.app_config[0]
                                                    ?.embedding_model
                                                    ? appDataObj.app_config[0].embedding_model
                                                    : null,
                                                optionValueKey: 'id',
                                                optionLabelKey: 'name',
                                                variant: 'outlined',
                                                fullWidth: true,
                                                ...(appDataObj?.documents?.length &&
                                                    appDataObj.app_config[0].type ===
                                                        'document_query' && { disabled: true }),
                                                helperText:
                                                    appDataObj?.documents?.length &&
                                                    appDataObj.app_config[0].type ===
                                                        'document_query' ? (
                                                        <span>
                                                            <ReportProblemOutlinedIcon fontSize="small" />{' '}
                                                            {
                                                                "Can't be modified because there are some existing documents embedded with current model."
                                                            }
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )
                                            }}
                                        />
                                    </Grid>
                                ) : null}
                            </Grid>
                        </Grid>
                        <div className={classes.separator}></div>
                        <Grid item xs={7}>
                            <Grid container spacing={2}>
                                {appDataObj.app_config[0].type === 'sql' ? (
                                    <React.Fragment>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h6"
                                                className={clsx(
                                                    classes.colorDefault,
                                                    classes.fontSize1,
                                                    classes.letterSpacing1
                                                )}
                                            >
                                                Database Connection String
                                            </Typography>
                                            <TextField
                                                key="context_db_connection_uri"
                                                onChange={(e) => {
                                                    onHandleFieldChange(
                                                        'context_db_connection_uri',
                                                        e.target.value
                                                    );
                                                }}
                                                id="context_db_connection_uri"
                                                fullWidth={true}
                                                required={true}
                                                value={
                                                    appDataObj.app_config[0].config
                                                        .context_db_connection_uri
                                                }
                                                error={
                                                    !validConnectionString.valid_connection_string
                                                }
                                                helperText={
                                                    validConnectionString.valid_connection_string
                                                        ? ''
                                                        : 'Invalid Connection String'
                                                }
                                                classes={{ root: classes.inputRoot }}
                                                InputLabelProps={{
                                                    classes: { root: classes.inputLabel }
                                                }}
                                                InputProps={{ classes: { input: classes.input } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h6"
                                                className={clsx(
                                                    classes.colorDefault,
                                                    classes.fontSize1,
                                                    classes.letterSpacing1
                                                )}
                                            >
                                                Database Schema (If applicable)
                                            </Typography>
                                            <TextField
                                                key="context_db_connection_schema"
                                                onChange={(e) => {
                                                    onHandleFieldChange(
                                                        'context_db_connection_schema',
                                                        e.target.value
                                                    );
                                                }}
                                                id="context_db_connection_schema"
                                                fullWidth={true}
                                                required={false}
                                                value={
                                                    appDataObj.app_config[0].config
                                                        .context_db_connection_schema
                                                }
                                                classes={{ root: classes.inputRoot }}
                                                InputLabelProps={{
                                                    classes: { root: classes.inputLabel }
                                                }}
                                                InputProps={{ classes: { input: classes.input } }}
                                            />
                                        </Grid>
                                        {appDataObj.app_config[0].config?.context?.table_config
                                            ?.length > 0 && (
                                            <Grid item xs={12}>
                                                <Typography
                                                    variant="h6"
                                                    className={clsx(
                                                        classes.colorDefault,
                                                        classes.fontSize1,
                                                        classes.letterSpacing1
                                                    )}
                                                >
                                                    Choose the SQL tables to be configured on Ask
                                                    NucliOS
                                                </Typography>
                                                <div style={{ height: '12vh', overflow: 'auto' }}>
                                                    <CheckboxesGroup
                                                        onChange={(v) => handleTableSelection(v)}
                                                        params={{
                                                            value: getCheckBoxValues(),
                                                            multiple: true,
                                                            helperText:
                                                                appDataObj.app_config[0].config
                                                                    ?.context?.table_config
                                                                    ?.length === 0
                                                                    ? 'Please configure a valid SQL database before proceeding to this step.'
                                                                    : '',
                                                            options:
                                                                appDataObj.app_config[0].config.context.table_config.map(
                                                                    (o) => {
                                                                        return {
                                                                            label: o.alias,
                                                                            name: o.name
                                                                        };
                                                                    }
                                                                )
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        )}
                                    </React.Fragment>
                                ) : null}
                                {appDataObj.app_config[0].type === 'document_query' ||
                                appDataObj.app_config[0].type === 'csv_file' ||
                                appDataObj.app_config?.[0]?.vector_embedding_enabled ? (
                                    <React.Fragment>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h6"
                                                className={clsx(
                                                    classes.colorDefault,
                                                    classes.fontSize1,
                                                    classes.letterSpacing1
                                                )}
                                            >
                                                {appDataObj.app_config[0].type === 'csv_file'
                                                    ? 'Upload Source Document'
                                                    : 'Upload Source Documents'}
                                            </Typography>
                                            <FileUpload
                                                onChange={handleFileUpload}
                                                fieldInfo={{
                                                    preventAutoUpload: true,
                                                    multiple:
                                                        appDataObj.app_config[0].type != 'csv_file',
                                                    label:
                                                        appDataObj.app_config[0].type === 'csv_file'
                                                            ? 'Select Document'
                                                            : 'Select Documents',
                                                    variant: 'outlined',
                                                    inputprops:
                                                        appDataObj.app_config[0].type === 'csv_file'
                                                            ? { accept: '.csv' }
                                                            : {
                                                                  accept: '.doc, .txt, .pdf, .pptx, .docx'
                                                              }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography
                                                variant="h6"
                                                className={clsx(
                                                    classes.colorDefault,
                                                    classes.fontSize1,
                                                    classes.letterSpacing1
                                                )}
                                            >
                                                Existing Documents
                                            </Typography>
                                            <List className={classes.documentList}>
                                                {appDataObj?.documents?.map((doc, i) => (
                                                    <ListItem
                                                        key={doc.url}
                                                        className={
                                                            doc.deleted ? classes.deletedDoc : ''
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <FolderIcon fontSize="large" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={doc.name}
                                                            secondary={doc.deleted ? 'Deleted' : ''}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            {doc.deleted ? (
                                                                <IconButton
                                                                    edge="end"
                                                                    size="medium"
                                                                    title="restore"
                                                                    aria-label="restore"
                                                                    onClick={() =>
                                                                        handleFileRestore(i)
                                                                    }
                                                                >
                                                                    <RestorePageIcon fontSize="large" />
                                                                </IconButton>
                                                            ) : (
                                                                <IconButton
                                                                    edge="end"
                                                                    size="medium"
                                                                    title="delete"
                                                                    aria-label="delete"
                                                                    onClick={() =>
                                                                        handleFileDelete(i)
                                                                    }
                                                                >
                                                                    <DeleteIcon fontSize="large" />
                                                                </IconButton>
                                                            )}
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Grid>
                                    </React.Fragment>
                                ) : null}
                                {appDataObj.app_config[0].type === 'index_file' ? (
                                    <React.Fragment>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h6"
                                                className={clsx(
                                                    classes.colorDefault,
                                                    classes.fontSize1,
                                                    classes.letterSpacing1
                                                )}
                                            >
                                                Embedding File
                                            </Typography>
                                            <SimpleSelect
                                                onChange={(v) => {
                                                    onHandleFieldChange('index_name', v);
                                                }}
                                                fieldInfo={{
                                                    options: storageFilesList,
                                                    defaultValue: appDataObj.app_config[0]?.config
                                                        ?.index_name
                                                        ? appDataObj.app_config[0]?.config
                                                              ?.index_name
                                                        : null,
                                                    optionValueKey: 'value',
                                                    optionLabelKey: 'label',
                                                    variant: 'outlined',
                                                    style: { width: '30rem' }
                                                }}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                ) : null}
                            </Grid>
                        </Grid>
                    </Grid>
                ) : (
                    <CodxCircularLoader center size="45" />
                )}
            </div>
            <div
                aria-label="sub section header"
                style={{
                    display: 'flex',
                    padding: '2rem 6rem 2rem 2rem',
                    justifyContent: 'flex-end',
                    position: 'relative'
                }}
            >
                <Button
                    key="previous"
                    variant="contained"
                    size="small"
                    className={classes.button}
                    onClick={props.handlePrevious}
                    aria-label="Previous"
                >
                    Previous
                </Button>
                <Button
                    key="Finish"
                    variant="contained"
                    size="small"
                    className={classes.button}
                    disabled={checkFinishDisabled()}
                    onClick={handleNextClick}
                    aria-label="Finish"
                >
                    Finish
                </Button>{' '}
            </div>
        </React.Fragment>
    ) : (
        <React.Fragment></React.Fragment>
    );
}
