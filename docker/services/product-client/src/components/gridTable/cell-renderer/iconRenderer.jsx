import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

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

const IconRenderer = ({ params }) => {
    const classes = useRowStyles();
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
            {Boolean(params?.value?.text) && params?.value?.text}
        </div>
    );
};

export default IconRenderer;
