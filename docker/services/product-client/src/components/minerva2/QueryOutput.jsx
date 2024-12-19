import React, { useEffect, useState } from 'react';
import { IconButton, Typography, alpha, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import InfoPopper from '../porblemDefinitionFramework/create/InfoPopper';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { ReactComponent as QueryIcon } from 'assets/img/connQueryOutput.svg';
import outputImage from 'assets/img/output_image.png';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import AssortmentPlanningLogo from 'assets/img/assortment_planning.svg';
import IntegrationDemandPlannerLogo from 'assets/img/integration_demand_planner.svg';
import MarketingMediaPlannerLogo from 'assets/img/marketing_media_planner.svg';
import PricingLogo from 'assets/img/pricing_logo.svg';
import DiscountLogo from 'assets/img/discount_icon.svg';
import RecommendationIcon from 'assets/img/recommendation_icon.svg';
import { ReactComponent as ProfileIcon } from 'assets/img/connProfileIcon.svg';
import { ReactComponent as ExpandIcon } from 'assets/img/connExpandIcon.svg';

const useStyles = makeStyles((theme, themeMode = localStorage.getItem('codx-products-theme')) => ({
    queryOutputRoot: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        padding: '1rem 8rem',
        '&::-webkit-scrollbar': {
            width: '0.7rem',
            height: '0.3rem',
            marginRight: '2px'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent !important'
        },
        '&::-webkit-scrollbar-thumb': {
            borderRadius: '0.5rem',
            border: `0.5px solid ${theme.palette.text.default}`
        }
    },
    chatPopperView: {
        padding: '0 1rem',
        '& $emptyStateRoot svg': {
            width: '15rem',
            height: '15rem'
        }
    },
    resultCardRoot: {
        flex: 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        animation: `$fadeIn 0.75s step-end infinite`,
        margin: '2rem 0'
    },
    queryInput: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.6rem',
        padding: '1rem',
        borderRadius: '0.7rem',
        flex: 1
    },
    visualResultRoot: {
        padding: '1rem',
        flex: 1,
        overflow: 'hidden',
        minHeight: '20rem'
    },
    textResult: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.6rem',
        padding: '1rem'
    },
    emptyStateRoot: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        '& svg': {
            width: '20rem',
            height: '30rem',
            fill: alpha(theme.palette.text.default, 0.4),
            stroke: alpha(theme.palette.text.default, 0.45)
        },
        '& .MuiTypography-root': {
            fontSize: '2rem',
            color: alpha(theme.palette.text.default, 0.7)
        }
    },
    responseContainer: {
        display: 'flex',
        gap: '1rem',
        background: theme.palette.primary.dark,
        padding: '2rem',
        paddingRight: '4rem',
        borderRadius: '1rem',
        '& $msgAvatar': {
            backgroundColor: theme.palette.primary.contrastText,
            '& svg': {
                width: '2rem',
                fill: theme.palette.primary.dark
            }
        }
    },
    responseContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden'
    },
    msgAvatar: {
        backgroundColor: theme.palette.primary.light,
        fontSize: '2.4rem',
        '& svg': {
            fill: alpha(theme.palette.text.default, 0.7),
            fontSize: '2.6rem'
        }
    },
    openVisualResult: {
        padding: '0 1rem',
        '& button': {
            backgroundColor: alpha(theme.palette.primary.light, 0.7) + ' !important',
            color: alpha(theme.palette.text.default, 0.7) + ' !important',
            fontWeight: 300,
            padding: theme.spacing(1, 2),
            '& svg': {
                color: theme.palette.primary.contrastText + ' !important'
            },
            '&:hover': {
                opacity: '0.7'
            }
        }
    },
    outputToolbar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 0',
        gap: '0.4rem'
    },
    outputToolbarItem: {
        '&:hover': {
            '& svg': {
                opacity: 0.7
            }
        },
        '& svg': {
            fill: alpha(theme.palette.text.default, 0.7)
        }
    },
    sqlPopperContent: {
        minWidth: '70rem'
    },
    sqlTitle: {
        color: theme.palette.text.default,
        fontSize: '1.6rem',
        marginBottom: 0,
        textTransform: 'uppercase'
    },
    sqlDesc: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.6rem',
        margin: 0,
        '& code': {
            whiteSpace: 'break-spaces !important'
        }
    },
    actionPanel: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem 0'
    },
    feedback: {
        '& svg': {
            color: alpha(theme.palette.text.default, 0.4)
        }
    },
    active: {
        '& svg': {
            color: theme.palette.primary.contrastText
        }
    },
    periodContainer: {
        height: '4rem',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3.5rem'
    },
    periodBox: {
        height: '4rem',
        width: '8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '3px',
        fontWeight: '400',
        backgroundColor: alpha(theme.palette.primary.light, 0.7) + ' !important'
    },
    periodText: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.8rem'
    },
    chatContentContainer: {
        width: '100%'
    },
    queryContainer: {
        width: '100%'
    },
    contentBox: {
        width: '100%',
        backgroundColor: themeMode === 'dark' ? '#091F3A' : theme.palette.primary.dark,
        borderRadius: '3px',
        // padding: '1.5rem 1.5rem 3rem 1.5rem',
        paddingLeft: theme.layoutSpacing(25),
        paddingTop: theme.layoutSpacing(16),
        marginTop: '1.5rem'
    },
    contentBoxSuggestion: {
        width: '100%',
        borderRadius: '3px',
        padding: '1.5rem 0rem 0rem 0rem',
        marginTop: '1.5rem'
    },
    contentBoxSuggestionHeader: {
        height: '4rem',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    suggestionActionButton: {
        height: '4rem',
        width: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor:
            themeMode === 'dark'
                ? 'rgba(56, 98, 141, 0.2)'
                : alpha(theme.palette.primary.light, 0.5),
        marginLeft: '2rem',
        color: '#6DF0C2',
        cursor: 'pointer'
    },
    suggestionActionButtonIcon: {
        fontSize: '3rem',
        color: theme.palette.primary.contrastText
    },
    contentBoxSuggestionMain: {
        width: '100%'
    },
    suggestionOptionContainer: {
        marginTop: '1rem'
    },
    suggestionOption: {
        height: '4.5rem',
        borderRadius: '20px',
        backgroundColor: themeMode === 'dark' ? '#25486D' : alpha(theme.palette.primary.light, 0.5),
        border: '1px ' + theme.palette.primary.contrastText + ' solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '& p': {
            color: alpha(theme.palette.text.default, 0.8),
            fontSize: '1.5rem',
            padding: '0px',
            margin: '0px',
            paddingleft: '2rem',
            textAlign: 'center'
        }
    },
    recommendationButtonContainer: {
        height: '4rem',
        width: '20rem',
        borderRadius: '20px',
        backgroundColor: themeMode === 'dark' ? '#25486D' : alpha(theme.palette.primary.light, 0.5),
        border: '1px ' + theme.palette.primary.contrastText + ' solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '& p': {
            color: alpha(theme.palette.text.default, 0.8),
            fontSize: '1.5rem',
            padding: '0px',
            margin: '0px',
            marginLeft: '1rem',
            textAlign: 'center'
        },
        '& img': {
            height: '3rem',
            width: '3rem'
        }
    },
    contentBoxHeaderContainer: {
        height: 'fit-content',
        width: 'fit-content'
    },
    contentBoxHeader: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(20),
        letterSpacing: theme.layoutSpacing(1)
    },
    contentBoxQuestionContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '6rem',
        marginLeft: theme.layoutSpacing(24)
    },
    questionUserIconContainer: {
        height: theme.layoutSpacing(40),
        width: theme.layoutSpacing(40),
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        '& svg': {
            fontSize: '3rem',
            color: alpha(theme.palette.text.default, 0.7)
        }
    },
    questionTextContainer: {
        paddingLeft: '2rem',
        '& p': {
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(15),
            fontWeight: 400,
            fontFamily: theme.title.h1.fontFamily,
            lineHeight: theme.layoutSpacing(20),
            letterSpacing: theme.layoutSpacing(1),
            padding: '0px',
            margin: '0px'
        }
    },
    contentBoxOutputHeader: {
        display: 'flex',
        gap: theme.layoutSpacing(16)
    },
    contentBoxMainContainer: {
        width: '100%'
    },
    contentBoxMainContainerSummary: {
        width: '100%',
        marginBottom: '1rem'
    },
    contentBoxSummury: {
        width: '100%',
        display: 'flex'
    },
    contentBoxSummuryText: {
        paddingLeft: '1.5rem',
        width: '90%'
    },
    summaryText: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(15),
        padding: '0px',
        margin: '0px',
        width: 'fit-content'
    },
    contentBoxRecommendSolution: {
        width: '100%',
        display: 'flex',
        height: '33rem'
    },
    contentBoxRecommendSolutionContent: {
        width: 'inherit'
    },
    recommendSolutionHeader: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: '0px',
        margin: '0px',
        paddingTop: '2rem',
        paddingLeft: '1.5rem'
    },
    recommendSolution: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '2rem'
    },
    recommendSolutionCard: {
        height: '26.5rem',
        width: '30%',
        marginLeft: '1.5rem',
        marginRight: '2rem',
        borderRadius: '3px',
        backgroundColor:
            themeMode === 'dark' ? 'rgba(56, 98, 141, 0.2)' : alpha(theme.palette.primary.light, 1),
        cursor: 'pointer'
    },
    recommendSolutionCardHeader: {
        height: '8rem',
        margin: '1.5rem 1.5rem 0px 1.5rem',
        paddingBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px rgba(255, 255, 255, 0.2) solid'
    },
    recommendSolutionCardHeaderIconContainer: {
        height: '6rem',
        width: '6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    recommendSolutionCardHeaderIconRoundShape: {
        height: '5rem',
        width: '5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    recommendSolutionCardHeaderText: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '1.5rem',
        '& p': {
            color: theme.palette.text.default,
            fontSize: '2rem'
        }
    },
    showChartIcon: {
        fontSize: '2rem',
        color: '#6DF0C2',
        borderBottom: '1px solid #6DF0C2',
        borderLeft: '1px solid #6DF0C2'
    },
    queryIcon: {
        height: '6rem',
        width: '6rem',
        fontSize: '2rem',
        color: '#6DF0C2'
    },
    assignmentIcon: {
        fontSize: '2rem',
        color: '#6DF0C2'
    },
    slideShowIcon: {
        fontSize: '2rem',
        color: '#6DF0C2'
    },
    recommendSolutionCardMain: {
        height: '14rem',
        margin: '0px 1.5rem 1.5rem 1.5rem',
        paddingTop: '1.5rem',
        overflowY: 'scroll'
    },
    recommendSolutionCardMainText: {
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        textAlign: 'center',
        fontWeight: '400',
        marginBottom: '0px',
        marginTop: '1rem'
    },
    recommendSolutionCardMainSubText: {
        fontSize: '1.3rem',
        fontStyle: 'italic',
        color: theme.palette.text.default,
        textAlign: 'center',
        fontWeight: '100',
        marginBottom: '0px',
        marginTop: '1rem'
    },
    contentBoxHeaderIconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'linear-gradient(180deg, #FFA497 0%, #4788D8 100%)',
        width: theme.layoutSpacing(40),
        height: theme.layoutSpacing(40)
    },
    contentBoxHeaderIcon: {
        fontSize: '3rem',
        color: theme.palette.primary.contrastText,
        borderRadius: '50%'
    },
    contentBoxOutputHeaderText: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(24)
    },
    contentBoxOutput: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: '30rem',
        marginTop: '3rem'
    },
    outputSubsectionContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '8rem',
        backgroundColor: themeMode === 'dark' ? '#091F3A' : theme.palette.primary.dark,
        borderRadius: '3px',
        padding: '1.5rem 1.5rem',
        marginTop: '0.5rem'
    },
    feedbackContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '2.5rem'
    },
    feedbackText: {
        color: theme.palette.primary.contrastText,
        padding: '0px',
        margin: '0px',
        fontSize: '1.5rem'
    },
    outputSubsectionRightPartContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        paddingRight: '2rem'
    },
    knowMoreContainer: {
        paddingRight: '3rem'
    },
    knowMore: {
        color: theme.palette.primary.contrastText,
        padding: '0px',
        margin: '0px',
        cursor: 'pointer',
        fontSize: '2rem'
    },
    verticalLine: {
        height: 'inherit',
        minWidth: '0.5rem',
        backgroundColor: '#3A498A',
        borderRadius: '99px'
    },
    openButtonText: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(14),
        lineHeight: theme.layoutSpacing(16.8),
        letterSpacing: theme.layoutSpacing(1)
    },
    openButton: {
        display: 'flex',
        alignItems: 'center',
        border: `0.5px solid ${theme.palette.text.default}`,
        paddingTop: theme.layoutSpacing(8),
        paddingBottom: theme.layoutSpacing(8),
        paddingLeft: theme.layoutSpacing(20),
        paddingRight: theme.layoutSpacing(20),
        borderRadius: '3px',
        width: 'fit-content',
        gap: '1rem',
        cursor: 'pointer'
    }
}));

