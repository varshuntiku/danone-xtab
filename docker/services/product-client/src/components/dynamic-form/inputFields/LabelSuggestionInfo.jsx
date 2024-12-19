import { IconButton } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Popover } from '@material-ui/core';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import { ReactComponent as BulbIcon } from '../../../assets/img/BulbInfo.svg';
import Typography from '@material-ui/core/Typography';
import { useRef, useState } from 'react';

const LabelSuggestionInfo = ({ classes, fieldInfo, anchorOrigin, transformOrigin }) => {
    const [infoOpen, setInfoOpen] = useState(false);
    const iconRef = useRef(null);
    const clickHandler = () => {
        setInfoOpen((pre) => !pre);
    };

    return (
        <span className={classes.iconContainer}>
            <IconButton
                className={classes.iconButton}
                size="small"
                aria-label={'nav-info'}
                onClick={clickHandler}
                ref={iconRef}
                data-testid="InfoOutlinedicon"
            >
                <InfoOutlinedIcon fontSize="small" className={classes.infoIcon} />
            </IconButton>
            {iconRef?.current && (
                <Popover
                    open={infoOpen}
                    anchorEl={iconRef?.current}
                    onClose={clickHandler}
                    anchorOrigin={anchorOrigin}
                    transformOrigin={transformOrigin}
                    classes={{ paper: classes.popOverPaper }}
                    className={classes.popOverContainer}
                >
                    {fieldInfo?.infoPopover?.title && (
                        <>
                            <div className={classes.popOverTitleWrapper}>
                                <div className={classes.popOverTitleSet}>
                                    {fieldInfo?.infoPopover?.icon && (
                                        <BulbIcon fontSize="small" className={classes.bulbIcon} />
                                    )}

                                    <Typography className={classes.popOverTitleText}>
                                        {fieldInfo?.infoPopover?.title.length > 0
                                            ? fieldInfo?.infoPopover?.title?.trim()
                                            : 'Info'}
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
                            <Typography className={classes.contentText}>
                                {fieldInfo?.infoPopover?.info}
                            </Typography>
                        </>
                    )}
                </Popover>
            )}
        </span>
    );
};

export default LabelSuggestionInfo;
