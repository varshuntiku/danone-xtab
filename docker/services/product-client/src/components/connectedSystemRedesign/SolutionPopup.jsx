import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import connectedSystemSolutionsPopupStyle from 'assets/jss/connectedSystemSolutionsPopupStyle';
import { FiberManualRecord, Close } from '@material-ui/icons';
// import Codx_soln_logo from 'assets/img/conn-system-soln-codx.svg';
import Logo from '../Nuclios/assets/logoIcon.svg';
import HorizontalScroll from './HorizontalScroll';
import { Dialog, DialogTitle, IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    ...connectedSystemSolutionsPopupStyle(theme)
}));

const SolutionPopup = (props) => {
    const classes = useStyles();
    const solution = props.popupState;
    const [openPreviewApp, setOpenPreviewApp] = useState(false);
    const popupClose = () => {
        props.setPopupOpen(false);
    };

    const PreviewApp = () => {
        setOpenPreviewApp(true);
    };

    const hidePreviewApp = () => {
        setOpenPreviewApp(false);
    };

    return (
        <div
            style={{ ...props.popupPosition }}
            className={`${classes.popUp} ${
                props.popupOpen ? classes.popUpOpen : classes.popUpClose
            }`}
        >
            <div className={classes.top}>
                <div className={classes.logo}>
                    <img src={Logo} alt="logo" />
                </div>
                <div className={classes.header}>
                    <div className={classes.mainHeading} onClick={PreviewApp}>
                        {solution?.label}
                    </div>
                    <div className={classes.list}>
                        {solution?.sub_headers?.map((val, key) => (
                            <div className={classes.item} key={`header${key}`}>
                                <FiberManualRecord />
                                {val}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={classes.bottom}>
                <HorizontalScroll disableScroll={!props.popupOpen} scrollPopUp={true}>
                    {solution?.popup_info?.kpi_insights?.map((val, key) => (
                        <div className={classes.insight} key={`insight${key}`}>
                            <div className={classes.heading}>{val?.insight}</div>
                            <div className={classes.list}>
                                {val?.insight_sub_headers?.map((header, itemkey) => (
                                    <div className={classes.item} key={`insightheader${itemkey}`}>
                                        <FiberManualRecord />
                                        {header}
                                    </div>
                                ))}
                            </div>
                            <div className={classes.value}>{val?.insight_value}</div>
                        </div>
                    ))}
                </HorizontalScroll>
            </div>
            <div className={classes.closeButton}>
                <Close onClick={popupClose} />
            </div>
            {openPreviewApp && (
                <Dialog
                    open={openPreviewApp}
                    fullWidth
                    maxWidth="xl"
                    onClose={hidePreviewApp}
                    aria-labelledby="solutions-popup"
                >
                    <DialogTitle id="solutions-popup">{props.solutionItem.app_name}</DialogTitle>
                    <IconButton
                        title="Close"
                        onClick={hidePreviewApp}
                        style={{
                            position: 'absolute',
                            top: '4px',
                            right: 0
                        }}
                    >
                        <Close fontSize="large" />
                    </IconButton>
                    <iframe
                        scrolling="no"
                        src={`${window.location.origin}/app/${props.solutionItem.app_id}`}
                        style={{ border: 'none', height: '1000px' }}
                    ></iframe>
                </Dialog>
            )}
        </div>
    );
};

export default SolutionPopup;
