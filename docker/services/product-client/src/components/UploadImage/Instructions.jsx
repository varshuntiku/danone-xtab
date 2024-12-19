import React from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Collapse,
    IconButton,
    makeStyles
} from '@material-ui/core';
import Star from '@material-ui/icons/Star';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    instructionContainer: {
        maxWidth: '33%',
        padding: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        margin: 0,
        marginBottom: '1rem',
        fontSize: '4rem',
        position: 'relative'
    },
    fontClass: {
        fontSize: '2rem',
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        marginLeft: '2rem',
        '& span.MuiTypography-body1': {
            fontSize: '1.5rem',
            color: theme.palette.text.default,
            marginLeft: '0rem'
        },
        '& p.MuiTypography-body2': {
            fontSize: '1.5rem',
            color: theme.palette.text.default,
            marginLeft: '0rem'
        }
    },
    starIcon: {
        height: '2rem',
        width: '2rem !important',
        color: 'gold',
        '& .MuiListItemIcon-root': {
            minWidth: '20px'
        }
    },
    collapseContainer: {
        position: 'absolute',
        top: '105%',
        zIndex: 100,
        background: theme.palette.background.modelBackground
    },
    listItem: { minWidth: '2rem' }
}));
const Instructions = () => {
    const [expanded, setExpanded] = React.useState(false);
    const classes = useStyles();
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Box className={classes.instructionContainer}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography className={classes.fontClass}>Instructions</Typography>
                <IconButton
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMore />
                </IconButton>
            </Box>
            <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit
                className={classes.collapseContainer}
            >
                <List>
                    {[
                        'Upload the product image and click on the product to be retained.',
                        'Provide an input prompt for generating new contents.',
                        'Select the appropriate banner template design and provide custom text.',
                        'Click Run button to generate the outputs.'
                    ].map((text, index) => (
                        <ListItem key={index}>
                            <ListItemIcon className={classes.listItem}>
                                <Star className={classes.starIcon} color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                className={classes.fontClass}
                                primary={<b>step {index + 1}:</b>}
                                secondary={text}
                            />
                        </ListItem>
                    ))}
                    <Divider />
                    <ListItem>
                        <ListItemIcon className={classes.listItem}>
                            <Star className={classes.starIcon} color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            className={classes.fontClass}
                            primary="Note: Try using parameters like inference steps, negative prompt and guidance scale to tweak the quality of the results."
                        />
                    </ListItem>
                </List>
            </Collapse>
        </Box>
    );
};

export default Instructions;
