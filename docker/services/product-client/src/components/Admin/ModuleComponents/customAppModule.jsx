import React from 'react';
import { Typography, Switch, Paper } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import DescriptionIcon from '@material-ui/icons/Description';
import FilterListIcon from '@material-ui/icons/FilterList';
import CustomFlipComponent from '../../customFlipComponent/CustomFlipComponent';
import RepeatRoundedIcon from '@material-ui/icons/RepeatRounded';
import { IconButton } from '@material-ui/core';
import DynamicForm from '../../dynamic-form/dynamic-form';

export function CustomAppModule({
    module,
    handleChange,
    classes,
    module_header,
    module_backside_config
}) {
    const ref = React.useRef(null);

    const getModuleIcon = (module_header) => {
        module_header = module_header.toLowerCase();
        switch (module_header) {
            case 'dashboard':
                return <DashboardIcon fontSize="large" className={classes.moduleItemLogo} />;
            case 'alert':
                return (
                    <NotificationImportantIcon
                        fontSize="large"
                        className={classes.moduleItemLogo}
                    />
                );
            case 'datastory':
                return <DescriptionIcon fontSize="large" className={classes.moduleItemLogo} />;
            case 'fullscreen mode':
                return <FullscreenIcon fontSize="large" className={classes.moduleItemLogo} />;
            case 'retain filters':
                return <FilterListIcon fontSize="large" className={classes.moduleItemLogo} />;
            default:
                return <DescriptionIcon fontSize="large" className={classes.moduleItemLogo} />;
        }
    };

    const getFrontComponent = () => {
        return (
            <Paper className={classes.moduleHeader}>
                <div>
                    <Switch
                        id="switch"
                        checked={module}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <IconButton size="small" title="Flip" onClick={() => ref.current.flip()}>
                        <RepeatRoundedIcon style={{ fontSize: '2rem' }} />
                    </IconButton>
                </div>
                <div>
                    {getModuleIcon(module_header)}
                    <Typography variant="h5" className={classes.moduleItemTitle}>
                        {module_header}
                    </Typography>
                </div>
                <div>
                    {module ? (
                        <div className={classes.moduleItemEnabledContainer}>ENABLED</div>
                    ) : (
                        ''
                    )}
                </div>
            </Paper>
        );
    };

    const getBackComponent = () => {
        return (
            <Paper className={classes.moduleHeader}>
                <div>
                    <IconButton size="small" title="Flip" onClick={() => ref.current.flip()}>
                        <RepeatRoundedIcon style={{ fontSize: '2rem' }} />
                    </IconButton>
                </div>
                <div className={classes.moduleDescription}>
                    <DynamicForm params={module_backside_config?.form_info?.form_config} />
                </div>
            </Paper>
        );
    };

    return (
        <div className={classes.appModuleItem}>
            <CustomFlipComponent
                ref={ref}
                frontComp={getFrontComponent()}
                backComp={getBackComponent()}
            />
        </div>
    );
}
