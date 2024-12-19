import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as MinervaIcon } from 'assets/img/MinervaAvatarIconNew.svg';

const useStyles = makeStyles((theme) => ({
    MinervaIcon: {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        '&:hover': {
            backgroundColor: `${theme.palette.background.menuItemFocus}99`,
            borderRadius: '100%'
        }
    }
}));

const AskNucliosButton = ({ togglePopup }) => {
    const classes = useStyles();
    return (
        <div className={`${classes.MinervaIcon}`} onClick={togglePopup}>
            <MinervaIcon className={classes.icon} />
        </div>
    );
};

export default AskNucliosButton;
