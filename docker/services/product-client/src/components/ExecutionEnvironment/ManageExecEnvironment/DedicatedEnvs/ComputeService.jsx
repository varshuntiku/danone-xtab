import { Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import ExecutionEnvironmentContext from '../../context/ExecutionEnvironmentContext';
import CustomTextField from 'components/Forms/CustomTextField.jsx';

function ComputeService(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    let cloudProvider, computeType;
    const { createNewEnv } = execEnvContext.data;
    const { select_types } = createNewEnv.envTypes.dedicated_env;
    select_types.forEach((item) => {
        item.id === 1 && (cloudProvider = item);
        item.id === 2 && (computeType = item);
    });

    return (
        <React.Fragment>
            <Typography variant="h4">
                Selected Combination : <b>{`${cloudProvider.defaultSelect} + AKS`}</b>
            </Typography>
            <CustomTextField
                parent_obj={props}
                field_info={{
                    id: computeType.id,
                    is_select: true,
                    fullWidth: true,
                    required: true,
                    error: false,
                    options: [{ value: 'AKS', label: 'AKS' }],
                    value: 'AKS'
                }}
            />
        </React.Fragment>
    );
}

export default ComputeService;
