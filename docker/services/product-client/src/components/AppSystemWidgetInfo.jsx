import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import appSystemWidgetInfoStyle from 'assets/jss/appSystemWidgetInfoStyle.jsx';
import { getSystemWidgetDocumentation } from 'services/screen.js';
import MarkdownRenderer from './MarkdownRenderer';

import { Dialog, DialogTitle, IconButton, Typography, Grid } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import CodxCircularLoader from './CodxCircularLoader';
class AppSystemWidgetInfo extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            docs: false
        };
    }

    componentDidMount() {
        const { is_info, dataProps = {}, widget_info } = this.props;

        if (dataProps.markdownData) {
            this.setState({
                docs: dataProps.markdownData
            });
        } else if (widget_info && Object.keys(widget_info).length) {
            getSystemWidgetDocumentation({
                md_file_name: is_info
                    ? this.props.widget_info.information_doc
                    : this.props.widget_info.doc,
                callback: this.onResponseGetSystemWidgetDocumentation
            });
        }
    }

    onResponseGetSystemWidgetDocumentation = (response) => {
        // eslint-disable-next-line no-empty
        if (response.status && response.status === 'error') {
        } else {
            this.setState({
                docs: response.data
            });
        }
    };

    hideWidgetInfo = () => {
        const { parent_obj, closeCallback } = this.props;

        parent_obj[closeCallback]();
    };

    renderContent = (classes, isDialog, headerText) => {
        return (
            <>
                {headerText ? (
                    <DialogTitle
                        disableTypography
                        id="widget-documentation"
                        className={classes.widgetInfoTitle}
                    >
                        <Typography variant="h2" className={classes.widgetInfoHeading}>
                            {headerText}
                        </Typography>
                        {isDialog ? (
                            <IconButton
                                title="Close"
                                onClick={() => {
                                    this.hideWidgetInfo();
                                }}
                                className={classes.widgetInfoActionIcon}
                            >
                                <Close fontSize="large" />
                            </IconButton>
                        ) : null}
                    </DialogTitle>
                ) : null}
                <div
                    className={classes.widgetInfoContainer}
                    style={!isDialog ? { overflow: 'visible' } : null}
                >
                    <Grid container spacing={0} className={classes.widgetInfoContainerGrid}>
                        {this.state.docs ? (
                            <MarkdownRenderer markdownContent={this.state.docs}></MarkdownRenderer>
                        ) : (
                            <CodxCircularLoader size={60} center />
                        )}
                    </Grid>
                </div>
            </>
        );
    };

    render() {
        const { classes, isDialog = true } = this.props;
        if (isDialog) {
            const headerText = 'Widget Documentation - ' + this.props.widget_info.name;
            return (
                <Dialog
                    open={true}
                    fullWidth
                    classes={{ paper: classes.widgetInfoPaper }}
                    maxWidth="xl"
                    onClose={() => {
                        this.hideWidgetInfo();
                    }}
                    aria-labelledby="widget-documentaion"
                >
                    {this.renderContent(classes, isDialog, headerText)}
                </Dialog>
            );
        }
        return (
            <div className={classes.markdownWrapper}>
                {this.renderContent(classes, isDialog, this.props.dataProps?.headerText)}
            </div>
        );
    }
}

AppSystemWidgetInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    widget_info: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...appSystemWidgetInfoStyle(theme)
    }),
    { withTheme: true }
)(AppSystemWidgetInfo);
