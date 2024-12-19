import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextInput from '../dynamic-form/inputFields/textInput';

const useRowStyles = makeStyles(() => ({
    iconRenderWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    iconStyles: {
        width: '3rem',
        height: '3rem',
        objectFit: 'contain',
        borderRadius: '50%',
        marginRight: '2rem'
    }
}));

const IconEditor = (props) => {
    const { params, handleValueChange, handleActiveEdit } = props;
    const classes = useRowStyles();

    const handleInput = (val) => {
        handleValueChange({ ...params?.value, text: val });
    };

    return (
        <div className={classes.iconRenderWrapper}>
            {Boolean(params?.value?.url) && (
                <img
                    src={params?.value?.url || ''}
                    className={classes.iconStyles}
                    style={{
                        width: params?.iconWidth || undefined,
                        height: params?.iconWidth || undefined
                    }}
                    alt={params?.value?.text || ''}
                />
            )}
            {Boolean(params?.value?.text) && (
                <TextInput
                    onChange={handleInput}
                    fieldInfo={{ value: params?.value?.text || '' }}
                    onBlur={handleActiveEdit.bind(null, false)}
                />
            )}
        </div>
    );
};

export default IconEditor;
