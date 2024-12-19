import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PowerBI_soln_logo from 'assets/img/conn-system-soln-powerbi.svg';
// import Codx_soln_logo from 'assets/img/conn-system-soln-codx.svg';
import { UnfoldMore, FiberManualRecord } from '@material-ui/icons';
import connectedSystemSolutionsCardStyle from 'assets/jss/connectedSystemSolutionsCardStyle';
import Logo from '../Nuclios/assets/logoIcon.svg';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme, props) => ({
    ...connectedSystemSolutionsCardStyle(theme, props)
}));

const SolutionsCard = (props) => {
    const classes = useStyles(props);
    const solution = props.solution;
    const cardRef = useRef();
    const theme = localStorage.getItem('codx-products-theme');
    const prevTheme = useRef(theme);

    const openPopup = () => {
        props.setPopupsolution(solution);
        props.setpopupState(solution);
        const rect = cardRef.current?.getBoundingClientRect();
        let side = { left: rect.left, transformOrigin: '0 100%' };
        if (rect.right >= window.innerWidth - 350) {
            side = { right: window.innerWidth - rect.right, transformOrigin: '100% 100%' };
        }
        if (rect.left > 0) {
            props.setPopupOpen(true);
            props.setPopupPosition({ bottom: window.innerHeight - rect.bottom, ...side });
        }
    };

    const [cls, setCls] = useState('');

    useEffect(() => {
        setCls('');
        if (!props.solution || props.solution.is_active) return;
        if (prevTheme.current !== theme) {
            setCls(classes.cardContainerRemove);
            prevTheme.current = theme;
        } else {
            let timeout = setTimeout(() => {
                setCls(classes.cardContainerRemove);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [solution.is_active, theme]);

    return (
        <div
            className={`
                ${classes.cardContainer}
                ${!solution.is_active ? clsx(classes.cardContainerHidden, cls) : ''}
                ${solution.type === 'powerbi' ? classes.cardContainerPowerBI : ''}
                ${
                    !solution.is_active
                        ? classes.hiddenCardContainerGap
                        : classes.visibleCardContainerGap
                }
                ${solution.is_selected ? classes.selectedSolution : ''}
            `}
            ref={cardRef}
            style={{ width: props.cardWidth }}
        >
            {!solution.insights && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className={classes.contentLeft}>
                        {solution.type === 'powerbi' ? (
                            <img
                                src={PowerBI_soln_logo}
                                className={classes.cardIcon}
                                alt="PowerBI logo"
                            />
                        ) : (
                            <img src={Logo} className={classes.cardIcon} alt="logo" />
                        )}
                    </div>
                    <div
                        className={classes.contentCenter}
                        style={{
                            width:
                                window.screen.width >= 1920
                                    ? props.fitContent
                                        ? 'fit-content'
                                        : '200px'
                                    : props.fitContent
                                    ? 'fit-content'
                                    : '150px'
                        }}
                    >
                        <div className={classes.cardHeading}>{solution.label}</div>
                        <div className={classes.solutionList}>
                            {solution.sub_headers.map((item, key) => (
                                <div className={classes.solutionItem} key={`subheader${key}`}>
                                    <FiberManualRecord />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={classes.contentRight}>
                        <div
                            className={`${classes.expandButton} ${
                                props.popupOpen && classes.expandButtonDisabled
                            }`}
                            onClick={openPopup}
                        >
                            <UnfoldMore />
                        </div>
                    </div>
                </div>
            )}
            {solution.insights && (
                <div
                    className={classes.insightContainer}
                    style={{ minWidth: props.insightMinWidth ? props.insightMinWidth : '27rem' }}
                >
                    {solution?.insight_data.map((insight, index) => (
                        <div className={classes.insightPoint} key={`insightData${index}`}>
                            <FiberManualRecord className={classes.pointer} />
                            <Typography className={classes.insightContent}>{insight}</Typography>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SolutionsCard;
