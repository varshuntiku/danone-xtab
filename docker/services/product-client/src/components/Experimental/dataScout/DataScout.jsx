import React, { useEffect, useState } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import FilterListOutlined from '@material-ui/icons/FilterListOutlined';
import DataSetPage from './DataSetPage';
import LinearBackground from '../../../assets/img/DS-Light-theme-bg.svg';
import DatasetContainer from './DatasetContainer';
import DarkBackground from '../../../assets/img/DS-Dark-theme-bg.svg';
import BookMarks from './BookMarks';
import Filter from './Filter';
import Downloads from './Downloads';

const darkTheme = localStorage.getItem('codx-products-theme') == 'dark';
const useStyles = makeStyles((theme) => ({
    rootContainer: {
        color: theme.palette.text.default,
        marginTop: 0,
        height: '100%',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '21px',
        fontSize: '2rem',
        overflow: 'scroll',
        '&::-webkit-scrollbar-corner': {
            color: 'transparent'
        }
    },
    searchBoxContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        backgroundImage: darkTheme ? `url(${DarkBackground})` : `url(${LinearBackground})`,
        paddingBottom: '3rem'
    },
    resultBoxContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        background: darkTheme ? '#0C2744' : '#F6F6F6',
        paddingBottom: '3rem'
    },
    title: {
        color: theme.palette.text.default,
        fontSize: '3.5rem',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 'normal',
        marginTop: '1rem'
    },
    promptContainer: {
        display: 'flex',
        position: 'relative',
        width: '50vw',
        minHeight: '6rem',
        background: darkTheme ? 'rgba(255, 255, 255, 0.10)' : '#fff',
        border: `1px solid ${darkTheme ? 'rgba(255, 255, 255, 0.10)' : '#fff'}`,
        borderRadius: '2px',
        alignItems: 'center',
        marginTop: '2rem'
    },
    inputField: {
        minWidth: '95%',
        paddingLeft: '2rem',
        width: 'auto',
        fontSize: '1.8rem',
        backgroundColor: 'transparent',
        color: theme.palette.text.default,
        '&::placeholder': {
            color: darkTheme ? 'rgba(255,255,255,60)' : 'rgba(0, 0, 0, 0.60)'
        },
        border: 'none',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '21px',
        opacity: 0.8,
        '&:focus': {
            outline: 'none'
        },
        marginRight: '1rem'
    },
    sendIcon: {
        position: 'absolute',
        right: '15rem',
        cursor: 'pointer',
        height: '3rem',
        width: '3rem'
    },
    subTextContainer: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    subText: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        color: theme.palette.text.default,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
        fontSize: '2rem'
    },
    subTextIcon: {
        fill: darkTheme ? '#FFC901' : '#0977DD',
        height: '1.5rem',
        width: '1.5rem'
    },
    connector: {
        content: '""',
        position: 'absolute',
        top: '15%',
        right: '13rem',
        background: 'rgba(151, 151, 151, 0.30)',
        width: '1px',
        height: '70%'
    },
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        right: '2rem',
        fontSize: '1.8rem',
        color: darkTheme ? '#fff' : '#091F3A',
        cursor: 'pointer'
    },
    filterIcon: {
        height: '3rem',
        width: '3rem',
        marginLeft: '1.5rem'
    },
    suggestionsContainer: {
        marginTop: '3rem',
        display: 'flex',
        gap: '1rem',
        width: '70%'
    },
    suggestionsBoxContainer: {
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        width: '85%',
        justifyContent: 'center',
        marginLeft: '-3rem'
    },
    suggestionHeading: {
        fontSize: '1.5rem',
        fontWeight: '400',
        lineHeight: '18px',
        letterSpacing: '1px',
        paddingTop: '4px',
        textTransform: 'capitalize',
        width: 'fit-content',
        textAlign: 'center'
    },
    suggestionText: {
        background: darkTheme ? 'rgba(211, 198, 247, 0.40)' : 'rgba(188, 188, 188, 0.40)',
        padding: `4px 16px 4px 16px`,
        fontSize: '1.5rem',
        fontWeight: '400',
        lineHeight: '18px',
        letterSpacing: '1px',
        borderRadius: '4px',
        cursor: 'pointer'
    }
}));
const DataScout = ({ params, ...props }) => {
    const [data, setData] = useState(params.elements);
    const [DsBookmark, setDsBookmark] = useState(props.app_details.DS_Bookmark);
    const [DSDownload, setDSDownload] = useState(props.app_details.DS_Download);
    const [filterOptions, setFilterOptions] = useState(params.elements.FilterData);
    const [filteredData, setFilteredData] = useState(null);
    const classes = useStyles();
    const [resultData, setResultData] = useState(null);
    const [dataPage, setDataPage] = useState(null);
    const [index, setDataIndex] = useState(null);
    const [searchValue, setSearchValue] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);

    const searchData = (value) => {
        let result = [];
        let searchData = filteredData || data;
        switch (value) {
            case null:
                setResultData(null);
                break;
            default:
                searchData.allData.map((val) => {
                    if (val.heading.toLowerCase().includes(value.toLowerCase())) {
                        result.push(val);
                    } else {
                        for (let i in val.tags) {
                            if (val.tags[i].tag.toLowerCase().includes(value.toLowerCase())) {
                                result.push(val);
                                break;
                            }
                        }
                    }
                });
                setResultData(result);
                break;
        }
    };
    const handleOnChange = (value) => {
        setSearchValue(value);
    };
    const handleClick = (val) => {
        setSearchValue(val);
        searchData(val);
    };

    useEffect(() => {
        setDsBookmark(props.app_details.DS_Bookmark);
    }, [props.app_details.DS_Bookmark]);

    useEffect(() => {
        setDSDownload(props.app_details.DS_Download);
    }, [props.app_details.DS_Download]);

    return (
        <div className={classes.rootContainer}>
            {dataPage ? (
                <DataSetPage
                    dataPage={dataPage}
                    setData={setData}
                    data={data}
                    index={index}
                    setDataIndex={setDataIndex}
                    setDataPage={setDataPage}
                    setDsBookmark={setDsBookmark}
                    setDSDownload={setDSDownload}
                    DSDownload={DSDownload}
                    DsBookmark={DsBookmark}
                    params={params}
                    DS_ClickHandle={props.app_details.DS_ClickHandle}
                />
            ) : (
                <React.Fragment>
                    {DSDownload && (
                        <Downloads
                            params={params}
                            setDSDownload={setDSDownload}
                            DS_ClickHandle={props.app_details.DS_ClickHandle}
                        />
                    )}
                    {DsBookmark && (
                        <BookMarks
                            params={params}
                            setDsBookmark={setDsBookmark}
                            DS_ClickHandle={props.app_details.DS_ClickHandle}
                            index={index}
                            setDataIndex={setDataIndex}
                            setData={setData}
                            obj={data}
                            setDataPage={setDataPage}
                            setDSDownload={setDSDownload}
                            DSDownload={DSDownload}
                            DsBookmark={DsBookmark}
                            dataPage={dataPage}
                        />
                    )}
                    {!DSDownload && !DsBookmark && (
                        <React.Fragment>
                            <div
                                className={
                                    resultData
                                        ? classes.resultBoxContainer
                                        : classes.searchBoxContainer
                                }
                            >
                                {!resultData && (
                                    <React.Fragment>
                                        <Typography className={classes.title}>
                                            Welcome to Data Scout!
                                        </Typography>
                                        <div className={classes.subTextContainer}>
                                            <Typography className={classes.subText}>
                                                Discover{' '}
                                                <FiberManualRecord
                                                    className={classes.subTextIcon}
                                                />{' '}
                                            </Typography>
                                            <Typography className={classes.subText}>
                                                Analyze{' '}
                                                <FiberManualRecord
                                                    className={classes.subTextIcon}
                                                />{' '}
                                            </Typography>
                                            <Typography className={classes.subText}>
                                                Succeed
                                            </Typography>
                                        </div>
                                    </React.Fragment>
                                )}
                                <div className={classes.promptContainer}>
                                    <input
                                        className={classes.inputField}
                                        placeHolder={
                                            params?.params?.promptLabel ||
                                            'Search dataset by name,category etc'
                                        }
                                        value={searchValue || ''}
                                        onChange={(e) => handleOnChange(e.target.value)}
                                        key={'searchInput'}
                                    />
                                    {resultData ? (
                                        <CloseOutlinedIcon
                                            onClick={() => handleClick(null)}
                                            className={classes.sendIcon}
                                        />
                                    ) : (
                                        <SearchOutlinedIcon
                                            onClick={() => searchData(searchValue)}
                                            className={classes.sendIcon}
                                        />
                                    )}
                                    <span className={classes.connector}></span>
                                    <Typography
                                        className={classes.filterContainer}
                                        onClick={() => setFilterOpen(!filterOpen)}
                                    >
                                        Filter <FilterListOutlined className={classes.filterIcon} />
                                    </Typography>
                                </div>
                                {filterOpen && (
                                    <Filter
                                        data={data}
                                        setData={setData}
                                        setFilterOpen={setFilterOpen}
                                        filterOptions={filterOptions}
                                        setFilterOptions={setFilterOptions}
                                        setFilteredData={setFilteredData}
                                    />
                                )}
                                {!resultData && (
                                    <div className={classes.suggestionsContainer}>
                                        <Typography className={classes.suggestionHeading}>
                                            Popular keywords :
                                        </Typography>
                                        <div className={classes.suggestionsBoxContainer}>
                                            {data.popularKeywords.map((val, key) => (
                                                <Typography
                                                    key={`keyword${key}`}
                                                    onClick={() => handleClick(val)}
                                                    className={classes.suggestionText}
                                                >
                                                    {val}
                                                </Typography>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DatasetContainer
                                resultData={resultData}
                                data={filteredData || data}
                                setData={setData}
                                setDataPage={setDataPage}
                                setDataIndex={setDataIndex}
                            />
                        </React.Fragment>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default DataScout;
