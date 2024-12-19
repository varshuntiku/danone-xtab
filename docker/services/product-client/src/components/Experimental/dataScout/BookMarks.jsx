import React, { useEffect, useState } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import FilterListOutlined from '@material-ui/icons/FilterListOutlined';
import DataSetPage from './DataSetPage';
import DatasetContainer from './DatasetContainer';
import { ArrowBackIos } from '@material-ui/icons';
import Filter from './Filter';

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
        overflow: 'scroll'
    },
    searchBoxContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        background: darkTheme ? '#0C2744' : '#F6F6F6',
        paddingBottom: '3rem'
    },
    resultBoxContainer: {
        width: '100%',
        display: 'flex',
        psoition: 'relative',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        background: darkTheme ? '#0C2744' : '#F6F6F6',
        paddingBottom: '3rem'
    },
    title: {
        color: theme.palette.text.default,
        fontSize: '3rem',
        fontStyle: 'normal',
        fontWeight: '300',
        lineHeight: 'normal',
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center'
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
    backIcon: {
        background: darkTheme ? '#1E3E5F' : 'rgba(206, 217, 250, 1)',
        height: '4rem',
        width: '4rem',
        position: 'absolute',
        left: '5rem',
        top: '3rem',
        padding: '1rem 0.5rem 1rem 1rem',
        cursor: 'pointer',
        color: darkTheme ? theme.palette.text.contrastText : '#000'
    }
}));

const BookMarks = ({ params, ...props }) => {
    const [data, setData] = useState(params.elements);
    const [filterOptions, setFilterOptions] = useState(params.elements.FilterData);
    const [filteredData, setFilteredData] = useState(null);
    const classes = useStyles();
    const [resultData, setResultData] = useState(null);
    const [dataPage, setDataPage] = useState(null);
    const [searchValue, setSearchValue] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [DsBookmark, setDsBookmark] = useState(false);
    const [DSDownload, setDSDownload] = useState(false);
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

    const handleBackClick = () => {
        props.setDsBookmark(false);
        props.DS_ClickHandle('Bookmark');
    };

    useEffect(() => {
        setDsBookmark(DsBookmark);
    }, [props.DsBookmark]);

    useEffect(() => {
        setDsBookmark(DSDownload);
    }, [props.DSDownload]);

    return (
        <div className={classes.rootContainer}>
            {dataPage ? (
                <DataSetPage
                    dataPage={dataPage}
                    setDataPage={setDataPage}
                    index={props.index}
                    setDataIndex={props.setDataIndex}
                    data={data}
                    params={params}
                    setDsBookmark={props.setDsBookmark}
                    DS_ClickHandle={props.DS_ClickHandle}
                    setData={props.setData}
                    setDSDownload={setDSDownload}
                    DSDownload={DSDownload}
                    DsBookmark={DsBookmark}
                />
            ) : (
                <React.Fragment>
                    <div
                        className={
                            resultData ? classes.resultBoxContainer : classes.searchBoxContainer
                        }
                    >
                        {!resultData && (
                            <Typography className={classes.title}>
                                <ArrowBackIos
                                    className={classes.backIcon}
                                    onClick={handleBackClick}
                                />{' '}
                                Bookmarks
                            </Typography>
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
                    </div>
                    <DatasetContainer
                        resultData={resultData}
                        data={filteredData || data}
                        setDataPage={setDataPage}
                        height="65vh"
                        bookmarks={true}
                        setDataIndex={props.setDataIndex}
                        setData={props.setData}
                    />
                </React.Fragment>
            )}
        </div>
    );
};

export default BookMarks;
