import React from 'react';
import { Box, Breadcrumbs, Link, useTheme, withStyles } from '@material-ui/core';
import Typography from 'components/elements/typography/typography';
import deployedLLMStyle from 'assets/jss/llmWorkbench/deployedLLMStyle';
import t from 'config/textContent/llmWorkbench.json';
import DeploymentRequests from './DeploymentRequests';

const ApprovalRequests = ({ classes }) => {
    const theme = useTheme();
    return (
        <>
            <Breadcrumbs
                aria-label="breadcrumb"
                style={{
                    color: theme.palette.text.titleText,
                    paddingLeft: theme.spacing(3),
                    paddingTop: theme.spacing(0.5),
                    fontSize: '1.4rem'
                }}
            >
                <Link color="inherit" href="/llmworkbench">
                    LLM Workbench
                </Link>
                <Typography
                    color="textPrimary"
                    style={{
                        fontWeight: 'bold',
                        color: theme.palette.text.contrastText,
                        fontSize: '1.4rem'
                    }}
                >
                    Approval Requests
                </Typography>
            </Breadcrumbs>
            <Box display="flex" flexDirection="column" gridGap="5rem">
                <Box display="flex" flexDirection="column">
                    <Typography className={classes.titleText}>
                        {t.approval_requests.table.title}
                    </Typography>
                    <Typography className={classes.titleText} variant="k8">
                        {t.approval_requests.table.information}
                    </Typography>
                </Box>
                <DeploymentRequests />
            </Box>
        </>
    );
};

export default withStyles(deployedLLMStyle, { withTheme: true })(ApprovalRequests);
