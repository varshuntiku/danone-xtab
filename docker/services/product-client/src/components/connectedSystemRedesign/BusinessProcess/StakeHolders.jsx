import React, { useState } from 'react';
import businessProcessStyles from './BusinessProcessStyles';
import { Typography, withStyles } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Close from '@material-ui/icons/CloseOutlined';
import { Accordion, AccordionSummary, AccordionDetails, Avatar } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SelectedIcon from '@material-ui/icons/Done';
import clsx from 'clsx';

const StakeHolders = (props) => {
    const classes = props.classes;
    const [expanded, setExpanded] = useState(false);
    const unactiveStakeholders = props.unactiveStakeholders || [];

    const handleChange = () => {
        setExpanded(!expanded);
    };

    const handleStakeHolderSelect = (stakeholder) => {
        if (!unactiveStakeholders.includes(stakeholder?.id)) {
            stakeholder?.name == props.selectedStakeHolder?.name
                ? props.setSelectedStakeHolder(null)
                : props.setSelectedStakeHolder(stakeholder);
            setExpanded(false);
        }
    };

    const hasStakeholders = props.stakeholders && props.stakeholders.length;

    return (
        <Accordion
            expanded={expanded}
            onChange={handleChange}
            className={classes.stakeHolderAccordion}
            disabled={!hasStakeholders}
        >
            <AccordionSummary
                sx={{
                    position: 'fixed',
                    bottom: 0
                }}
                className={clsx(
                    classes.stakeHolderAccordionSummary,
                    props.modalStakeHolder ? classes.stakeHolderAccordionSummaryModal : 'none'
                )}
                expandIcon={
                    expanded ? (
                        <Close
                            className={
                                props.modalStakeHolder
                                    ? classes.expandIconModalStakeHolder
                                    : classes.expandIconStakeHolder
                            }
                        />
                    ) : props.modalStakeHolder ? (
                        <ExpandMoreIcon
                            className={
                                props.modalStakeHolder
                                    ? classes.expandIconModalStakeHolder
                                    : classes.expandIconStakeHolder
                            }
                        />
                    ) : (
                        <ExpandLessIcon
                            className={clsx(
                                classes.expandIconStakeHolder,
                                props.modalStakeHolder ? classes.modalExpandIconStakeHolder : 'none'
                            )}
                        />
                    )
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography component={'div'} className={classes.StakeHolderAccordionContainerMain}>
                    {' '}
                    <Avatar
                        className={classes.stakeHolderIcon}
                        style={{
                            '--background': props.selectedStakeHolder?.profileColor || '#98B1ED'
                        }}
                    />
                    {props.selectedStakeHolder ? (
                        <span>
                            {props.selectedStakeHolder.role} -
                            <span className={classes.StakeHolderSelected}>
                                {props.selectedStakeHolder.name}
                            </span>
                        </span>
                    ) : (
                        'Stakeholders'
                    )}
                </Typography>
            </AccordionSummary>
            {hasStakeholders ? (
                <AccordionDetails
                    className={clsx(
                        classes.stakeHolderDetails,
                        props.modalStakeHolder ? classes.stakeHolderDetailsModal : 'none'
                    )}
                >
                    <div className={classes.stakeHoldersContainer}>
                        {props.stakeholders &&
                            props.stakeholders.map((stakeholder) => {
                                return (
                                    <Typography
                                        component={'div'}
                                        key={`${stakeholder.role}-${stakeholder.name}`}
                                        className={clsx(
                                            classes.StakeHolderAccordionContainer,
                                            props.modalStakeHolder
                                                ? classes.StakeHolderAccordionModalContainer
                                                : 'none',
                                            stakeholder?.name == props.selectedStakeHolder?.name &&
                                                !unactiveStakeholders.includes(stakeholder?.id)
                                                ? props.modalStakeHolder
                                                    ? classes.stakeHolderModalSelected
                                                    : classes.stakeHolderSelected
                                                : 'none',
                                            unactiveStakeholders.includes(stakeholder?.id)
                                                ? classes.unactiveStakeholders
                                                : 'none'
                                        )}
                                        onClick={() => handleStakeHolderSelect(stakeholder)}
                                    >
                                        {' '}
                                        <Avatar
                                            className={classes.stakeHolderIcon}
                                            style={{
                                                '--background': unactiveStakeholders.includes(
                                                    stakeholder?.id
                                                )
                                                    ? '#B6C1CD'
                                                    : stakeholder.profileColor
                                            }}
                                        />
                                        {`${stakeholder.role} - `}
                                        <span className={classes.stakeHolderName}>
                                            {stakeholder.name}
                                        </span>
                                        {stakeholder?.name == props.selectedStakeHolder?.name &&
                                            !unactiveStakeholders.includes(stakeholder?.id) && (
                                                <SelectedIcon
                                                    className={
                                                        props.modalStakeHolder
                                                            ? classes.selectedModalIcon
                                                            : classes.selectedIcon
                                                    }
                                                />
                                            )}
                                    </Typography>
                                );
                            })}
                    </div>
                </AccordionDetails>
            ) : null}
        </Accordion>
    );
};

export default withStyles(businessProcessStyles, { withTheme: true })(StakeHolders);
