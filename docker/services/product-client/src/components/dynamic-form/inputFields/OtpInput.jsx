import React, { useState, useCallback } from 'react';
import { TextField } from '@material-ui/core';

export function OTPInputComponent(props) {
    const { length, disabled, onChange, className, InputProps, variant } = props;

    const [activeIndex, setActiveIndex] = useState(0);
    const [otp, setOtp] = useState(Array(length).fill(''));

    const focusInput = useCallback((focusIndex) => {
        const index = Math.max(Math.min(length - 1, focusIndex), 0);
        document.querySelector(`[aria-label="field-${index}"]`).focus();
        setActiveIndex(() => index);
    }, []);

    const updateOtp = useCallback(
        (_otp) => {
            const otpValue = _otp.join('');
            onChange(otpValue);
        },
        [onChange]
    );

    const updateCode = useCallback(
        (code) => {
            const _otp = [...otp];
            _otp[activeIndex] = code[0] || '';
            setOtp(() => _otp);
            updateOtp(_otp);
        },
        [activeIndex, updateOtp, otp]
    );

    const onFocus = useCallback(
        (focusIndex) => () => {
            focusInput(focusIndex);
        },
        [focusInput]
    );

    const onChangeHandler = useCallback(
        (e) => {
            let value = e.target.value;
            value = Number(value) >= 0 ? value : '';
            if (!value) {
                return;
            }
            updateCode(value);
            focusInput(activeIndex + 1);
        },
        [updateCode, focusInput]
    );

    const onBlur = useCallback(() => {
        setActiveIndex(() => -1);
    }, []);

    const keyDown = useCallback(
        (e) => {
            const { key } = e;
            switch (key) {
                case 'Backspace':
                case 'Delete': {
                    if (otp[activeIndex]) {
                        updateCode('');
                    } else {
                        focusInput(activeIndex - 1);
                    }
                    break;
                }
                case 'ArrowLeft': {
                    focusInput(activeIndex - 1);
                    break;
                }
                case 'ArrowRight': {
                    focusInput(activeIndex + 1);
                    break;
                }
                default: {
                    if (key.match(/^[^a-zA-Z0-9]$/)) {
                        e.preventDefault();
                    }
                    break;
                }
            }
        },
        [activeIndex, updateCode, focusInput, otp]
    );

    const onPaste = useCallback((e) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text/plain')
            .trim()
            .slice(0, length - activeIndex)
            .split('');
        if (pastedData) {
            let nextFocusIndex = 0;
            const _otp = [...otp];
            _otp.map((value, index) => {
                if (index >= activeIndex) {
                    let changedValue = pastedData.shift() || value;
                    changedValue = Number(changedValue) >= 0 ? changedValue : '';
                    if (changedValue) {
                        _otp[index] = changedValue;
                        nextFocusIndex = index;
                    }
                }
            });
            setOtp(_otp);
            updateOtp(_otp);
            setActiveIndex(Math.min(nextFocusIndex + 1, length - 1));
        }
    });

    return (
        <React.Fragment>
            {Array(length)
                .fill('')
                .map((_, index) => (
                    <TextField
                        key={`field-${index}`}
                        variant={variant}
                        focused={activeIndex === index}
                        autoFocus={activeIndex === index}
                        value={otp && otp[index]}
                        onFocus={onFocus(index)}
                        onChange={onChangeHandler}
                        onKeyDown={keyDown}
                        onBlur={onBlur}
                        onPaste={onPaste}
                        inputProps={{
                            'aria-label': `field-${index}`,
                            style: {
                                textAlign: 'center'
                            }
                        }}
                        InputProps={{
                            ...InputProps,
                            disabled
                        }}
                        className={className}
                        type="tel"
                        id="otp input"
                    />
                ))}
        </React.Fragment>
    );
}

const OtpInput = React.memo(OTPInputComponent);
export default OtpInput;
