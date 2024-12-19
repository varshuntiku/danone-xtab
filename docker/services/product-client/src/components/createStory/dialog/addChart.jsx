import React, { Fragment } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import VisualContents from '../visualContent';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    iconBtn: {
        opacity: 0.5,
        transition: '0.3s',
        '&:hover': {
            opacity: 1
        }
    },
    title: {
        fontSize: '20px',
        fontWeight: 500
    },
    metaData: {
        color: theme.palette.text.titleText,
        display: 'flex',
        padding: theme.spacing(1, 1, 1, 1),
        alignItems: 'center',
        fontSize: theme.spacing(2)
    },
    metaDataContainer: {
        marginRight: theme.spacing(1)
    },
    metaDataValue: {
        fontWeight: 'bold'
    },
    gridTableBody: {
        width: '100%',
        // height: theme.spacing(66),
        height: '100%'
        // overflowY: 'auto'
    },
    customCheckbox: {
        transform: 'scale(2)'
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h4">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        color: '#fff',
        maxHeight: '531px'
        // width:'600px'
    }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1)
    }
}))(MuiDialogActions);

export default function AddCharts({ selectedGraph, onGraphDataChange, nameFlag, ...props }) {
    const [open, setOpen] = React.useState(false);
    const [graphdata] = React.useState(selectedGraph);
    const [selectedgraphdata, setSelectedGraphData] = React.useState({});
    const [graphIndex, setGraphIndex] = React.useState(-1);
    const classes = makeStyles(styles)();
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleCheckBoxChange = (e, item, index) => {
        setGraphIndex(index);
        setSelectedGraphData(item);
    };

    const handleDone = () => {
        onGraphDataChange(selectedgraphdata);
        setOpen(false);
    };

    const renderChartMetaData = (contentInfo) => {
        if (contentInfo.metadata) {
            return Object.keys(contentInfo.metadata).map((keyName, i) => (
                <Grid key={i} item xs={12} className={classes.metaData}>
                    <div>
                        <span>
                            <Typography variant="inherit">{keyName + ' : '}</Typography>
                        </span>
                        <span className={classes.metaDataValue}>
                            <Typography variant="inherit">
                                {Array.isArray(contentInfo.metadata[keyName])
                                    ? contentInfo.metadata[keyName].join(', ')
                                    : typeof contentInfo.metadata[keyName] === 'string'
                                    ? contentInfo.metadata[keyName]
                                    : JSON.stringify(contentInfo.metadata[keyName])}
                            </Typography>
                        </span>
                    </div>
                </Grid>
            ));
        } else return '';
    };
    return (
        <Fragment>
            {nameFlag ? (
                <Button {...props} onClick={handleClickOpen} aria-label="Selected Item">
                    Selected Item(s)
                </Button>
            ) : (
                <IconButton
                    aria-label="add"
                    {...props}
                    onClick={handleClickOpen}
                    className={classes.iconBtn}
                >
                    <PlaylistAddIcon fontSize="large" />
                </IconButton>
            )}
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth={'md'}
                aria-describedby="chart-dialog-content"
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {nameFlag ? 'Selected Item(s)' : 'Add Charts'}
                </DialogTitle>
                <DialogContent dividers id="chart-dialog-content">
                    <Grid container direction="row">
                        {Object.values(graphdata)
                            ? Object.values(graphdata).map((item, index) => (
                                  <Grid key={index} item xs={12} style={{ marginBottom: '8px' }}>
                                      <Grid container direction="row">
                                          <Grid item xs={12}>
                                              <Typography
                                                  variant="h5"
                                                  className={classes.title}
                                                  gutterBottom
                                              >
                                                  {nameFlag ? (
                                                      ''
                                                  ) : (
                                                      <Checkbox
                                                          checked={index === graphIndex}
                                                          className={classes.customCheckbox}
                                                          color="primary"
                                                          size="medium"
                                                          onChange={(e) =>
                                                              handleCheckBoxChange(e, item, index)
                                                          }
                                                          inputProps={
                                                              {
                                                                  //   'aria-label': 'secondary checkbox'
                                                              }
                                                          }
                                                          aria-label="secondary checkbox"
                                                      />
                                                  )}
                                                  {index + 1}. {item.name}
                                              </Typography>
                                          </Grid>
                                          {renderChartMetaData(item)}
                                          <Grid item xs={1}></Grid>
                                          <Grid item xs={8}>
                                              <VisualContents item={item} />
                                          </Grid>
                                          <Grid item xs={3}></Grid>
                                      </Grid>
                                      <Divider
                                          style={{
                                              marginTop: '16px',
                                              marginBottom: '16px',
                                              height: '4px'
                                          }}
                                      />
                                  </Grid>
                              ))
                            : ''}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        style={{ margin: '8px', borderRadius: '16px' }}
                        onClick={handleClose}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    {nameFlag ? (
                        ''
                    ) : (
                        <Button
                            variant="contained"
                            style={{ margin: '8px', borderRadius: '16px' }}
                            onClick={handleDone}
                            aria-label="Done"
                        >
                            Done
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
