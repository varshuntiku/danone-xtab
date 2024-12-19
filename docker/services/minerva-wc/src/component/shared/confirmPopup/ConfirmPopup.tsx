import { useCallback, useState } from "preact/hooks";
import Popover from "../popover/Popover";
import "./confirmPopup.scss";
import FlatCloseIcon from "../../../svg/FlatCloseIcon";

export default function ConfirmPopup({
    title="",
    subTitle="",
    cancelText="",
    hideCancelButton=false,
    hideConfirmButton=false,
    confirmText="",
    disabled=false,
    enableCloseButton=false,
    onConfirm=(...params: any[]) => {},
    onCancel=(...params: any[]) => {},
    children=(triggerConfirm: (...params: any[])=> void )=>{}
}) {
    const [open, setOpen] = useState(false);
    const [triggerParams, setTriggerParams] = useState(null);
    const handleConfirm = (e) => {
        setOpen(false);
        if (onConfirm) {
            onConfirm(e, triggerParams);
        }
    };
    const handleCancel = (e) => {
        setOpen(false);
        if (onCancel) {
            onCancel(e, triggerParams);
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
            {(disabled || !open) ? null : (
                <Popover
                    open={open}
                    onClose={handleCancel}
                >
                    <div className="MinervaConfirmPopup">
                        <div className="MinervaConfirmPopup-title" id={title || 'Confirm'}>
                            <h4> {title || 'Confirm'} </h4>
                            {enableCloseButton ? (
                                <button
                                    className="MinervaIconButton"
                                    onClick={() => setOpen(false)}
                                    title="Close"
                                >
                                    <FlatCloseIcon />
                                </button>
                            ) : null}
                        </div>
                        <div className="MinervaConfirmPopup-content">
                            <p>
                                {subTitle}
                            </p>
                        </div>
                        <div className="MinervaConfirmPopup-action">
                            {hideConfirmButton ? null : (
                                <button
                                className="MinervaButton-outlined-small"
                                onClick={handleConfirm}
                                aria-label="Confirm"
                                >
                                    {confirmText || 'Yes'}
                                </button>
                            )}
                            {hideCancelButton ? null : (
                                <button
                                    className="MinervaButton-small"
                                    onClick={handleCancel}
                                    aria-label="Cancel"
                                >
                                    {cancelText || 'No'}
                                </button>
                            )}
                        </div>
                    </div>
                </Popover>
            )}
        </>
    );
}
