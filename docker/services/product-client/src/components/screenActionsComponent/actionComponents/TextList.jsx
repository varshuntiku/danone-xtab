import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { triggerActionHandler } from '../../../services/screen';
import clsx from 'clsx';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    text: {
        color: theme.palette.text.revamp,
        fontSize: theme.layoutSpacing(14),
        fontWeight: '500',
        letterSpacing: theme.layoutSpacing(0.35),
        fontFamily: theme.body.B1.fontFamily,
        textTransform: 'capitalize',
        lineHeight: 'normal'
    },
    color_contrast: {
        color: theme.palette.primary.contrastText
    },
    color_error: {
        color: red[500]
    }
}));

export function TextList({ screen_id, app_id, params, action_type }) {
    const classes = useStyles();
    const [data, setData] = React.useState(params || []);

    React.useEffect(() => {
        if (params.fetch_on_load) {
            triggerActionHandler({
                screen_id,
                app_id,
                payload: {
                    action_type,
                    params: null,
                    filter_state: JSON.parse(
                        sessionStorage.getItem('app_screen_filter_info_' + app_id + '_' + screen_id)
                    )
                },
                callback: (d) => {
                    setData(d);
                }
            });
        }
    }, [action_type, app_id, params.fetch_on_load, screen_id]);

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            flexDirection={data?.direction || 'row'}
            gridGap={data?.gap || '0.7rem'}
            alignItems={data?.alignItems}
        >
            {data?.list?.map((el, i) => (
                <Typography
                    key={i}
                    variant="body1"
                    style={el.style}
                    className={clsx({
                        [classes.text]: true,
                        [classes.color_contrast]: el.color === 'contrast',
                        [classes.color_error]: el.color === 'error'
                    })}
                >
                    {el.text}
                </Typography>
            ))}
        </Box>
    );
}
