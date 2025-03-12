import React from 'react';
import PropTypes from 'prop-types';
import { Button, withStyles } from '@material-ui/core';
import appWidgetAssumptionsStyle from 'assets/jss/appWidgetAssumptionsStyle.jsx';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import AppWidgetInsights from 'components/AppWidgetInsights.jsx';
import AppWidgetTable from 'components/AppWidgetTable.jsx';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';
import AppWidgetExpandableTable from 'components/app-expandable-table/appWidgetExpandableTable.jsx';
import AppWidgetFlowTable from 'components/AppWidgetFlowTable.jsx';
import { ReactComponent as GantChartIcon } from '../assets/img/gant-chart.svg';
import clsx from 'clsx';

import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import Widget from './WidgetOld';
import { yellow } from '@material-ui/core/colors';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        color: theme.palette.text.default
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h5">{children}</Typography>
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
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

        this.props = props;
        this.state = {
            dialog: false
        };
    }

    onClickDialog = () => {
        this.setState({
            dialog: true
        });
    };

    onCloseDialog = () => {
        this.setState({
            dialog: false
        });
    };

    renderDialog = () => {
        const { classes, params } = this.props;

        var assumption_params = params.assumptions;

        return (
            <Dialog
                onClose={() => this.onCloseDialog()}
                aria-labelledby="customized-dialog-title"
                open={this.state.dialog}
                fullWidth
                maxWidth={'lg'}
            >
                <DialogTitle id="customized-dialog-title">
                    {assumption_params && assumption_params.title
                        ? assumption_params.title
                        : 'Assumptions'}
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={() => this.onCloseDialog()}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <div className={classes.assumptionDialogContent} style={{ maxHeight: '100%' }}>
                        {this.renderAssumptionComponent()}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };
    renderAssumptionComponent() {
        const { params } = this.props;
        let assumption_params = params.assumptions;

        return <Widget data={assumption_params} />;
    }

    triggerIcon = () => {
        const { classes, large, params } = this.props;

        let materialIcon = false;
        let Icon = null;

        switch (params?.assumptions?.trigger_icon) {
            case 'gant-chart':
                Icon = GantChartIcon;
                materialIcon = false;
                break;
            case 'yellow-bulb':
                Icon = (p) => <EmojiObjectsIcon {...p} style={{ fill: yellow[500] }} />;
                materialIcon = true;
                break;
            default:
                Icon = InfoIcon;
                materialIcon = true;
                break;
        }

        return (
            <div>
                {params?.assumptions?.trigger_label ? (
                    <Button
                        className={classes.iconButton}
                        onClick={() => this.onClickDialog()}
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
                    >
                        {params?.assumptions?.trigger_label}{' '}
                    </Button>
                ) : (
                    <Icon
                        fontSize={large ? 'large' : 'default'}
                        className={clsx(
                            large ? classes.assumptionsIconLarge : classes.assumptionsIcon,
                            !materialIcon && classes.customIcon
                        )}
                        color="primary"
                        onClick={() => this.onClickDialog()}
                    />
                )}
            </div>
        );
    };
    render() {
        const { params } = this.props;

        return params && params.assumptions ? [this.triggerIcon(), this.renderDialog()] : '';
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
