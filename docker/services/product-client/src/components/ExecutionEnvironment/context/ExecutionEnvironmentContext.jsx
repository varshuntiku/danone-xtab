import React, { createContext, useState } from 'react';
import { packageErrors } from 'constants/execution-workbench';
import { execEnvInitialContextData } from 'constants/execution-workbench';
import { getVerifyPackages } from 'services/execution_environments_utils';

const ExecutionEnvironmentContext = createContext();

export const ExecutionEnvironmentContextProvider = ({ children }) => {
    const [data, setData] = useState(execEnvInitialContextData);
    const updateContext = (newData) => {
        setData((prevState) => ({
            ...prevState,
            ...newData
        }));
    };

    const buildErrorMessage = (resData, packages) => {
        let updatedPackges = [];
        let errorPackages = [];
        const errors = resData.response.data.errors || [];
        packages.forEach((item) => {
            errors.forEach((err) => {
                let errorPackObj = {};

                if (err.package === item.name) {
                    errorPackObj['name'] = err.package;
                    errorPackObj['error'] = err.error;
                    errorPackObj['message'] = err.message;
                    item.error = err.error;
                    item.message = err.message;
                    if (err[packageErrors[err.error]]) {
                        item[packageErrors[err.error]] = err[packageErrors[err.error]];
                        errorPackObj['compatibleVersion'] = err[packageErrors[err.error]].map(
                            (cmpVersion) => {
                                return {
                                    value: cmpVersion,
                                    label: cmpVersion
                                };
                            }
                        );
                        errorPackObj['versionValue'] = err[packageErrors[err.error]][0];
                    }
                    errorPackages.push(errorPackObj);
                }
            });
            updatedPackges.push(item);
        });
        setData((prevState) => ({
            ...prevState,
            packageLists: updatedPackges,
            errorPackages
        }));
        {
            data.newEnvName &&
                setData((prevState) => ({
                    ...prevState,
                    details: {
                        ...data.details,
                        name: data.newEnvName
                    }
                }));
        }
    };

    const verifyPackages = (packageLists) => {
        let payload = {
            packages: packageLists
        };
        getVerifyPackages({
            payload,
            packageLists,
            callback: onResponseGetVerifyPackages
        });
    };

    const onResponseGetVerifyPackages = (response_data, status = 'success', updatedPackges) => {
        if (status === 'error') {
            buildErrorMessage(response_data, updatedPackges);
            setData((prevState) => ({
                ...prevState,
                createEnvIsLoading: false,
                disableCreateExecEnvBtn: false,
                isListLoading: false,
                showBulkEditCmp: true,
                packageError: true,
                verifyPackagesLoadMask: false
            }));
        } else {
            setData((prevState) => ({
                ...prevState,
                showBulkEditCmp: false,
                packageError: false,
                verifyPackagesLoadMask: false,
                snackbar: {
                    open: true,
                    message: 'Package Verification is Completed',
                    severity: 'success'
                }
            }));
        }
    };

    return (
        <ExecutionEnvironmentContext.Provider
            value={{ data, updateContext, verifyPackages, buildErrorMessage }}
        >
            {children}
        </ExecutionEnvironmentContext.Provider>
    );
};

export default ExecutionEnvironmentContext;
