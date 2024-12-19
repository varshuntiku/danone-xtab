import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, withStyles } from '@material-ui/core';
import appWidgetAssumptionsStyle from 'assets/jss/appWidgetAssumptionsStyle.jsx';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { ReactComponent as GantChartIcon } from '../assets/img/gant-chart.svg';
import clsx from 'clsx';

// import CloseIcon from '@material-ui/icons/Close';
import CloseIcon from '../assets/Icons/CloseBtn';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import Widget from './Widget';
import { yellow } from '@material-ui/core/colors';
import { Slide } from '@material-ui/core';
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.layoutSpacing(18),
        color: theme.palette.text.default,
        display: 'flex',
        alignItems: 'center',
        '& .MuiTypography-h5': {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(20),
            lineHeight: theme.layoutSpacing(24),
            letterSpacing: theme.layoutSpacing(0.5),
            fontFamily: theme.title.h1.fontFamily
        }
    },
    sepratorLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)',
        marginTop: 0,
        marginBottom: 0
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, ...other } = props;
    return (
        <>
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h5">{children}</Typography>
            </MuiDialogTitle>
            <hr className={classes.sepratorLine} />
        </>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        // padding: theme.spacing(2),
        padding: theme.layoutSpacing(18),
        border: 'none !important'
    }
}))(MuiDialogContent);

// In order to use this component the user has to pass whatever necessary data in the assumption property
// of the json which will be submitted.

/**
 * Depending on the assumption params passed it renders different type of tables and graphs for the data
 * @extends ParentClassNameHereIfAny
 */
class AppWidgetAssumptions extends React.Component {
    constructor(props) {
        super(props);
        this.popOverRef = React.createRef();
        this.props = props;
        this.state = {
            dialog: false,
            popOver: false,
            anchorEl: null,
            active: false
        };
    }

    onClickDialog = (event) => {
        this.popOverRef.current = event.target.getBoundingClientRect();
        //if it's a popover assumption
        const isPopover = this.props.params.assumptions?.assumption_variant == 'popover';
        //if it's lengthy(>300 chars) we need a modal for rendering, else popover will do
        const isLengthy = this.props.params.assumptions?.description?.length > 300;

        //if it's a popover assumption
        if (isPopover && !isLengthy) {
            this.setState({
                popOver: true,
                anchorEl: event.currentTarget,
                dialog: false,
                active: true
            });
        } else if (isPopover && isLengthy) {
            this.setState({
                dialog: true
            });
        }
        //else render a dialog
        else
            this.setState({
                dialog: true
            });
    };

    onCloseDialog = () => {
        const isPopover = this.props.params.assumptions?.assumption_variant == 'popover';
        const isLengthy = this.props.params.assumptions?.description?.length > 300;

        if (isPopover && !isLengthy) {
            this.setState({
                popOver: false,
                anchorEl: null,
                active: false
            });
        } else
            this.setState({
                dialog: false
            });
    };

