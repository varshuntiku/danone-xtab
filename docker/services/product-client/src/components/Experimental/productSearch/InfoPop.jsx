import { IconButton } from '@material-ui/core';
import { Popover } from '@material-ui/core';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as InsightsBulb } from '../../../assets/img/InsightsBulb.svg';

const InfoPop = ({ classes, insight, anchorEl, infoOpen, setInfoOpen }) => {
    const clickHandler = () => {
        setInfoOpen(false);
    };

    return (
        <span className={classes.iconContainer}>
            {anchorEl && (
                <Popover
                    open={infoOpen}
                    anchorEl={anchorEl}
                    onClose={clickHandler}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    classes={{ paper: classes.popOverPaper }}
                    className={classes.popOverContainer}
                >
                    {insight?.length && (
                        <>
                            <div className={classes.popOverTitleWrapper}>
                                <div className={classes.popOverTitleSet}>
                                    <Typography className={classes.popOverTitleText}>
                                        &nbsp;{' '}
                                        <span className={classes.insightsIconPop}>
                                            <InsightsBulb />
                                        </span>
                                        &nbsp; AI Insight
                                    </Typography>
                                </div>
                                <IconButton
                                    aria-label="close"
                                    className={classes.closeIcon}
                                    onClick={() => clickHandler()}
                                >
                                    <CloseIcon className={classes.closeIcon} />
                                </IconButton>
                            </div>
                            <Typography className={classes.contentText}>{insight}</Typography>
                        </>
                    )}
                </Popover>
            )}
        </span>
    );
};

export default InfoPop;
