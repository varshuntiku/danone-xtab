import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
import ExecutionEnvironmentContext from '../../context/ExecutionEnvironmentContext';
import CustomTextField from 'components/Forms/CustomTextField.jsx';

function Sku(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { updateContext } = execEnvContext;
    let cloudProvider, computeType;
    const { createNewEnv } = execEnvContext.data;
    const { envTypes } = createNewEnv;
    const { select_types, sku } = envTypes.dedicated_env;
    select_types.forEach((item) => {
        item.id === 1 && (cloudProvider = item);
        item.id === 2 && (computeType = item);
    });

    const onSkuFieldChange = (value) => {
        let compute_id = sku.list.filter((item) => {
            return item.value === value;
        });
        compute_id.length > 0 && (compute_id = compute_id[0].compute_id);
        updateContext({
            createNewEnv: {
                ...createNewEnv,
                envTypes: {
                    ...envTypes,
                    dedicated_env: {
                        ...envTypes.dedicated_env,
                        sku: {
                            ...sku,
                            defaultValue: value,
                            compute_id
                        }
                    }
                }
            }
        });
    };
    return (
        <React.Fragment>
            <Typography variant="h4">
                Selected Combination :{' '}
                <b>{`${cloudProvider.defaultSelect} + AKS + ${sku.defaultValue}`}</b>
            </Typography>
            <CustomTextField
                parent_obj={props}
                field_info={{
                    id: computeType.id,
                    is_select: true,
                    fullWidth: true,
                    required: true,
                    error: false,
                    onChange: onSkuFieldChange,
                    options: sku.list,
                    value: sku.defaultValue
                }}
            />
            <Typography variant="h5">
                <b>{`2gb Ram, 2.6 GHz CPU, 1gb GPU`}</b>
            </Typography>
        </React.Fragment>
    );
}

export default Sku;
