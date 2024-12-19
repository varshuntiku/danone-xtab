import { makeStyles } from '@material-ui/core';
import comingSoonImgLight from '../../../assets/img/coming_soon_bg_light.png';
import comingSoonImgDark from '../../../assets/img/coming_soon_bg_dark.png';
import comingSoonBgLight from '../../../assets/img/AskNuclios_LightBg.png';
import comingSoonBgDark from '../../../assets/img/AskNuclios_DarkBg.png';

let MODE = '';
const useStyles = makeStyles((theme) => {
    MODE = theme.props.mode;
    return {
        root: {
            boxSizing: 'border-box',
            display: 'flex',
            height: '100%',
            padding: theme.spacing(12),
            backgroundImage:
                theme.props.mode == 'light'
                    ? `url(${comingSoonBgLight})`
                    : `url(${comingSoonBgDark})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            borderRadius: '2% 2% 0 0'
        },
        main: {
            display: 'flex'
        },
        leftMainCont: {
            width: '35vw',
            borderLeft: `1px solid ${theme.palette.border.LoginInpBorder}`,
            display: 'flex',
            flexDirection: 'column'
        },
        leftMainContTop: {
            height: '20vh',
            borderBottom: `1px solid ${theme.palette.border.LoginInpBorder}`,
            borderTop: `1px solid ${theme.palette.border.LoginInpBorder}`,
            marginTop: '-0.5vw',
            marginLeft: '0.5vw',
            marginRight: '0.5vw'
        },
        leftTopSubCont: {
            width: '100%',
            height: '85%',
            borderRight: `1px solid ${theme.palette.border.LoginInpBorder}`,
            marginLeft: '0.5vw',
            marginTop: '0.5vw'
        },
        leftMainBottomCont: {
            height: '100%',
            borderBottom: `1px solid ${theme.palette.border.LoginInpBorder}`,
            marginBottom: '-0.5vw',
            marginLeft: '0.5vw',
            marginRight: '0.5vw'
        },
        leftMainBottomSubCont: {
            width: '98%',
            height: '95%',
            padding: theme.spacing(3),
            borderRight: `1px solid ${theme.palette.border.LoginInpBorder}`,
            marginTop: '0.5vw',
            marginLeft: '1vw'
        },
        leftMainBottomSubTextCont: {
            color: theme.palette.text.revamp,
            margin: 'auto',
            fontSize: '6.5vw',
            fontWeight: theme.typography.h1.fontWeight,
            lineHeight: '6vw',
            letterSpacing: '1px',
            fontFamily: theme.typography.h1.fontFamily,
            paddingTop: theme.spacing(5)
        },
        rightContainer: {
            width: '65vw',
            borderTop: `1px solid ${theme.palette.border.LoginInpBorder}`,
            marginTop: '-0.5vw',
            marginLeft: '0.5vw',
            marginBottom: '-0.5vw',
            borderBottom: `1px solid ${theme.palette.border.LoginInpBorder}`
        },
        rightImageCont: {
            width: '101%',
            height: '97%',
            padding: '1.5vw',
            marginTop: '0.5vw',
            marginBottom: '0.5vw',
            borderRight: `1px solid ${theme.palette.border.LoginInpBorder}`
        },
        image: {
            width: '100%',
            height: '100%'
        }
    };
});

export default function ComingSoon() {
    const classes = useStyles();
    return (
        <>
            <div className={classes.root}>
                <div className={classes.leftMainCont}>
                    <div className={classes.leftMainContTop}>
                        <div className={classes.leftTopSubCont}></div>
                    </div>
                    <div className={classes.leftMainBottomCont}>
                        <div className={classes.leftMainBottomSubCont}>
                            <p className={classes.leftMainBottomSubTextCont}> Coming Soon </p>
                        </div>
                    </div>
                </div>
                <div className={classes.rightContainer}>
                    <div className={classes.rightImageCont}>
                        <img
                            className={classes.image}
                            src={MODE === 'light' ? comingSoonImgLight : comingSoonImgDark}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
