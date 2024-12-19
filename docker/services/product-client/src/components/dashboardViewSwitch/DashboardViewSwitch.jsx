import { FormControlLabel, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import { ReactComponent as AdminUserIcon } from 'assets/img/admin_user.svg';
import { ReactComponent as DefaultUserIcon } from 'assets/img/default_user.svg';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    radioRoot: {
        '& svg': {
            fontSize: '2rem',
            fill: theme.palette.primary.contrastText
        }
    },
    radioLabel: {
        fontSize: '1.6rem'
    },
    userIcon: {
        verticalAlign: 'sub',
        marginLeft: '-0.8rem'
    }
}));

export function DashboardViewSwitch({ value, onChange }) {
    const classes = useStyles();
    return (
        <RadioGroup
            aria-label="dashborad view"
            name="dashboard_view"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ flexDirection: 'row', gap: '1rem' }}
        >
            <FormControlLabel
                classes={{ root: classes.radioRoot, label: classes.radioLabel }}
                value="admin"
                control={<Radio size="large" />}
                label={
                    <>
                        <AdminUserIcon height={20} width={20} className={classes.userIcon} /> Admin
                    </>
                }
            />
            <FormControlLabel
                classes={{ root: classes.radioRoot, label: classes.radioLabel }}
                value="user"
                control={<Radio size="large" />}
                label={
                    <>
                        <DefaultUserIcon height={20} width={20} className={classes.userIcon} /> User
                    </>
                }
            />
        </RadioGroup>
    );
}