    renderPopover = () => {
        const { classes, params, isKpi, dataStory } = this.props;
        const paper = !dataStory ? classes.lastElePaperTWo : classes.lastElePaper;
        let assumption_params = params?.assumptions?.data || {};
        const isLastEle = window.innerWidth - this.popOverRef?.current?.right < 200;
        let title = assumption_params?.title;
        let description = assumption_params?.description;
        return (
            <Popover
                open={this.state.popOver}
                anchorEl={this.state.anchorEl}
                onClose={this.onCloseDialog}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: isKpi ? 'center' : 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: isKpi ? 'center' : 'right'
                }}
                classes={{ paper: isKpi ? (isLastEle ? paper : classes.paper) : '' }}
                className={classes.popOverContainer}
            >
                <div className={classes.popOver}>
                    {title && (
                        <div className={classes.popOverTitle}>
                            <Typography className={classes.popOverTitleText}>
                                {title?.length > 0 ? title.trim() : ''}
                            </Typography>
                            <IconButton
                                aria-label="close"
                                className={classes.closeIcon}
                                onClick={() => this.onCloseDialog()}
                            >
                                <CloseIcon className={classes.closeIcon} />
                            </IconButton>
                        </div>
                    )}
                    <hr className={classes.sepratorLine} />
                    <div className={classes.popOverContent}>
                        <Typography
                            className={title ? classes.contentText : classes.contentTextNoTitle}
                        >
                            {description?.length > 0 ? description.trim() : ''}
                        </Typography>
                        {!title && (
                            <IconButton
                                aria-label="close"
                                className={classes.closeIconNoTitle}
                                onClick={() => this.onCloseDialog()}
                            >
                                <CloseIcon className={classes.closeIcon} />
                            </IconButton>
                        )}
                    </div>
                </div>
            </Popover>
        );
    };

    renderDialog = () => {
        const { classes, params } = this.props;
        let assumption_params = params?.assumptions?.data || {};
        const drawer_variant = assumption_params?.assumption_variant;
        const assumption_direction = {
            'right-drawer': 'left',
            'left-drawer': 'right',
            'top-drawer': 'down',
            'bottom-drawer': 'up'
        };

        return (
            <Dialog
                onClose={() => this.onCloseDialog()}
                aria-labelledby="customized-dialog-title"
                open={this.state.dialog}
                TransitionComponent={
                    drawer_variant && drawer_variant !== 'popover' ? Slide : undefined
                }
                TransitionProps={
                    assumption_params?.assumption_variant && drawer_variant !== 'popover'
                        ? {
                              direction: assumption_direction[drawer_variant],
                              timeout: 600
                          }
                        : undefined
                }
                // fullScreen={assumption_params.assumption_fullScreen ? true : false}
                classes={{
                    container: clsx(
                        drawer_variant && drawer_variant !== 'popover'
                            ? classes.DrawerVariant
                            : null,
                        drawer_variant === 'right-drawer'
                            ? classes.rightVariant
                            : drawer_variant === 'left-drawer'
                            ? classes.leftVariant
                            : null
                    ),
                    paper: classes.dialogPaper
                }}
                aria-describedby="customized-dialog-content"
            >
                <DialogTitle id="customized-dialog-title">
                    {assumption_params && assumption_params.title
                        ? assumption_params.title
                        : 'Additional Information'}
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={() => this.onCloseDialog()}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers id="customized-dialog-content">
                    <div className={classes.assumptionDialogContent}>
                        {!assumption_params?.description ? (
                            this.renderAssumptionComponent()
                        ) : (
                            <Typography className={classes.dialogContentText}>
                                {assumption_params?.description?.length > 0
                                    ? assumption_params?.description.trim()
                                    : ''}
                            </Typography>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };
    renderAssumptionComponent() {
        const { params } = this.props;
        let assumption_params = params?.assumptions?.data || {};

        return <Widget data={assumption_params} />;
    }
    getPlacementStyle = (placement) => {
        switch (placement) {
            case 'bottomRight':
                return { position: 'absolute', bottom: 0, right: '10px' };
            case 'topLeft':
                return { position: 'absolute', top: 0, left: '10px' };
            case 'bottomLeft':
                return { position: 'absolute', bottom: 0, left: 0 };
            default:
                return {};
        }
    };

    triggerIcon = () => {
        const { classes, large, params, hideInfoButton } = this.props;
        const placementStyle =
            this.getPlacementStyle(params?.assumptions?.placement) ||
            this.getPlacementStyle('bottomRight');
        let materialIcon = false;
        let Icon = null;

        switch (params?.assumptions?.trigger_icon) {
            case 'gant-chart':
                Icon = GantChartIcon;
                materialIcon = false;
                break;
            case 'yellow-bulb':
                // eslint-disable-next-line react/display-name
                Icon = (p) => <EmojiObjectsIcon {...p} style={{ fill: yellow[500] }} />;
                materialIcon = true;
                break;
            default:
                Icon = InfoOutlinedIcon;
                materialIcon = true;
                break;
        }

        return (
            <div
                className={clsx(classes.iconContainer, this.state.active ? classes.iconActive : '')}
                style={placementStyle}
            >
                {params?.assumptions?.trigger_label ? (
                    <Button
                        className={classes.iconButton}
                        onClick={() => this.onClickDialog(event)}
                        size="small"
                        startIcon={
                            <Icon
                                fontSize="small"
                                className={clsx(
                                    classes.assumptionsIcon,
                                    !materialIcon && classes.customIcon,
                                    classes.iconButtonIcon
                                )}
                            />
                        }
                        aria-label={params?.assumptions?.trigger_label || 'Label'}
                    >
                        {params?.assumptions?.trigger_label}{' '}
                    </Button>
                ) : !hideInfoButton ? (
                    <Icon
                        fontSize={large ? 'large' : 'default'}
                        className={clsx(
                            large ? classes.assumptionsIconLarge : classes.assumptionsIcon,
                            !materialIcon && classes.customIcon
                        )}
                        color="primary"
                        onClick={(event) => this.onClickDialog(event)}
                    />
                ) : null}
            </div>
        );
    };
    render() {
        const { params } = this.props;
        return params && params.assumptions
            ? [this.triggerIcon(), this.renderDialog(), this.renderPopover()]
            : '';
    }
}

AppWidgetAssumptions.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.bool.isRequired])
};

export default withStyles(
    (theme) => ({
        ...appWidgetAssumptionsStyle(theme)
    }),
    { withTheme: true }
)(AppWidgetAssumptions);
