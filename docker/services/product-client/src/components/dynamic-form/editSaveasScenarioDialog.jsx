import {React,useEffect,useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, TextField } from '@material-ui/core';
import CloseIcon from '../../assets/Icons/CloseBtn';

const useStyles = makeStyles((theme) => ({
    titleWrapper: {
        background: theme.palette.background.pureWhite,
        padding: `0 ${theme.layoutSpacing(16)}`
    },
    title: {
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        padding: `${theme.layoutSpacing(32)} ${theme.layoutSpacing(4)}`,
        height: theme.layoutSpacing(22),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 400,
        '& .MuiGrid-container': {
            margin: 0
        },
        '& .MuiGrid-item': {
            padding: 0,
            alignItems: 'center'
        },
        '& h4': {
            fontFamily: theme.title.h1.fontFamily,
            fontWeight: 500,
            fontSize: theme.layoutSpacing(22),
            letterSpacing: theme.layoutSpacing(1),
            color: theme.palette.text.revamp,
            marginBottom: 0
        }
    },
    closeButton: {
        padding: 0,
        margin: 0,
        '& svg': {
            width: theme.layoutSpacing(16),
            height: theme.layoutSpacing(16)
        }
    },
    buttonWrapper: {
        padding: `0 ${theme.layoutSpacing(30)} ${theme.layoutSpacing(28)}`,
        '& button': {
            fontSize: theme.layoutSpacing(15),
            fontFamily: theme.title.h1.fontFamily,
            lineHeight: 'normal',
            letterSpacing: theme.layoutSpacing(1.5),
            fontWeight: 500,
            height: theme.layoutSpacing(36),
            padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`,
            background: theme.palette.text.titleText,
            borderRadius: '2px',
            color: theme.palette.text.peachText
        }
    },
    button: {
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: 'normal',
        letterSpacing: theme.layoutSpacing(1.5),
        fontWeight: 500,
        height: theme.layoutSpacing(36),
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`,
        background: theme.palette.text.titleText,
        borderRadius: '2px',
        color: theme.palette.text.peachText
    },
    content: {
        color: theme.palette.text.titleText,
        fontSize: theme.spacing(2.5),
        padding: `${theme.layoutSpacing(40)} ${theme.layoutSpacing(28)} ${theme.layoutSpacing(48)}`,
        '& .MuiGrid-item': {
            padding: 0,
            '&:first-child h4': {
                paddingTop: 0
            }
        }
    },
    checkbox: {
        padding: 0,
        marginRight: theme.layoutSpacing(8),
        '& svg': {
            width: theme.layoutSpacing(20),
            height: theme.layoutSpacing(20)
        }
    },
    dialogPaper: {
        background: theme.palette.background.pureWhite,
        backdropFilter: 'blur(2rem)',
        maxWidth: theme.layoutSpacing(468),
        borderRadius: 0
    },
    sepratorLine: {
        width: `calc(100% - ${theme.layoutSpacing(32)})`,
        marginTop: 0,
        marginBottom: 0
    },
    messageStyle: {
        fontWeight: '400',
        fontSize: theme.layoutSpacing(15),
        letterSpacing: theme.layoutSpacing(0.35),
        color: theme.palette.text.titleText,
        display: 'flex',
        alignItems: 'center'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2)
    },
    counter: {
        alignSelf: 'flex-end',
        color: theme.palette.text.secondary,
        fontSize: theme.layoutSpacing(13),
        weight: 600
    },
    subHeading: {
        fontWeight: 500,
        fontSize: theme.layoutSpacing(15)
    },
    subHeadingDescription: {
        fontWeight: 500,
        fontSize: theme.layoutSpacing(15),
        marginTop: theme.layoutSpacing(18)
    },
    textFieldScenario: {
        marginTop: '-1rem',
        '& .MuiOutlinedInput-input': {
            padding: '1rem 1.2rem',
            fontSize: theme.layoutSpacing(15),
            color: theme.palette.text.revamp
        },
        '& .MuiOutlinedInput-inputMultiline': {
            fontSize: theme.layoutSpacing(15),
            margin: '-2.5rem',
            color: theme.palette.text.revamp
        }
    }
}));

export default function FormDialogSaveAsScenario(props) {
    const classes = useStyles();
    const [description, setDescription] = useState('');
    const [version, setVersion] = useState('');
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const [isediting, setisEditing] = useState([]);
    const[name,setName]=useState('')
    const handlenNameChange = (event) => {
        setVersion(event.target.value);
    };
    useEffect(() => {
        setName(props.scenerioname);
        setisEditing(props.isEditing);
    }, [name, props.scenerioname, props.isEditing]);
    return (
        <Dialog
            open={props.dialogOpen}
            onClose={() => props.handleDialogClose()}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={'md'}
            aria-describedby="form-content"
            classes={{ paper: classes.dialogPaper }}
        >
            <DialogTitle className={classes.titleWrapper} id="form-dialog-title">
                <div className={classes.title}>
                    <Typography
                        id={'input-slider-heading'}
                        className={classes.simulatorTitle}
                        variant="h4"
                        gutterBottom
                    >
                        {'Save Simulator Scenario'}
                    </Typography>
                    {props.handleDialogClose ? (
                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={props.handleDialogClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </div>
            </DialogTitle>
            <DialogContent className={classes.content} id="form-content">
                
                <form className={classes.form}>
                    <Typography variant="h4" className={classes.subHeading}>
                        Enter Scenario Version
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={version}
                        onChange={handlenNameChange}
                        rows={1}
                        className={classes.textFieldScenario}
                    />

                    <Typography variant="h4" className={classes.subHeadingDescription}>
                        Enter Description
                    </Typography>
                    <TextField
                        rows={4}
                        multiline
                        variant="outlined"
                        value={description}
                        onChange={handleDescriptionChange}
                        fullWidth
                        className={classes.textFieldScenario}
                    />
                    <Typography className={classes.counter}>{description.length}/100</Typography>
                </form>
            </DialogContent>
            <DialogActions className={classes.buttonWrapper}>
                <Button
                    variant="contained"
                    onClick={() => props.handleSaveScenario(name, description, version, isediting)}
                    aria-label="Got It!"
                >
                    Save Scenerio
                </Button>
            </DialogActions>
        </Dialog>
    );
}
