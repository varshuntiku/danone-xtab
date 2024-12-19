import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import DataSetCard from './DatasetCard';
import { ReactComponent as DataBaseIcon } from '../../../assets/img/DS-Database.svg';
import { ReactComponent as DataBaseIconLight } from '../../../assets/img/DS-Database-Light.svg';
import ArrowDownwardOutlined from '@material-ui/icons/KeyboardArrowDown';

const DatasetContainer = (props) => {
    const darkTheme = localStorage.getItem('codx-products-theme') == 'dark';
    const useStyles = makeStyles((theme) => ({
        datasetsHolder: {
            paddingBottom: '2rem',
            background: darkTheme ? '#0C2744' : '#F6F6F6',
            height: props?.height || '50vh',
            overflow: 'scroll',
            '&::-webkit-scrollbar-corner': {
                color: 'transparent'
            },
            '&::-webkit-scrollbar-track': {
                marginTop: '10px'
            }
        },
        datasetContainer: {
            width: '100%',
            padding: '2rem 2rem 0rem 8rem'
        },
        datasetResultsContainer: {
            width: '100%',
            padding: '2rem 2rem 1rem 8rem',
            background: darkTheme ? '#0C2744' : '#F6F6F6',
            height: '80%'
        },
        datasetHeading: {
            display: 'flex',
            whiteSpace: 'nowrap',
            alignItems: 'center',
            gap: '1.5rem',
            color: darkTheme ? theme.palette.text.default : '#102437',
            fontSize: '2.5rem',
            fontWeight: 600,
            marginRight: '8rem',
            lineHeight: '30px'
        },
        datasetHeadingIcon: {
            height: '2.75rem',
            width: '2.75rem'
        },
        datasetCardsContainer: {
            flexWrap: 'wrap',
            gap: '2rem',
            height: '100%'
        },
        datasetCard: {
            borderRadius: '8px',
            border: `1px solid ${darkTheme ? '#091F3A' : '#D3D8EA'}`,
            opacity: 0.94,
            background: darkTheme ? '#091F3A' : '#fff',
            height: 'fit-content',

            padding: '1rem',
            cursor: 'pointer',
            flex: 1,
            '&:focus': {
                background: '#F3F6FF'
            },
            minWidth: '35rem',
            maxWidth: '33%'
        },
        viewAll: {
            color: theme.palette.text.contrastText,
            fontWeight: 600,
            textDecorationLine: 'underline',
            fontSize: '2rem',
            marginLeft: 'auto',
            whiteSpace: 'nowrap'
        },
        sortBy: {
            width: '15rem',
            borderRadius: '22px',
            border: `1px dashed ${
                darkTheme ? 'rgba(200, 200, 200, 0.80)' : 'rgba(14, 31, 56, 0.80)'
            }`,
            fontSize: '2rem',
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
            color: darkTheme ? theme.palette.text.default : 'rgba(14, 31, 56, 0.80)',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 400,
            padding: '0.25rem 1rem',
            alignItems: 'center'
        },
        sortIcon: {
            height: '2rem',
            width: '2rem'
        }
    }));
    const classes = useStyles();
    const resultData = props.resultData;
    const data = props.data;
    const dataCardClick = (val, index) => {
        props.setDataPage(val);
        props.setDataIndex(index);
    };

    return (
        <div className={classes.datasetsHolder}>
            {props?.bookmarks ? (
                <div className={classes.datasetResultsContainer}>
                    <Grid container className={classes.datasetCardsContainer}>
                        {!resultData
                            ? data.allData.map(
                                  (val, key) =>
                                      val?.bookmark && (
                                          <Grid
                                              item
                                              className={classes.datasetCard}
                                              key={`resultData${key}`}
                                              onClick={() => dataCardClick(val, key)}
                                          >
                                              <DataSetCard
                                                  data={val}
                                                  obj={data}
                                                  index={key}
                                                  setData={props.setData}
                                              />
                                          </Grid>
                                      )
                              )
                            : resultData.map(
                                  (val, key) =>
                                      val?.bookmark && (
                                          <Grid
                                              item
                                              className={classes.datasetCard}
                                              key={`resultData${key}`}
                                              onClick={() => dataCardClick(val, key)}
                                          >
                                              <DataSetCard
                                                  data={val}
                                                  obj={data}
                                                  index={key}
                                                  setData={props.setData}
                                              />
                                          </Grid>
                                      )
                              )}
                    </Grid>
                </div>
            ) : null}
            {!props?.bookmarks && resultData && (
                <div className={classes.datasetResultsContainer}>
                    <div className={classes.datasetHeading}>{resultData.length} results found</div>
                    <Grid container className={classes.datasetCardsContainer}>
                        {resultData.map((val, key) => (
                            <Grid
                                item
                                className={classes.datasetCard}
                                key={`resultData${key}`}
                                onClick={() => dataCardClick(val, key)}
                            >
                                <DataSetCard
                                    data={val}
                                    obj={data}
                                    index={key}
                                    setData={props.setData}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
            {!props?.bookmarks && !resultData && (
                <React.Fragment>
                    {data.allData.length > 0 && (
                        <div className={classes.datasetContainer}>
                            <div className={classes.datasetHeading}>
                                <TimelineOutlinedIcon className={classes.datasetHeadingIcon} />{' '}
                                Trending Datasets
                                <Typography className={classes.viewAll}>View All</Typography>
                            </div>
                            <Grid container className={classes.datasetCardsContainer}>
                                {data.allData.map(
                                    (val, key) =>
                                        val?.trending && (
                                            <Grid
                                                item
                                                className={classes.datasetCard}
                                                key={`trendingData${key}`}
                                                onClick={() => dataCardClick(val, key)}
                                            >
                                                <DataSetCard
                                                    data={val}
                                                    obj={data}
                                                    index={key}
                                                    setData={props.setData}
                                                />
                                            </Grid>
                                        )
                                )}
                            </Grid>
                        </div>
                    )}
                    {data.allData.length > 0 && (
                        <div className={classes.datasetContainer}>
                            <div className={classes.datasetHeading}>
                                {darkTheme ? (
                                    <DataBaseIconLight className={classes.datasetHeadingIcon} />
                                ) : (
                                    <DataBaseIcon className={classes.datasetHeadingIcon} />
                                )}{' '}
                                All Datasets
                                <Typography className={classes.sortBy}>
                                    Sort By <ArrowDownwardOutlined className={classes.sortIcon} />
                                </Typography>
                            </div>
                            <Grid container className={classes.datasetCardsContainer}>
                                {data.allData.map((val, key) => (
                                    <Grid
                                        item
                                        className={classes.datasetCard}
                                        key={`allData${key}`}
                                        onClick={() => dataCardClick(val, key)}
                                    >
                                        <DataSetCard
                                            data={val}
                                            obj={data}
                                            index={key}
                                            setData={props.setData}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default DatasetContainer;
