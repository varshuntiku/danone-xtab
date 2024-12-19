import { useEffect, useState } from 'preact/hooks';
import CloseIcon from "../../../svg/CloseIcon";
import './customSnackbar.scss';
import SnackbarErrorIcon from '../../../svg/SnacbarErrorIcon';
import SnackbarSuccessIcon from '../../../svg/SnackbarSuccessIcon';
import SnackbarInfoIcon from '../../../svg/SnackbarInfoIcon';
import SnackbarWarningIcon from '../../../svg/SnackbarWarningIcon';

const SnackbarIcons = {
    error: <SnackbarErrorIcon class='MinervaSnackbar-icon'/>,
    success: <SnackbarSuccessIcon class='MinervaSnackbar-icon'/>,
    info: <SnackbarInfoIcon class='MinervaSnackbar-icon'/>,
    warning: <SnackbarWarningIcon class='MinervaSnackbar-icon'/>
}

//variant = info, error, warning, success
export default function CustomSnackbar({ open, message, autoHideDuration=null, type="", anchorOrigin: { vertical, horizontal } = { vertical: 'top', horizontal: 'right' }, onClose = null, showActionButton=false, actionButtonLabel='', onActionClick=null, showCloseButton=false, variant="info" }) {

    const [showSnackbar, setShowSnackbar] = useState(open)

    useEffect(() => {
        if (autoHideDuration && open) {
            const timer = setTimeout(() => {
                setShowSnackbar(false)
                if (onClose) {
                    onClose()
                }
            }, autoHideDuration);


            return () => clearTimeout(timer)
        }
    }, [autoHideDuration, onClose, open])

    useEffect(() => {
        setShowSnackbar(open)
    }, [open])

    const handleClose = () => {
        setShowSnackbar(false)
        if (onClose) {
            onClose()
        }
    }

    return (
        <div key='minerva-snackbar'
            className={`MinervaSnackbar-container MinervaSnackbar-${variant} MinervaSnackbar-${showSnackbar ? 'show' : 'hide'} MinervaSnackbarAnchorOrigin${stringCapitalizeFormat(vertical)}${stringCapitalizeFormat(horizontal)} Minerva${stringCapitalizeFormat(type)}Snackbar`}>
            {SnackbarIcons[variant]}
            <div className='MinervaSnackbar-content'>
                <p>{message}</p>
                {showActionButton ? (
                    <button className='' onClick={onActionClick}>
                        Action
                    </button>
                ) : null}
            </div>
            {showCloseButton ? (
                <button title="close" className="MinervaIconButton MinervaSnackbar-close" onClick={handleClose}>
                    <CloseIcon />
                </button>
            ) :
                null}
        </div>
    )
}

const stringCapitalizeFormat = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}