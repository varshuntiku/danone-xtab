import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Typography, makeStyles, Paper } from '@material-ui/core';
import Close from '@material-ui/icons/CloseOutlined';
import Create from '@material-ui/icons/CreateOutlined';
import LightbulbIcon from '@material-ui/icons/WbIncandescentOutlined';
import { LayoutContext } from 'context/LayoutContext';

const useStyles = makeStyles((theme) => ({
    addButton: {
        margin: theme.spacing(2),
        padding: '0.5rem 1rem'
    },
    addContainer: {
        background: theme.palette.background.modelBackground,
        width: '35rem',
        height: 'auto',
        display: 'flex',
        position: 'relative',
        marginLeft: '20rem',
        marginTop: '-6rem',
        flexDirection: 'column',
        padding: '1rem',
        zIndex: 1001
    },
    closeIcon: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        cursor: 'pointer'
    },
    addWidget: {
        fontSize: theme.title.h2.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default
    },
    buttonHolder: {
        display: 'flex',
        gap: '2rem'
    },
    button: {
        width: '6rem',
        height: '3rem',
        padding: '1rem',
        marginLeft: 'auto'
    },
    textField: {
        width: '100%',
        height: '6rem',
        fontSize: '4rem',
        '& .MuiInputBase-root': {
            color: theme.palette.text.default,
            borderBottom: `1px solid ${theme.palette.text.default}`
        },
        '& .MuiInputBase-input': {
            fontSize: '1.5rem',
            paddingBottom: '2px',
            paddingLeft: '2rem',
            color: theme.palette.text.default,
            borderColor: theme.palette.text.default
        }
    },
    createIcon: {
        width: '2rem',
        height: '2rem'
    },
    recommendation: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(235, 244, 255, 1)',
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        marginBottom: '1rem'
    },
    recommendationText: {
        marginLeft: theme.spacing(1),
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        fontSize: '1.3rem'
    },
    kpiNumberHeader: {
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        fontSize: '1.3rem',
        display: 'flex',
        alignItems: 'center',
        marginTop: '2rem',
        marginBottom: '-2rem',
        color: theme.palette.text.default
    },
    bulbIcon: {
        transform: 'rotate(180deg)',
        height: '3rem',
        width: '3rem'
    },
    addHolder: {
        position: 'relative',
        width: '100%'
    },
    addHolderInitial: {
        minHeight: '24rem',
        position: 'relative',
        width: '100%'
    }
}));

function AddWidget({ addWidget, setAddWidget, row, orientation = 'Horizontal', rows = 0 }) {
    const { widthPattern } = useContext(LayoutContext);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [widgetCount, setWidgetCount] = useState('');
    const [initial, setInitial] = useState(true);

    useEffect(() => {
        Object.keys(addWidget).length == rows ? setInitial(false) : null;
    }, [addWidget]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {
        let newWidget = { ...addWidget, [row]: Number(widgetCount) };
        setAddWidget(row, newWidget);
        setOpen(false);
    };

    return (
        <div className={initial ? classes.addHolderInitial : classes.addHolder}>
            <Button variant="outlined" onClick={handleClickOpen} className={classes.addButton}>
                <Create className={classes.createIcon} />{' '}
                {orientation == 'Vertical'
                    ? widthPattern?.[row] < 3
                        ? null
                        : 'Add Widget'
                    : widthPattern?.[row]?.[0] < 3
                    ? null
                    : 'Add Widget'}
            </Button>
            {open && (
                <div className={classes.addContainer}>
                    <Typography className={classes.addWidget}>Add Widgets</Typography>
                    <Close className={classes.closeIcon} onClick={handleClose} />
                    <Typography className={classes.kpiNumberHeader}>Number of Sections</Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="widget-count"
                        label="Input Number"
                        type="ineger"
                        fullWidth
                        value={widgetCount}
                        onChange={(e) => setWidgetCount(e.target.value)}
                        className={classes.textField}
                    />
                    <Paper className={classes.recommendation}>
                        <LightbulbIcon className={classes.bulbIcon} />
                        <Typography className={classes.recommendationText}>
                            We recommend a maximum of <b>3 widgets</b> in a row.
                        </Typography>
                    </Paper>
                    <div className={classes.buttonHolder}>
                        <Button variant="outlined" className={classes.button} onClick={handleAdd}>
                            Add
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddWidget;
