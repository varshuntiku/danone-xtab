import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import BaseModels from '../../components/llmWorkbench/BaseModels';
import supportedModelsStyle from '../../assets/jss/llmWorkbench/supportedModelsStyle';
import Typography from 'components/elements/typography/typography';
import t from 'config/textContent/llmWorkbench.json';
import { Breadcrumbs, Link } from '@material-ui/core';

const useStyles = makeStyles(supportedModelsStyle);

export default function SupportedModels(props) {
    const classes = useStyles();
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
                    Deploy base models
                </Typography>
            </Breadcrumbs>
            <div className={classes.container}>
                <div className={classes.tabContainer}>
                    <Typography className={classes.titleText}>
                        {t.supported_models.tables.base_models.title}
                    </Typography>
                </div>
                <Typography variant="k8" style={{ textTransform: 'none' }}>
                    {t.supported_models.tables.information}
                </Typography>
            </div>
            <BaseModels {...props} />
        </>
    );
}
