import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ConfirmPopup from '../../confirmPopup/ConfirmPopup';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    root: (p) => ({
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: p.align ? p.align : 'flex-end',
        gap: '1rem'
    }),
    buttonStyle: {
        textTransform: 'capitalize'
    }
}));

function ActionButtons({ onClick, params, align, confirm, ...props }) {
    const classes = useStyles({ align });
    let buttons = params;
    if (buttons && !Array.isArray(buttons)) {
        buttons = [buttons];
    }

    if (!buttons?.length) {
        return null;
    }

    const renderIcon = (icon) => {
        if (icon?.url) {
            return (
                <img
                    src={icon.url}
                    alt={icon?.name || 'altimgicon'}
                    style={{ objectFit: 'cover', width: '2rem', height: '2rem' }}
                />
            );
        } else {
            return null;
        }
    };

    const handleClick = (el) => {
        if (el?.navigate?.to) {
            if (el.navigate.inAppNavigation) {
                props.history.push(`/${el.navigate.to}`);
            } else {
                window.open(`${window.location.origin}/${el.navigate.to}`, '_blank');
            }
        } else if (onClick) {
            onClick(el);
        }
    };

    return (
        <div className={classes.root} id="action-buttons-wrapper">
            {buttons?.map((el, i) => {
                if (!el) {
                    return <div key={'buttons' + i}></div>;
                }
                const _confirm = el?.confirm === undefined ? confirm : el?.confirm;
                return (
                    <ConfirmPopup
                        key={'buttons' + i}
                        onConfirm={() => handleClick(el)}
                        disabled={!_confirm}
                        title={_confirm?.title}
                        subTitle={_confirm?.subTitle}
                        confirmText={_confirm?.confirmText}
                        cancelText={_confirm?.cancelText}
                    >
                        {(triggerConfirm) => (
                            <Button
                                key={el.text || el.name || 'Click'}
                                onClick={() => (_confirm ? triggerConfirm(el) : handleClick(el))}
                                variant={el.variant || 'outlined'}
                                size={el.size || 'small'}
                                disabled={el.disabled}
                                startIcon={el?.startIcon && renderIcon(el.startIcon)}
                                endIcon={el?.endIcon && renderIcon(el.endIcon)}
                                aria-label={
                                    typeof el === 'string' ? el : el.text || el.name || 'Click'
                                }
                                className={classes.buttonStyle}
                            >
                                {typeof el === 'string' ? el : el.text || el.name || 'Click'}
                            </Button>
                        )}
                    </ConfirmPopup>
                );
            })}
        </div>
    );
}

export default withRouter(ActionButtons);
