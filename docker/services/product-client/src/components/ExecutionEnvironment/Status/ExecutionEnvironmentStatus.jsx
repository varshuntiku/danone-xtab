import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Button,
    IconButton
} from '@material-ui/core';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import LinearProgressBar from 'components/LinearProgressBar';
import { ReactComponent as SuccessIcon } from 'assets/img/llm-workbench/success-indicator.svg';
import clsx from 'clsx';
import RefreshIcon from '@material-ui/icons/Refresh';

function ExecutionEnvironmentStatus({
    classes,
    open,
    viewStatus,
    currentExecEnvStatus,
    refreshData,
    statusPercentage,
    showSuccessIcon,
    parentCmpState,
    reFreshStatus,
    isRefreshDisabled
}) {
    const close = () => {
        viewStatus(false, { status: '' });
        refreshData();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                classes={{ paper: classes.statusWindowDialog }}
                aria-labelledby="visualization-execution-env"
                aria-describedby="environment-content"
            >
                <DialogTitle disableTypography id="visualization-execution-env">
                    <Typography variant="h4" className={classes.dialogHeading}>
                        Execution Environment Status
                    </Typography>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                <DialogContent id="environment-content" className={classes.dialogContent}>
                    <div
                        style={{
                            paddingTop: '15rem',
                            paddingLeft: '25rem',
                            paddingRight: '25rem',
                            paddingBottom: '20rem'
                        }}
                    >
                        {showSuccessIcon ? (
                            <SuccessIcon className={classes.execEnvSuccessIcon} />
                        ) : (
                            <CodxCircularLoader style={{ top: '20rem' }} size={40} center />
                        )}
                        <div style={{ flex: 1 }}>
                            <Typography
                                variant="subtitle1"
                                className={clsx(
                                    classes.fontSize1,
                                    classes.fontColor,
                                    classes.currentStatusTxt
                                )}
                            >
                                Current Status : <b>{currentExecEnvStatus}</b>
                                <IconButton
                                    aria-label="Refresh Current Status"
                                    title="Refresh Current Status"
                                    onClick={() =>
                                        reFreshStatus(parentCmpState?.currentSelectedRow?.id)
                                    }
                                    className={classes.refreshIconBtn}
                                    disabled={isRefreshDisabled}
                                >
                                    <RefreshIcon
                                        className={
                                            isRefreshDisabled
                                                ? clsx(classes.refreshIcon, classes.disabledIcon)
                                                : clsx(classes.refreshIcon)
                                        }
                                    />
                                </IconButton>
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                className={clsx(classes.fontSize1, classes.fontColor)}
                            >
                                {!showSuccessIcon
                                    ? 'Creating Execution Environment....'
                                    : 'Execution Environment created.'}
                            </Typography>
                            <LinearProgressBar
                                variant="determinate"
                                value={statusPercentage}
                                className={classes.progressBar}
                            />
                        </div>
                    </div>
                    <div style={{ position: 'absolute', left: '30rem', bottom: '13rem' }}>
                        <Button
                            variant="outlined"
                            className={classes.createNewButton}
                            onClick={close}
                            aria-label="Create New Environment"
                        >
                            Go to Environment List
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default ExecutionEnvironmentStatus;
