import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import { useState } from "react";
import { useCallback } from "react";
import CloseIcon from "src/assets/Icons/CloseBtn";
import ReportProblemIcon from "@material-ui/icons/ReportProblemOutlined";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minWidth: "45rem",
    background: theme.palette.background.paper,
  },
  titleRoot: {
    background: theme.palette.background.paper,
    display: "flex",
    padding: theme.layoutSpacing(20),
    alignItems: "center",
    justifyContent: "space-between",
  },
  colorContrast: {
    color: theme.palette.primary.contrastText,
  },
  colorDefault: {
    color: theme.palette.text.default,
  },
  letterSpacing1: {
    letterSpacing: "0.02em",
  },
  fontSize1: {
    fontSize: theme.layoutSpacing(22),
    fontFamily: theme.title.h1.fontFamily,
  },
  fontSize2: {
    fontSize: "1.6rem",
    fontFamily: theme.body.B5.fontFamily,
  },
  btn: {
    // borderRadius: "5rem",
    // padding: "0.5rem 2.6rem"
  },
  warning: {
    color: "#ff9800",
  },
  dailogContent: {
    paddingTop: theme.layoutSpacing(40),
    padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(40)}`,
  },
  actionsContainer: {
    paddingBottom: theme.layoutSpacing(28),
    paddingRight: theme.layoutSpacing(44),
    paddingTop: theme.layoutSpacing(48),
  },
  sepratorLine: {
    width: `calc(100% - ${theme.layoutSpacing(32)})`,
    marginTop: 0,
    marginBottom: 0,
    opacity: 0.4,
  },
}));

export default function ConfirmPopup({
  title,
  subTitle,
  cancelText,
  hideCancelButton,
  hideConfirmButton,
  confirmText,
  warningMessage,
  disabled,
  enableCloseButton,
  onConfirm,
  onCancel,
  classes: classes2,
  children,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [triggerParams, setTriggerParams] = useState();
  const handleConfirm = (e) => {
    setOpen(false);
    if (onConfirm) {
      onConfirm(e, ...triggerParams);
    }
  };
  const handleCancel = (e) => {
    setOpen(false);
    if (onCancel) {
      onCancel(e, ...triggerParams);
    }
  };

  const triggerConfirm = useCallback(
    (...params) => {
      if (disabled && onConfirm) {
        onConfirm(...params);
      } else {
        setTriggerParams(params);
        setOpen(true);
      }
    },
    [disabled, onConfirm]
  );

  return (
    <>
      {children(triggerConfirm)}
      {disabled ? null : (
        <Dialog
          open={open}
          classes={{
            paper: clsx(classes.dialogPaper, classes2?.dialogPaper),
          }}
          maxWidth="md"
          aria-labelledby={title || "Confirm"}
          aria-describedby="popup-content"
        >
          <DialogTitle
            disableTypography
            className={classes.titleRoot}
            id={title || "Confirm"}
          >
            <Typography
              variant="body1"
              className={clsx(
                classes.title,
                classes2?.title,
                classes.colorDefault,
                classes.fontSize1
              )}
            >
              {title || "Confirm"}
            </Typography>
            {enableCloseButton ? (
              <IconButton
                size="small"
                aria-label="close"
                className={classes.closeButton}
                onClick={() => setOpen(false)}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            ) : null}
          </DialogTitle>
          <hr className={classes.sepratorLine} />
          <DialogContent id="popup-content" className={classes.dailogContent}>
            <Typography
              variant="body1"
              className={clsx(classes.colorDefault, classes.fontSize2)}
            >
              {subTitle}
            </Typography>
            <br />
            <br />
            {warningMessage && (
              <Grid container spacing={1}>
                <ReportProblemIcon
                  fontSize="large"
                  className={classes.warning}
                ></ReportProblemIcon>
                <Typography
                  variant="body1"
                  className={clsx(classes.colorDefault, classes.fontSize2)}
                >
                  {warningMessage}
                </Typography>
                <br />
                <br />
                <br />
              </Grid>
            )}
          </DialogContent>
          <DialogActions className={classes.actionsContainer}>
            {hideCancelButton ? null : (
              <Button
                className={classes.btn}
                variant="outlined"
                size="small"
                onClick={handleCancel}
                aria-label={cancelText || "No"}
              >
                {cancelText || "No"}
              </Button>
            )}
            {hideConfirmButton ? null : (
              <Button
                className={classes.btn}
                variant="contained"
                size="small"
                onClick={handleConfirm}
                aria-label={confirmText || "Yes"}
              >
                {confirmText || "Yes"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

ConfirmPopup.propTypes = {
  title: PropTypes.any,
  subTitle: PropTypes.any,
  cancelText: PropTypes.any,
  hideCancelButton: PropTypes.any,
  hideConfirmButton: PropTypes.any,
  confirmText: PropTypes.any,
  warningMessage: PropTypes.any,
  disabled: PropTypes.any,
  enableCloseButton: PropTypes.any,
  onConfirm: PropTypes.any,
  onCancel: PropTypes.any,
  classes: PropTypes.object,
  children: PropTypes.any,
};
