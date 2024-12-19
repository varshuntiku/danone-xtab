import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { animated, useSpring, useTrail } from '@react-spring/web';
import clsx from 'clsx';
import connectedSystemStakeholderStyle from 'assets/jss/connectedSystemStakeholderStyle.jsx';
import { springConfig } from 'util/spring-config';

const Stakeholders = (props) => {
    const { classes } = props;
    const [stakeholdersList, setStakeholdersList] = useState([]);
    const [springs] = useSpring(() => ({
        from: { y: -40 },
        to: { y: 0 },
        config: springConfig
    }));
    const trails = useTrail(props.stakeholders.length, {
        from: {
            x: props.mode === 'portrait' ? 200 : 0,
            y: props.mode === 'portrait' ? 0 : 50,
            opacity: 0
        },
        to: { x: 0, y: 0, opacity: 1 }
    });
    const [tableCellTrail, setTableCellTrail] = useState(trails);
    const [width, setWidth] = useState(window.innerWidth);
    const noOfCol = width < 1340 ? 1 : props.gridCols;
    const stakeholdersData = props.stakeholders;
    const mode = props.mode;

    useEffect(() => {
        if (mode === 'portrait') {
            let scrollBody = document.querySelector('#stakeholders-list');
            if (scrollBody) {
                scrollBody.scrollTop = 0;
            }
        }
    }, [props.stakeholders, mode]);

    useEffect(() => {
        let listOfStakeholders = stakeholdersData.slice();
        let updatedStakeholdersData = [];
        while (listOfStakeholders.length) {
            updatedStakeholdersData.push(listOfStakeholders.splice(0, noOfCol));
        }
        setStakeholdersList(updatedStakeholdersData);
        let listOfTableCellTrails = trails.slice();
        let updatedTableCellTrails = [];
        while (listOfTableCellTrails.length) {
            updatedTableCellTrails.push(listOfTableCellTrails.splice(0, noOfCol));
        }
        setTableCellTrail(updatedTableCellTrails);
    }, [props.stakeholders, noOfCol]);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const StakeholderItem = ({ stakeholder, classes, style }) => {
        const cellWidth = mode === 'portrait' ? '136rem' : '150rem';
        return (
            <TableCell
                style={{ ...style, '--gridCol': noOfCol, '--cellWidth': cellWidth }}
                className={classes.paper}
            >
                {stakeholder.profileIcon ? (
                    stakeholder.imageSrc ? (
                        <Avatar
                            alt="profile icon"
                            src={stakeholder.imageSrc}
                            className={classes.smallAvatar}
                        />
                    ) : (
                        <Avatar className={classes.smallAvatar}>
                            <AccountCircleIcon style={{ color: stakeholder.profileColor }} />
                        </Avatar>
                    )
                ) : null}
                <Typography className={classes.userDetail}>
                    <span className={classes.userRole}>{stakeholder.role}</span> -{' '}
                    {stakeholder.name}
                </Typography>
            </TableCell>
        );
    };

    const AnimatedTypography = animated(Typography);
    const AnimatedStakeholderItem = animated(StakeholderItem);

    return (
        <div className={classes.root}>
            <AnimatedTypography
                className={classes.sectionHeader}
                style={mode === 'landscape' ? springs : {}}
            >
                Stakeholders
            </AnimatedTypography>
            <TableContainer
                id="stakeholders-list"
                className={
                    mode === 'portrait'
                        ? clsx(classes.stakeholdersSection, classes.stakeholdersSectionPortrait)
                        : classes.stakeholdersSection
                }
            >
                <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                        {stakeholdersList.map((stakeholders, idx) => {
                            return (
                                <TableRow
                                    key={'stakeholders-row' + `${idx}`}
                                    className={classes.stakeholderItem}
                                    style={{ '--gridCol': noOfCol }}
                                >
                                    {stakeholders.map((stakeholder, index) => (
                                        <AnimatedStakeholderItem
                                            {...props}
                                            key={'stakeholder-' + index + `-${stakeholder.role}`}
                                            stakeholder={stakeholder}
                                            classes={classes}
                                            style={tableCellTrail[idx][index]}
                                        />
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default withStyles(
    (theme) => ({
        ...connectedSystemStakeholderStyle(theme)
    }),
    { withTheme: true }
)(Stakeholders);