const json = [
    {
        id: 1,
        input: 'Has Sparklewave met its revenue targets for this month?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: "SparkleWave's revenue performance relative to target", //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q1.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q1w.png',
                knowMoreAppId: 740,
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'Revenue for the month of August is 279 Million, which is 7% lower than the target of 300 Million for SparkleWave.'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'How has SparkleWave performed across various regions this month?',
                query_id: 2 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What is the Channel-wise split of Revenue vs Target of SparkleWave?',
                query_id: 3
            },
            {
                id: 3,
                text: 'What is the competitive landscape for SparkleWave?',
                query_id: 4
            },
            {
                id: 4,
                text: 'What are the trends in the NARTD category?',
                query_id: 5
            }
        ]
    }
];

const newJson = [
    {
        id: 1,
        input: 'Has Sparklewave met its revenue targets for this month?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: "SparkleWave's revenue performance relative to target", //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q1.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q1w.png',
                knowMoreAppId: 740,
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'Revenue for the month of August is 279 Million, which is 7% lower than the target of 300 Million for SparkleWave.'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'How has SparkleWave performed across various regions this month?',
                query_id: 2 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What is the Channel-wise split of Revenue vs Target of SparkleWave?',
                query_id: 3
            },
            {
                id: 3,
                text: 'What is the competitive landscape for SparkleWave?',
                query_id: 4
            },
            {
                id: 4,
                text: 'What are the trends in the NARTD category?',
                query_id: 5
            }
        ]
    },
    {
        id: 2,
        input: 'How has SparkleWave performed across various regions this month?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: "SparkleWave's performance across various regions this month", //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q2.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q2w.png',
                height: '40rem',
                knowMoreAppId: 1230,
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'The company has maintained its strong performance in its largest market, the Northeast region, and has also made inroads into the South and Midwest regions. SparkleWave is still working to grow its sales in the West, but it has made some progress in recent months.'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'What are the reasons for the high sales in the Northeast region?',
                query_id: 6 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What is the Channel-wise split of Revenue vs Target of SparkleWave?',
                query_id: 3
            },
            {
                id: 3,
                text: 'How has SparkleWave performed with respect to the market?',
                query_id: 8
            },
            {
                id: 4,
                text: 'What is the source of the data and when was it last updated?',
                query_id: 7
            }
        ]
    },
    {
        id: 3,
        input: 'What is the Channel-wise split of Revenue vs Target of SparkleWave?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Channel-wise split of Revenue vs Target of SparkleWave', //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q3.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q3w.png',
                height: '45rem',
                knowMoreAppId: 1483,
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'The company exceeded their target sales for on trade and ecommerce, but encountered challenges in the retailers and off trade channels.\n Sparklewave fell short of their Retailer channel revenue target by 27.2%. This is a cause for concern, as retailers are a major source of revenue for the company'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'What is responsible for the gap in Retailer channel?',
                query_id: 12 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What are the unique consumer behaviours in each channel?',
                query_id: 13
            },
            {
                id: 3,
                text: 'What is the competitive landscape for SparkleWave?',
                query_id: 4
            },
            {
                id: 4,
                text: 'How has SparkleWave performed with respect to the market?',
                query_id: 8
            }
        ]
    },
    {
        id: 4,
        input: 'What is the competitive landscape of SparkleWave?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Competitive landscape of SparkleWave', //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q4.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q4w.png',
                height: '50rem',
                knowMoreAppId: 1483,
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'The landscape of Sparklewave is very competitive, with a number of large and well-established companies vying for market share. The values of market share indicate the market is still fragmented.'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'Why is Fruitfusion gaining a larger consumer base?',
                query_id: 9 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What are the factors responsible for driving sales of Sparklewave?',
                query_id: 14
            },
            {
                id: 3,
                text: 'How can Sparklewave reach its target audience effectively?',
                query_id: 15
            },
            {
                id: 4,
                text: 'Are there additional competitor brands that might be of interest?',
                query_id: 16
            }
        ]
    },
    {
        id: 5,
        input: 'What are the trends in the NARTD category?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Trends in the NARTD Category', //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q5.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q5w.png',
                height: '40rem',
                knowMoreAppId: 1483, //#todo
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'The NARTD market is evolving, with plant-based, functional, personalized, and sustainable beverages gaining popularity. These trends are gaining popularity because consumers are looking for more sustainable, ethical, and convenient beverages that can provide health benefits.'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'How many SKUs do we have to cater to these trends?',
                query_id: 17 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'How can Sparklewave reach its target audience effectively?',
                query_id: 15
            },
            {
                id: 3,
                text: 'Idenitify opportunities from our experiements conducted globally',
                query_id: 18
            },
            {
                id: 4,
                text: 'What are the unique consumer behaviours in each channel?',
                query_id: 13
            }
        ]
    },
    {
        id: 6,
        input: 'What are the reasons for the high sales in the Northeast region?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Reasons for high sales in the Northeast region', //Title on answer
                graphData: '',
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q6.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q6w.png',
                height: '50rem',
                knowMoreAppId: 541, //revisit-2
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'The Northeast region is the flagship market for Sparklewave and Fruitfusion. The high sales in this region are attributed to the following factors: high disposable income, popular flavors, youth appeal, high population density, and easy availability.'
            },
            relevantSuggestion: {
                title: 'title'
            },
            recommendedSolutions: [
                {
                    title: 'Promo Planning & Optimization',
                    icon: 'discount_logo',
                    description:
                        'Implement a reduction in in-store promotional activities and discount offerings within the Northeast region',
                    value: 'The Northeast region, characterized by a sizable population and substantial disposable income, presents an opportunity to optimize promotional expenditures',
                    app_id: 1487
                },
                {
                    title: 'Price Point Optimization', //Title
                    icon: 'pricing_logo', //Icon
                    description:
                        'The Northeast region demonstrates a potential avenue for price adjustments',
                    value: 'The willingness-to-pay score among consumers in the Northeast region signals a favorable context for implementing increase in price',
                    app_id: 1236 //App to redirect
                }
                // {
                //     title: 'Price Analyzer',
                //     icon: 'pricing_logo',
                //     description: '',
                //     value: '',
                //     app_id: 1525
                // }
            ]
        },
        suggestions: [
            //Suggestions
            {
                id: 4,
                text: 'What promotion strategies are currently in place for shaping the future of SparkleWave?',
                query_id: 19 //Unique Query(Question-Answer) ID
            },
            {
                id: 3,
                text: 'What are my profit margins for my top 5 SKUs?',
                query_id: 20
            },
            {
                id: 1,
                text: 'What is the Channel-wise split of Revenue vs Target of SparkleWave?',
                query_id: 3
            },
            {
                id: 2,
                text: 'What opportunities can be pursued from global experimentation initiatives?',
                query_id: 18
            }
        ]
    },
    {
        id: 7,
        input: 'What is the source of the data and when was it last updated?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Data Source and Last Update Date', //Title on answer
                graphData: '',
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q7.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q7w.png',
                knowMoreAppId: 1538, //Data scout
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: "The data powering the previous graph is from the table called 'SparkleWave _Data_MasterTable' and it was last updated on 22nd August 2023."
            },
            relevantSuggestion: {
                title: 'title'
            },
            recommendedSolutions: [
                {
                    title: 'Data Scout', //Title
                    icon: 'pricing_logo', //Icon
                    description: 'To get more information about the data and theor lineage',
                    value: 'Contains additonal data sources that you can raise access for to enrich your insights',
                    app_id: 1538
                },
                {
                    title: 'Data Quality management',
                    icon: 'discount_logo',
                    description:
                        'To add any additional business rules to keep an eye on the quality of the Data',
                    value: "Since insights are derived from available data, it's advantageous to focus on data quality to ensure accurate and valuable insights are produced",
                    app_id: 1523
                }
                // {
                //     title: 'Data Lineage',
                //     icon: 'pricing_logo',
                //     description: '',
                //     value: '',
                //     app_id: 1525
                // }
            ]
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'When can we expect the next data update?',
                query_id: 22 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What are the unique consumer behaviours in each channel?',
                query_id: 13
            },
            {
                id: 3,
                text: 'What is the competitive landscape for SparkleWave?',
                query_id: 4
            },
            {
                id: 4,
                text: 'How has SparkleWave performed with respect to the market?',
                query_id: 8
            }
        ]
    },
    {
        id: 8,
        input: 'How has SparkleWave performed with respect to the market?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: "SparkleWave's performance with respect to the market", //Title on answer
                // graphData: '',
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q8.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q8w.png',
                height: '50rem',
                knowMoreAppId: 1525, //revisit
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'SparkleWave is in the top 10 players in the US NARTD beverages market, but still a relatively smaller player with 3% of market share. The US NATRD beverages market is large and growing with the Market size of $167 Billion driven by a number of factors. SparkleWave has a strong brand reputation, competitive prices, and an expanding distribution network. SparkleWave has shown a steady growth over the last few months but it has been slower than expected'
            },
            relevantSuggestion: {
                title: 'title'
            },
            recommendedSolutions: [
                {
                    title: 'Promo Planning & Optimization',
                    icon: 'discount_logo',
                    description:
                        'Update Sparklewaves promo calendar to synchronize with FruitFusion',
                    value: 'SparkleWave is showing signs of being cannibalized by Fruitfusion, It will be benifical to align activities',
                    app_id: 1487
                },
                {
                    title: 'Assortment Optimizer', //Title
                    icon: 'assortment_planner', //Icon
                    description:
                        'Push the Single serve variants in Retailer & Off-trade channels. Delist introduction of new 4 pack can',
                    value: 'Consumers preference to buy single serve packs at Retailers & Off-trade channels have become higher in the last 7 weeks',
                    app_id: 472 //App to redirect
                },
                {
                    title: 'BPPC Analysis',
                    icon: 'integration_demand',
                    description: 'Develop a zero calorie SparkleWave beverage',
                    value: 'Trends from SALT are signaling that consumers are looking for healthier options to consume',
                    app_id: 1483
                }
            ]
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'Why is Fruitfusion gaining a larger consumer base?',
                query_id: 9
            },
            {
                id: 2,
                text: 'How has the consumer behavior for my category changed?',
                query_id: 10
            },
            {
                id: 3,
                text: 'What is the remaining unallocated budget?',
                query_id: 11
            },
            {
                id: 4,
                text: 'What is the performance of all retailers compared to their targets this month?',
                query_id: 21
            }
        ]
    },
    {
        id: 9,
        input: 'Why is Fruitfusion gaining a larger consumer base?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Reason Fruitfusion is gaining a larger consumer base', //Title on answer
                graphData: '',
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q9.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q9w.png',
                height: '50rem',
                knowMoreAppId: 1483, //revisit
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'Diet Fruitfusion is of great appeal to the consumers. It accounts for 40% of Fruitfusion sales. Fruitfusion is offereing in-store discounts that makes it pocket friendly'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'How has the consumer behaviour for my category changed?',
                query_id: 10 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What are the trends in the NARTD category?',
                query_id: 5
            },
            {
                id: 3,
                text: 'What is the Channel-wise split of Revenue vs Target of SparkleWave?',
                query_id: 3
            },
            {
                id: 4,
                text: 'What are the factors responsible for driving the sales of Sparklewave?',
                query_id: 14
            }
        ]
    },
    {
        id: 10,
        input: 'How has the consumer behavior for my category changed?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Consumer behaviour for my category', //Title on answer
                graphData: '',
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q10.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q10w.png',
                height: '42rem',
                knowMoreAppId: 1204,
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'Consumers are becoming more health-conscious and demanding more convenience. They are also becoming more discerning and looking for value. Additionally, they are influenced by social media. '
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'What are the unique consumer behaviours in each channel?',
                query_id: 13 //Unique Query(Question-Answer) ID
            },
            {
                id: 4,
                text: 'What are the reasons for the high sales in the Northeast region?',
                query_id: 6
            },
            {
                id: 3,
                text: 'How can Sparklewave reach its target audience effectively?',
                query_id: 15
            },
            {
                id: 2,
                text: 'What are the factors responsible for driving the sales of Sparklewave?',
                query_id: 14
            }
        ]
    },
    {
        id: 11,
        input: 'What is the remaining unallocated budget?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Unallocated budget remaining', //Title on answer
                graphData: '',
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q11.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q11w.png',
                knowMoreAppId: 256, //revisit
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'You have a budget of $1.3 Million remaining unallocated, which is 29% of your budget of $4.5 Million'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'What are my profit margins for my top 5 SKUs?',
                query_id: 20 //Unique Query(Question-Answer) ID
            },
            {
                id: 4,
                text: 'Idenitify opportunities from our experiements conducted globally?',
                query_id: 18
            },
            {
                id: 3,
                text: 'How can Sparklewave reach its target audience effectively?',
                query_id: 15
            },
            {
                id: 2,
                text: 'What are the factors responsible for driving the sales of Sparklewave?',
                query_id: 14
            }
        ]
    },
    {
        id: 12,
        input: 'What is responsible for the gap in Retailer channel?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Analyzing factors contributing to the gap in the Retailer channel', //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q12.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q12w.png',
                height: '38rem',
                knowMoreAppId: 1492, //revisit, now plano 1276
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'Walcart achieved 58% ($18M) of its $31M target and also lagged at planogram campliance. A rising demand for single serve packs noted. Sparklewave shows signs of cannibalization by Fruitfusion.'
            },
            relevantSuggestion: {
                title: 'title'
            },
            recommendedSolutions: [
                {
                    title: 'Promo Planning & Optimization',
                    icon: 'discount_logo',
                    description:
                        'Update Sparklewaves promo calendar to synchronize with FruitFusion',
                    value: 'SparkleWave is showing signs of being cannibalized by Fruitfusion, It will be benifical to align activities',
                    app_id: 1487
                },
                {
                    title: 'Planogram Compliance', //Title
                    icon: 'assortment_planner', //Icon
                    description: 'Impose penalties on non-compliant retailers',
                    value: 'Deepdive into Planogram effectiveness, compliance and revise the ideal planogram to enhance effectiveness',
                    app_id: 1492 //App to redirect
                },
                {
                    title: 'Markdown/Price Promo Effectiveness',
                    icon: 'discount_logo',
                    description: 'Deep dive into the effectiveness of your instore promotions',
                    value: "Sparklewave's promo effectiveness has gone down at Walcart as Fruitfusion is running EDLP",
                    app_id: 1276
                }
            ]
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'What is the performance status of all retailers compared to their targets this month?',
                query_id: 21 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What are the unique consumer behaviours in each channel?',
                query_id: 13
            },
            {
                id: 3,
                text: 'What is the planogram compliance score of Walcart?',
                query_id: 24
            },
            {
                id: 4,
                text: 'What are the reasons that Sparklewave is being cannibalized by Fruitfusion?',
                query_id: 8
            }
        ]
    },
    {
        id: 13,
        input: 'What are the unique consumer behaviours in each channel?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Channel-wise unique consumer behaviour', //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q13.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q13w.png',
                height: '38rem',
                knowMoreAppId: 1483, // revisit - insights to app
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'Sparklewave consumers are impulse buyers who tend to buy in bulk and are loyal to the brand. They consume Sparklewave more in the evenings and nights, and in social settings. Businesses should focus on impulse marketing, make Sparklewave easily available in bulk, and promote it as a social drink'
            },
            relevantSuggestion: {
                title: 'title'
            },
            recommendedSolutions: [
                {
                    title: 'Creative Ad Effectiveness Tool',
                    icon: 'marketing_media',
                    description: 'Create a new digital ad targeting impulse buyers',
                    value: "SparkleWave's target consumers are teenagers and young adults. So marketing it digitally would be highly effective",
                    app_id: 1521
                },
                {
                    title: 'Distribution Planner', //Title
                    icon: 'assortment_planner', //Icon
                    description: 'Push 6 pack of Sparklewave on ecommerce channels',
                    value: 'Allocating bulk pack SKUs on ecommerce channels will help us to effectively enable users to impulse buy in bulk',
                    app_id: 487 //App to redirect
                },
                {
                    title: 'Custom Audience',
                    icon: 'marketing_media',
                    description: 'Acivate new campaigns to target impulse buyers',
                    value: "Sparklewave's sales show that 34% of customers are impulse buyer and are a good segment to target",
                    app_id: 1276
                }
            ]
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'What is the performance status of all retailers compared to their targets this month?',
                query_id: 21 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What is the competitive landscape of SparkleWave?',
                query_id: 4
            },
            {
                id: 3,
                text: 'What is happening at Walcart?',
                query_id: 23
            },
            {
                id: 4,
                text: 'How has SparkleWave performed with respect to the market?',
                query_id: 8
            }
        ]
    },
    {
        id: 14,
        input: 'What are the factors responsible for driving the sales of Sparklewave?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'factors responsible for Sparklewave sales', //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q14.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q14w.png',
                height: '60rem',
                knowMoreAppId: 1455,
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'Socioeconomic changes like inflation have caused a drop in revenue. While stockup and marketing have been extremely effective'
            },
            relevantSuggestion: {
                title: 'title'
            },
            recommendedSolutions: [
                {
                    title: 'Creative Ad Effectiveness Tool',
                    icon: 'marketing_media',
                    description: 'Create a new digital ad targeting impulse buyers',
                    value: "SparkleWave's target consumers are teenagers and young adults. So marketing it digitally would be highly effective",
                    app_id: 1521
                },
                {
                    title: 'Promo Planning & Optimization',
                    icon: 'discount_logo',
                    description:
                        'Implement an increase in in-store promotional activities within the West region',
                    value: 'Saving  West region, presents an opportunity to optimize promotional expenditures to improve sales',
                    app_id: 1487
                },
                {
                    title: 'Price Point Optimization', //Title
                    icon: 'pricing_logo', //Icon
                    description: 'Hold off on deploying the new price list',
                    value: 'Price gap between competitors presents a need to hold off on the deployement of the new price list planned for next quarter',
                    app_id: 1236 //App to redirect
                }
            ]
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'How can Sparklewave reach its target audience effectively?',
                query_id: 15 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'Identify opportunities from our experiments conducted globally?',
                query_id: 18
            },
            {
                id: 3,
                text: 'What has been the average $/L value of Sparklewave over the last 3 years?',
                query_id: 25
            },
            {
                id: 4,
                text: 'How can I improve instore executions?',
                query_id: 26
            }
        ]
    },
    {
        id: 15,
        input: 'How can Sparklewave reach its target audience effectively?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Ways Sparklewave can reach its audience effectively', //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q15.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q15w.png',
                height: '40rem',
                width: '100%',
                knowMoreAppId: 1215,
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'To enhance its reach to the target audience, Sparklewave could execute impactful digital media campaigns during events'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'How can Sparklewave reach its target audience effectively?',
                query_id: 15 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'Identify opportunities from our experiments conducted globally?',
                query_id: 18
            },
            {
                id: 3,
                text: 'What has been the average $/L value of Sparklewave over the last 3 years?',
                query_id: 25
            },
            {
                id: 4,
                text: 'How can I improve instore executions?',
                query_id: 26
            }
        ]
    },
    {
        id: 21,
        input: 'What is the performance status of all retailers compared to their targets this month?', //Question
        output: {
            //Answer
            type: 'text',
            data: {
                title: 'Retailer performance for this month', //Title on answer
                image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q21.png', //Image of answer
                imageLight:
                    'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q21w.png',
                height: '50rem',
                knowMoreAppId: 1276,
                hintInfo: '' //Question Mark Icon
            },
            summary: {
                //Summary
                text: 'Sparklewave consumers are impulse buyers who tend to buy in bulk and are loyal to the brand. They consume Sparklewave more in the evenings and nights, and in social settings. Businesses should focus on impulse marketing, make Sparklewave easily available in bulk, and promote it as a social drink'
            },
            relevantSuggestion: {
                title: 'title'
            }
        },
        suggestions: [
            //Suggestions
            {
                id: 1,
                text: 'What is the performance status of all retailers compared to their targets this month?',
                query_id: 21 //Unique Query(Question-Answer) ID
            },
            {
                id: 2,
                text: 'What are the unique consumer behaviours in each channel?',
                query_id: 13
            },
            {
                id: 3,
                text: 'What is happening at Walcart?',
                query_id: 23
            },
            {
                id: 4,
                text: 'How has SparkleWave performed with respect to the market?',
                query_id: 8
            }
        ]
    }
];

