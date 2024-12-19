import React, { useState, useEffect } from 'react';
import Solutions from 'components/connectedSystem/Solutions';
import { Button, ButtonGroup } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import BusinessUser from './BusinessUser';
import DataUser from './DataUser';
import connSystemFoundationTabstyle from 'assets/jss/connSystemFoundationTabstyle.jsx';
import { getInsights, getSolutions } from 'services/connectedSystem';
import MinervaChatbot from 'components/minerva/MinervaChatbot';

function FoundationDataTab(props) {
    const [activeTab, setActiveTab] = useState('Business User');
    // classes is default parameter while using withStyles
    const classes = { ...props.classList, ...props.classes };
    const [insights, setInsights] = useState([]);
    const [tools, setTools] = useState([]);
    const codexTheme = localStorage.getItem('codx-products-theme');

    const fetchInsights = async () => {
        getInsights(props.code, 2).then((response) => {
            setInsights(response);
        });
    };
    const fetchTools = async () => {
        getSolutions(props.code, 2).then((response) => {
            // TODO: Remove the following once we start fetching data from the APIs
            response.forEach(
                (solution) =>
                    (solution.app_id = import.meta.env['REACT_APP_ENV'] === 'prod' ? 1523 : 26)
            );
            setTools(response);
        });
    };

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            fetchInsights();
            fetchTools();
        }
        return function cleanup() {
            mounted = false;
        };
    }, []);

    return (
        <div>
            <ButtonGroup className={classes.foundation_buttonGroup}>
                <Button
                    onClick={() => setActiveTab('Business User')}
                    variant={activeTab === 'Business User' ? 'contained' : 'outlined'}
                    style={{ textTransform: 'none' }}
                    aria-label="Business user"
                >
                    Business User
                </Button>
                <Button
                    onClick={() => setActiveTab('Data User')}
                    variant={activeTab === 'Data User' ? 'contained' : 'outlined'}
                    style={{ textTransform: 'none' }}
                    aria-label="Data Officer"
                >
                    Data Officer
                </Button>
            </ButtonGroup>

            {activeTab === 'Business User' ? (
                <BusinessUser data={props} redirectionReference={props.redirectionReference} />
            ) : (
                <DataUser data={props} />
            )}
            <div
                className={
                    activeTab === 'Business User'
                        ? classes.foundation_connSystemBusinessGridBottom
                        : classes.foundation_connSystemGridBottom
                }
            >
                <div className={classes.foundation_solutionsFooter}>
                    <Solutions
                        solutions={insights}
                        width={'45%'}
                        cardCol={3}
                        insightMinWidth={'22rem'}
                        fitContent={true}
                        title={'Insights'}
                        solutionBorder={
                            codexTheme === 'dark' ? '0.5px solid #02E0FE84' : '0.5px solid #4560D7'
                        }
                    />
                    <Solutions
                        solutions={tools}
                        width={'45%'}
                        cardCol={3}
                        insightMinWidth={'22rem'}
                        fitContent={true}
                        title={'Tools'}
                        solutionBorder={
                            codexTheme === 'dark' ? '0.5px solid #FEF40240' : '0.5px solid #F7C43D'
                        }
                    />
                    <div className={classes.connSystem_minervaChatbot}>
                        <MinervaChatbot />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withStyles(connSystemFoundationTabstyle, { withTheme: true })(FoundationDataTab);