const getLogo = (id, classes) => {
    //Conditionally Returning Icon
    switch (id) {
        case 'assortment_planner':
            return (
                <img
                    src={AssortmentPlanningLogo}
                    className={classes.queryIcon}
                    alt="assortment planning logo"
                />
            );
        case 'integration_demand':
            return (
                <img
                    src={IntegrationDemandPlannerLogo}
                    className={classes.queryIcon}
                    alt="integration demand planner logo"
                />
            );
        case 'marketing_media':
            return (
                <img
                    src={MarketingMediaPlannerLogo}
                    className={classes.queryIcon}
                    alt="mareting media planner logo"
                />
            );
        case 'recommendation':
            return (
                <img
                    src={RecommendationIcon}
                    className={classes.queryIcon}
                    alt="recomendation icon"
                />
            );
        case 'pricing_logo':
            return <img src={PricingLogo} className={classes.queryIcon} alt="pricing logo" />;
        case 'discount_logo':
            return <img src={DiscountLogo} className={classes.queryIcon} alt="discount logo" />;
        default:
            return <ShowChartIcon className={classes.showChartIcon} />;
    }
};

function QueryOutput({
    // appId,
    // minervaAppId,
    chatPopperView,
    queriesFromParent,
    handleTotalQueries,
    selectedChatID,
    showPeriod,
    navigateToMinervaDashboard,
    ...props
}) {
    const classes = useStyles();

    const [queries, setQueries] = React.useState([]);

    const [scrollQueryID, setScrollQueryID] = React.useState(null);

    const addNewQuery = (obj) => {
        let newQuery = newJson.find((o) => o.id === obj.query_id);
        if (newQuery) {
            setTimeout(() => {
                setQueries([...queries, newQuery]);
                setScrollQueryID(newQuery.id);
                handleTotalQueries([...queries, newQuery]);
            }, 1000);
        }
    };

    useEffect(() => {
        // if (queries !== json) {
        setTimeout(() => {
            const id = scrollQueryID;
            const element = document.getElementById(id);
            if (element) {
                element?.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, 200);
        // }
    }, [scrollQueryID]);

    useEffect(() => {
        if (queriesFromParent !== undefined) {
            if (Object.keys(queriesFromParent).length !== 0) {
                setQueries([...queries, queriesFromParent]);
                setScrollQueryID(queriesFromParent.id);
                if (handleTotalQueries !== undefined)
                    handleTotalQueries([...queries, queriesFromParent]);
            }
        }
    }, [queriesFromParent]);

    useEffect(() => {
        setQueries(json);
        if (handleTotalQueries !== undefined) handleTotalQueries(json);
    }, []);

    useEffect(() => {
        if (selectedChatID !== undefined) {
            setScrollQueryID(selectedChatID);
        }
    }, [selectedChatID]);

    return (
        <div className={clsx(classes.queryOutputRoot, chatPopperView && classes.chatPopperView)}>
            {showPeriod && (
                <div className={classes.periodContainer}>
                    <div className={classes.periodBox}>
                        <Typography className={classes.periodText}>Today</Typography>
                    </div>
                </div>
            )}
            <div className={classes.chatContentContainer}>
                {queries?.map((query, index) => (
                    <div className={classes.queryContainer} id={query.id} key={query.id + index}>
                        <Query
                            query={query}
                            is_last_element={queries.length === index + 1}
                            classes={classes}
                            addNewQueryFromParent={addNewQuery}
                            navigate={navigateToMinervaDashboard}
                            {...props}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function Query({ query, /*is_last_element, addNewQueryFromParent,*/ classes, navigate, ...props }) {
    return (
        <React.Fragment>
            {query?.output?.data && (
                <ContentBox
                    params={query}
                    classes={classes}
                    configuration={{ type: 'output' }}
                    navigate={navigate}
                />
            )}

            {query?.output?.summary && (
                <ContentBox params={query} classes={classes} configuration={{ type: 'summary' }} />
            )}

            {query?.output?.recommendedSolutions && (
                <ContentBox
                    params={query}
                    classes={classes}
                    configuration={{ type: 'recommendedSolution' }}
                    {...props}
                />
            )}

            {/* {query?.suggestions && is_last_element && (
                <ContentBox
                    params={query}
                    classes={classes}
                    configuration={{ type: 'suggestion' }}
                    addNewQueryFromParent={addNewQueryFromParent}
                />
            )} */}
        </React.Fragment>
    );
}

function ContentBox({
    params,
    classes,
    configuration,
    /*addNewQueryFromParent,*/ navigate,
    ...props
}) {
    switch (configuration?.type) {
        // case 'summary':
        //     return <SummaryBox params={params} classes={classes} configuration={configuration} />;
        case 'recommendedSolution':
            return (
                <RecommendedSolutionBox
                    params={params}
                    classes={classes}
                    configuration={configuration}
                    {...props}
                />
            );
        case 'output':
            return (
                <OutputBox
                    params={params}
                    classes={classes}
                    configuration={configuration}
                    navigate={navigate}
                />
            );
        // case 'suggestion':
        //     return (
        //         <SuggestionBox
        //             params={params}
        //             classes={classes}
        //             configuration={configuration}
        //             addNewQueryFromParent={addNewQueryFromParent}
        //         />
        //     );
        default:
            return <div></div>;
    }
}

// function SuggestionBox({ params, classes, addNewQueryFromParent }) {
//     const [collapse, setCollapse] = React.useState(false);

//     const handleCollapse = (value) => {
//         setCollapse(value);
//     };

//     const handleSuggestionClick = (obj) => {
//         addNewQueryFromParent(obj);
//     };

//     return (
//         <React.Fragment>
//             <div className={classes.contentBoxSuggestion}>
//                 {!collapse ? (
//                     <div className={classes.contentBoxSuggestionHeader}>
//                         <div className={classes.suggestionActionButton}>
//                             <RefreshIcon className={classes.suggestionActionButtonIcon} />
//                         </div>
//                         <div className={classes.suggestionActionButton}>
//                             <RemoveIcon
//                                 className={classes.suggestionActionButtonIcon}
//                                 onClick={() => handleCollapse(true)}
//                             />
//                         </div>
//                     </div>
//                 ) : (
//                     <div className={classes.contentBoxSuggestionHeader}>
//                         <div
//                             className={classes.recommendationButtonContainer}
//                             onClick={() => handleCollapse(false)}
//                         >
//                             <img src={RecommendationIcon} alt="recommendation icon" />
//                             <p>Recommendations</p>
//                         </div>
//                     </div>
//                 )}
//                 {/* {!collapse && (
//                     <div className={classes.contentBoxSuggestionMain}>
//                         <Grid className={classes.suggestionOptionContainer} container spacing={2}>
//                             {params?.suggestions &&
//                                 params.suggestions.map((suggestion, index) => (
//                                     <Grid item xs={6} md={6} key={suggestion.id + ' ' + index}>
//                                         <div
//                                             className={classes.suggestionOption}
//                                             onClick={() => handleSuggestionClick(suggestion)}
//                                         >
//                                             <p>{suggestion.text}</p>
//                                         </div>
//                                     </Grid>
//                                 ))}
//                         </Grid>
//                     </div>
//                 )} */}
//             </div>
//         </React.Fragment>
//     );
// }

function OutputBox({ params, classes, navigate }) {
    const themeMode = localStorage.getItem('codx-products-theme');

    const getImage = (obj) => {
        if (obj?.output?.data?.image || obj?.output?.data?.imageLight) {
            if (themeMode === 'dark') {
                return obj?.output?.data?.image;
            } else {
                return obj?.output?.data?.imageLight;
            }
        }
        return outputImage;
    };

    const handleKnowMore = () => {
        if (params?.output?.data?.knowMoreAppId) {
            window.open(`${window.location.origin}/app/${params.output.data.knowMoreAppId}`);
        }
    };

    return (
        <React.Fragment>
            {params?.input && (
                <div className={classes.contentBoxQuestionContainer}>
                    <div className={classes.questionUserIconContainer}>
                        <ProfileIcon />
                    </div>
                    <div className={classes.questionTextContainer}>
                        <p>{params.input}</p>
                    </div>
                </div>
            )}
            <div className={classes.contentBox}>
                <div className={classes.contentBoxHeaderContainer}>
                    <div className={classes.contentBoxOutputHeader}>
                        <div className={classes.contentBoxHeaderIconContainer}>
                            <QueryIcon />
                        </div>
                        <div className={classes.contentBoxOutputHeaderText}>
                            <p className={classes.contentBoxHeader}>
                                {params?.output?.data?.title ? params.output.data.title : ''}
                            </p>
                            <div className={classes.openButton} onClick={navigate}>
                                <ExpandIcon />
                                <Typography className={classes.openButtonText}>
                                    {' '}
                                    Open Visual Result
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.contentBoxMainContainer}>
                    <div
                        className={classes.contentBoxOutput}
                        style={{
                            height: params?.output?.data?.height ? params.output.data.height : ''
                        }}
                    >
                        <img
                            style={{
                                width: params?.output?.data?.width ? params.output.data.width : ''
                            }}
                            src={getImage(params)}
                            alt="Output Image"
                        />
                    </div>
                </div>
            </div>
            <div className={classes.outputSubsectionContainer}>
                <div className={classes.feedbackContainer}>
                    <Feedback classes={classes} />
                    <p className={classes.feedbackText}>Was this helpful</p>
                </div>
                <div className={classes.outputSubsectionRightPartContainer}>
                    <div className={classes.knowMoreContainer}>
                        <p className={classes.knowMore} onClick={handleKnowMore}>
                            Know More
                        </p>
                    </div>
                    <div className={classes.hintPopperContainer}>
                        <OutputHintPopper
                            popoverInfo={
                                params?.output?.data?.hintInfo ? params.output.data.hintInfo : ''
                            }
                            classes={classes}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

// function SummaryBox({ params, classes }) {
//     return (
//         <React.Fragment>
//             <div className={classes.contentBox}>
//                 <div className={classes.contentBoxHeaderContainer}>
//                     <p className={classes.contentBoxHeader}>Summary :</p>
//                 </div>
//                 <div className={classes.contentBoxMainContainerSummary}>
//                     <div className={classes.contentBoxSummury}>
//                         <div className={classes.verticalLine}></div>
//                         <div className={classes.contentBoxSummuryText}>
//                             <p className={classes.summaryText}>
//                                 {params?.output?.summary?.text ? params.output.summary.text : ''}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </React.Fragment>
//     );
// }

function RecommendedSolutionBox({ params, classes }) {
    const handleClick = (obj) => {
        if (obj?.app_id) {
            window.open(`${window.location.origin}/app/${obj.app_id}`);
        }
    };

    const handleNumberToWords = (num) => {
        switch (num) {
            case 1:
                return 'one';
            case 2:
                return 'two';
            case 3:
                return 'three';
            default:
                return num;
        }
    };

    return (
        <React.Fragment>
            <div className={classes.contentBox}>
                <div className={classes.contentBoxHeaderContainer}>
                    <p className={classes.contentBoxHeader}>Recommended Solutions :</p>
                </div>
                <div className={classes.contentBoxMainContainer}>
                    <div className={classes.contentBoxRecommendSolution}>
                        <div className={classes.verticalLine}></div>
                        {params?.output?.recommendedSolutions && (
                            <div className={classes.contentBoxRecommendSolutionContent}>
                                <p className={classes.recommendSolutionHeader}>
                                    {`Here are ${handleNumberToWords(
                                        params.output.recommendedSolutions.length
                                    )} solutions that would be helpful`}
                                </p>
                                <div className={classes.recommendSolution}>
                                    {params.output.recommendedSolutions.map((element, index) => (
                                        <div
                                            className={classes.recommendSolutionCard}
                                            key={element.title + index}
                                            onClick={() => handleClick(element)}
                                        >
                                            <div className={classes.recommendSolutionCardHeader}>
                                                <div
                                                    className={
                                                        classes.recommendSolutionCardHeaderIconContainer
                                                    }
                                                >
                                                    {/* <div className={classes.recommendSolutionCardHeaderIconRoundShape}> */}
                                                    {element.icon ? (
                                                        getLogo(element.icon, classes)
                                                    ) : (
                                                        <ShowChartIcon
                                                            className={classes.showChartIcon}
                                                        />
                                                    )}
                                                    {/* </div> */}
                                                </div>
                                                <div
                                                    className={
                                                        classes.recommendSolutionCardHeaderText
                                                    }
                                                >
                                                    <p>{element.title ? element.title : ''}</p>
                                                </div>
                                            </div>
                                            <div className={classes.recommendSolutionCardMain}>
                                                <p
                                                    className={
                                                        classes.recommendSolutionCardMainText
                                                    }
                                                >
                                                    {element.description ? element.description : ''}
                                                </p>
                                                <p
                                                    className={
                                                        classes.recommendSolutionCardMainSubText
                                                    }
                                                >
                                                    {element.value ? element.value : ''}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function OutputHintPopper({ popoverInfo, classes }) {
    return (
        <InfoPopper
            Img={() => <HelpOutlineIcon fontSize="large" />}
            popOverInfo={popoverInfo}
            classes={{
                popperContent: classes.sqlPopperContent,
                title: classes.sqlTitle,
                desc: classes.sqlDesc,
                triggerButton: classes.outputToolbarItem
            }}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
        />
    );
}

// function EmptyState({ chatPopperView, classes }) {
//     const { user } = useContext(AuthContext);
//     const text = `Hi ${
//         user?.first_name || user?.last_name
//     }! Ask questions to get insights about your data.`;
//     return (
//         <div className={classes.emptyStateRoot}>
//             <MinervaLogo />
//             <Typography variant="h4" align="center">
//                 {chatPopperView ? text : <TypingAnimation enableCaret text={text} />}
//             </Typography>
//         </div>
//     );
// }

// function ReasultLoadingSkeleton() {
//     return (
//         <div style={{ padding: '0 1rem' }}>
//             <Typography variant="h3">
//                 <Skeleton variant="text" />
//             </Typography>
//             <Skeleton style={{ borderRadius: '1rem' }} variant="rect" height="20rem" width="100%" />
//             <Typography variant="h3">
//                 <Skeleton variant="text" />
//             </Typography>
//             <Typography variant="h3" gutterBottom>
//                 <Skeleton variant="text" />
//             </Typography>
//         </div>
//     );
// }

function Feedback({ classes }) {
    const [feedback, setFeedback] = useState(0);
    const handleFeedback = (like) => {
        setFeedback(feedback === like ? 0 : like);
    };
    return (
        <div className={classes.feedback}>
            <IconButton
                size="small"
                title="like"
                className={feedback === 1 ? classes.active : null}
                onClick={() => {
                    handleFeedback(1);
                }}
            >
                <ThumbUpAltIcon fontSize="large" />
            </IconButton>
            <IconButton
                size="small"
                title="dislike"
                className={feedback === -1 ? classes.active : null}
                onClick={() => {
                    handleFeedback(-1);
                }}
            >
                <ThumbDownIcon fontSize="large" />
            </IconButton>
        </div>
    );
}

export default withRouter(QueryOutput);
