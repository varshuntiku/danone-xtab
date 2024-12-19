import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { Box, Button, Typography, withStyles } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import CustomTextField from './Forms/CustomTextField.jsx';
import Tooltip from '@material-ui/core/Tooltip';
import AppWidgetAssumptions from './AppWidgetAssumptions.jsx';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        color: theme.palette.text.codxDefault
    },
    table: {
        width: 'calc(100% - 20px)',
        marginLeft: '15px',
        color: theme.palette.text.codxDefault
    },
    row: {
        background: theme.palette.primary.highlight
    },
    cell: {
        fontSize: '1.5rem',
        position: 'relative',
        color: theme.palette.text.codxDefault
    },
    columnHeadCell: {
        borderTop: '1px solid #4dbe90',
        borderBottom: '2px solid #4dbe90',
        background: theme.palette.primary.light,
        textAlign: 'center'
    },
    axisHead: {
        fontWeight: '500',
        fontSize: '2.5rem',
        textAlign: 'center',
        color: theme.palette.text.codxDefault
    },
    yHead: {
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        transform: 'rotate(180deg)',
        position: 'fixed',
        top: '50%',
        left: '-3px'
    },
    legendsWrapper: {
        width: 'calc(100% - 20px)',
        display: 'flex',
        justifyContent: 'end',
        flexWrap: 'wrap',
        padding: '16px 0',
        position: 'absolute'
    },
    legend: {
        display: 'flex',
        fontSize: '1.75rem',
        fontWeight: '400',
        alignItems: 'center',
        marginLeft: '10px'
    },
    legendBox: {
        width: '12px',
        height: '12px',
        marginRight: '5px'
    },
    root: (props) => ({
        position: 'absolute',
        top: '1.8rem',
        right: 0,
        margin: 0,
        padding: 0,
        '& svg': {
            width: props?.width,
            height: props?.height,
            position: props?.position,
            right: props?.right,
            top: props?.top
            // cursor:props?.cursor
        }
    }),
    formControl: {
        width: '1.7rem',
        height: 0,
        background: 'none',
        lineHeight: 0,
        fontSize: 0,
        '&:before': {
            display: 'none'
        }
    },
    input: {
        height: 0,
        width: 0,
        paddingRight: '0!important',
        paddingBottom: '0!important'
    },
    menu: {
        '& * .Mui-selected': {
            border: 'none',
            margin: 0
        },
        '& * .MuiIconButton-label svg': {
            fontSize: '2rem'
        }
    },
    dropDown: {
        visibility: 'hidden'
    },
    dataCell: {
        '&:hover $dropDown': {
            visibility: 'visible'
        }
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        '& div': {
            marginRight: '2rem'
        }
    },
    iconsSuffix: {
        marginLeft: '2px',
        color: theme.palette.primary.contrastText,
        alignSelf: 'center'
    },
    iconsWrapper: {
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'end',
        flexWrap: 'wrap'
    },
    zerothTableHead: {
        borderRight: '2px solid #4dbe90'
    },
    legendName: {
        lineHeight: 0
    },
    menuImage: {
        maxWidth: '16px'
    },
    tableHead: {
        borderRight: '2px dotted #4dbe90'
    },
    rowHeadCell: {
        borderRight: '2px solid #4dbe90'
    },
    rowCell: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
}));
const HtmlTooltip = withStyles((theme) => ({
    arrow: {
        fontSize: '20px'
    },
    tooltip: {
        backgroundColor: 'white',
        color: 'black',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid black'
    }
}))(Tooltip);
const getLegendsColorMap = (legends = []) => {
    const legendsColorMap = {};
    legends.forEach(({ id, style }) => {
        legendsColorMap[id] = style;
    });
    return legendsColorMap;
};

const legendsAlignmentMap = {
    'bottom-center': 'center',
    'bottom-right': 'end'
};

const getRowHeadIdToDataMap = (rowHeadData = []) => {
    const rowHeadIdToDataMap = {};
    rowHeadData.forEach((rowHead) => {
        rowHeadIdToDataMap[rowHead.id] = rowHead;
    });
    return rowHeadIdToDataMap;
};

const getCellOptionsList = (options) => {
    if (!options || !Object.keys(options).length) return [];

    return Object.keys(options).filter((option) => options[option]);
};

const getInitSelections = (data) => {
    const selections = {};
    const rowIdsList = data.rowHeadData.map((rowHead) => rowHead.id);
    const columnIdsList = data.columnHeadData.map((columnHead) => columnHead.id);

    rowIdsList.forEach((rowId) => {
        columnIdsList.forEach((columnId) => {
            if (data.cellsData[rowId][columnId]) {
                selections[`${rowId}${columnId}`] = data.cellsData[rowId][columnId].icons || [];
            }
        });
    });

    return selections;
};

export default function WhiteSpaceDetector({ params, onAction }) {
    const classes = useStyles(params?.dropdownIconsStyle);
    const [data, setData] = useState(params);
    const [draggedImgDetails, setDraggedImgDetails] = useState(null);
    const [currentDropdownSelections, setCurrentDropdownSelections] = useState(
        getInitSelections(data)
    );

    const handleActionClick = useCallback(
        (name) => {
            onAction &&
                onAction({
                    actionName: name,
                    data
                });
        },
        [data]
    );

    const onDrag = (e, url, rowId, columnId) => {
        e.preventDefault();
        setDraggedImgDetails({ url, rowId, columnId });
    };

    const onDrop = (e, rowId, columnId) => {
        const updatedData = { ...data };
        if (updatedData.cellsData[rowId][columnId]) {
            const imgIndex = updatedData.cellsData[draggedImgDetails.rowId][
                draggedImgDetails.columnId
            ].icons.indexOf(draggedImgDetails.url);

            updatedData.cellsData[draggedImgDetails.rowId][draggedImgDetails.columnId].icons.splice(
                imgIndex,
                1
            );
            updatedData.cellsData[rowId][columnId].icons.push(draggedImgDetails.url);

            setData(updatedData);
        }
        setDraggedImgDetails(null);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onChange = (value, rowId, columnId) => {
        setCurrentDropdownSelections({
            ...currentDropdownSelections,
            [`${rowId}${columnId}`]: value
        });
        const updatedData = { ...data };
        updatedData.cellsData[rowId][columnId].icons = value;
        setData(updatedData);
    };

    const legendsColorMap = getLegendsColorMap(data.legends);
    const rowHeadIdToDataMap = getRowHeadIdToDataMap(data.rowHeadData);

    const getMenuItem = ({ text, iconName, iconsInputProps, imageUrl, rowId, columnId }) => {
        return (
            <div className={classes.menuItem}>
                <Checkbox
                    checked={
                        currentDropdownSelections[`${rowId}${columnId}`] &&
                        currentDropdownSelections[`${rowId}${columnId}`].indexOf(imageUrl) > -1
                    }
                />
                <div>{text}</div>
                {params?.displayIcons ? (
                    iconComponentType(iconName, iconsInputProps)
                ) : (
                    <img className={classes.menuImage} src={imageUrl} alt="icon" />
                )}
            </div>
        );
    };

    const buildIconsDropdownOptions = (rowId, columnId, iconsList = []) => {
        return iconsList.map(({ text, url, type, iconsInputProps, iconName }) => ({
            label: getMenuItem({
                text,
                type,
                iconName,
                iconsInputProps,
                imageUrl: url || iconName,
                rowId,
                columnId
            }),
            value: params.displayIcons ? iconName : url
        }));
    };

    const iconComponentType = (type, iconsInputProps) => {
        switch (type) {
            case 'check':
                return <Icon className="fas fa-check-circle" style={iconsInputProps} />;
            case 'cross':
                return <Icon className="fas fa-times-circle" style={iconsInputProps} />;
            case 'help':
                return <Icon className="fas fa-question-circle" style={iconsInputProps} />;
            case 'info':
                return <Icon className="fas fa-info-circle" style={iconsInputProps} />;
            case 'error':
                return <Icon className="fas fa-exclamation-circle" style={iconsInputProps} />;
            default:
                break;
        }
    };

    const renderIconsWithRestrictions = (
        icons,
        rowId,
        columnId,
        settings = {},
        styleOptions = {}
    ) => {
        if (!icons.length) return null;

        const renderList = [];
        const iconsCount = icons.length;
        const DEFAULT_ICONS_PER_CELL = 3;
        const showIconsCount = settings.iconsPerCell || DEFAULT_ICONS_PER_CELL;
        const count = showIconsCount > iconsCount ? iconsCount : showIconsCount;

        if (icons.length) {
            if (params?.isSingleSelect) {
                if (params?.displayIcons && icons) {
                    const { iconsInputProps, toolTipTitle, iconName } = data.iconsList.find(
                        (el) => el.iconName === icons
                    );
                    renderList.push(
                        toolTipTitle ? (
                            <HtmlTooltip
                                title={<Typography variant="h2">{toolTipTitle}</Typography>}
                                arrow
                            >
                                {iconComponentType(iconName, iconsInputProps)}
                            </HtmlTooltip>
                        ) : (
                            <>{iconComponentType(iconName, iconsInputProps)}</>
                        )
                    );
                } else {
                    renderList.push(
                        <img
                            key={`${rowId}${columnId}_${icons}`}
                            src={icons}
                            style={{ maxWidth: styleOptions.cellIconMaxWidth || '25px' }}
                            draggable
                            onDrag={(e) => onDrag(e, icons, rowId, columnId)}
                            alt="icon"
                        />
                    );
                }
            } else {
                for (let i = 0; i < count; ++i) {
                    if (params?.displayIcons) {
                        const { iconsInputProps, toolTipTitle, iconName } = data.iconsList.find(
                            (el) => el.iconName === icons[i]
                        );
                        renderList.push(
                            toolTipTitle ? (
                                <HtmlTooltip
                                    title={<Typography variant="h2">{toolTipTitle}</Typography>}
                                    arrow
                                >
                                    {iconComponentType(iconName, iconsInputProps)}
                                </HtmlTooltip>
                            ) : (
                                <>{iconComponentType(iconName, iconsInputProps)}</>
                            )
                        );
                    } else {
                        renderList.push(
                            <img
                                key={`${rowId}${columnId}_icon${i}`}
                                src={icons[i]}
                                style={{ maxWidth: styleOptions.cellIconMaxWidth || '25px' }}
                                draggable
                                onDrag={(e) => onDrag(e, icons[i], rowId, columnId)}
                                alt="icon"
                            />
                        );
                    }
                }
            }

            if (iconsCount - count && !params?.isSingleSelect)
                renderList.push(
                    <div key={`${rowId}${columnId}_iconSuffix`} className={classes.iconsSuffix}>
                        {`+${iconsCount - showIconsCount}`}
                    </div>
                );
        }
        return renderList;
    };

    const renderColumnHead = (columnHeadData, styleOptions = {}) => {
        return columnHeadData.map(({ id, head, colspan, columnWidth }) => (
            <TableCell
                colSpan={colspan}
                key={id}
                className={`${classes.cell} ${classes.columnHeadCell} ${classes.tableHead}`}
                style={{
                    width: columnWidth || styleOptions?.cellSize?.width || 'auto'
                }}
            >
                {head}
            </TableCell>
        ));
    };
    const renderColumnLevels = (columnHeadLevelsData, styleOptions) => {
        return columnHeadLevelsData.levels.map((element, index) => (
            <TableRow key={index}>
                <TableCell
                    className={`${classes.cell} ${classes.columnHeadCell} ${classes.zerothTableHead}`}
                ></TableCell>
                {renderColumnHead(columnHeadLevelsData[element], styleOptions)}
            </TableRow>
        ));
    };

    const renderCellContent = (content, rowSubHeadLength, rowId, columnId) => {
        if (!content || !content.length) return [];

        const contentRender = [];
        for (let i = 0; i < rowSubHeadLength; ++i) {
            contentRender.push(
                <div key={`${rowId}${columnId}_content${i}`}>{content[i] || '-'}</div>
            );
        }
        return contentRender;
    };

    const renderRow = (rowId, row = {}, styleOptions = {}) => {
        const renderCells = [];
        const columnIdsList = data.columnHeadData.map((columnHead) => columnHead.id);
        const cellSize = styleOptions.cellSize;
        const rowHead = rowHeadIdToDataMap[rowId] || {};
        const rowSubHeadLength = rowHead.subhead?.length || 0;
        const rowHeight = rowHead.rowHeight || cellSize?.height;
        renderCells.push(
            <TableCell
                key={rowId}
                className={`${classes.cell} ${classes.rowHeadCell}`}
                style={{
                    height: rowHeight,
                    ...(styleOptions.rowHeadWidth ? { width: styleOptions.rowHeadWidth } : null)
                }}
            >
                <div className={classes.rowCell}>
                    {rowHead.head}
                    {rowHead.subhead ? (
                        <div>
                            {rowHead.subhead.map((val, i) => (
                                <div key={`${rowId}_subhead${i}`}>{val}</div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </TableCell>
        );

        columnIdsList.forEach((columnId) => {
            const cellData = row[columnId];
            let { content = [], icons = [], options } = cellData || {};
            const option = getCellOptionsList(options)[0];

            renderCells.push(
                <TableCell
                    key={`${rowId}${columnId}`}
                    className={classes.cell + ' ' + classes.dataCell}
                    style={{
                        ...(option
                            ? {
                                  borderWidth: legendsColorMap[option]['borderWidth'] || '3px',
                                  borderStyle: legendsColorMap[option]['borderStyle'] || 'solid',
                                  borderColor: legendsColorMap[option]['borderColor'] || '#000'
                              }
                            : { borderRight: '2px dotted #4dbe90' }),
                        height: rowHeight,
                        ...(cellSize?.width ? { width: cellSize.width } : null)
                    }}
                    onDrop={(e) => onDrop(e, rowId, columnId)}
                    onDragOver={(e) => onDragOver(e)}
                >
                    {cellData ? (
                        <>
                            <>
                                {renderCellContent(content, rowSubHeadLength, rowId, columnId)}
                                {icons.length ? (
                                    <div
                                        className={classes.iconsWrapper}
                                        style={{
                                            ...(styleOptions.shiftCellIconsUp
                                                ? { marginTop: `-${styleOptions.shiftCellIconsUp}` }
                                                : null),
                                            ...cellData?.iconWrapperStyles,
                                            ...(params?.displayIcons
                                                ? { justifyContent: 'center' }
                                                : null)
                                        }}
                                    >
                                        {renderIconsWithRestrictions(
                                            icons,
                                            rowId,
                                            columnId,
                                            data.settings,
                                            styleOptions
                                        )}
                                    </div>
                                ) : null}
                            </>
                            {cellData.assumptions && <AppWidgetAssumptions params={cellData} />}
                            {data.iconsList && data.iconsList.length ? (
                                <div className={classes.dropDown}>
                                    <CustomTextField
                                        field_info={{
                                            value: currentDropdownSelections[`${rowId}${columnId}`],
                                            is_select: true,
                                            options: buildIconsDropdownOptions(
                                                rowId,
                                                columnId,
                                                data.iconsList
                                            ),
                                            onChange: (value) => onChange(value, rowId, columnId),
                                            selectProps: {
                                                multiple: !params?.isSingleSelect,
                                                renderValue: () => null
                                            }
                                        }}
                                        classes={{
                                            root: classes.root,
                                            formControl: classes.formControl,
                                            input: classes.input,
                                            menu: classes.menu
                                        }}
                                    />
                                </div>
                            ) : null}
                        </>
                    ) : null}
                </TableCell>
            );
        });

        return renderCells;
    };

    const renderTableBody = (cellsData = {}, styleOptions = {}) => {
        const outputRender = [];
        const rowIdsList = data.rowHeadData.map((rowHead) => rowHead.id);

        rowIdsList.forEach((rowId, i) => {
            outputRender.push(
                <TableRow key={`${rowId}${i}`} className={i % 2 === 0 ? classes.row : null}>
                    {renderRow(rowId, cellsData[rowId], styleOptions)}
                </TableRow>
            );
        });

        return outputRender;
    };

    return (
        <div className={classes.wrapper}>
            {data.axisHeaders?.x ? (
                <div className={classes.axisHead}>{data.axisHeaders.x}</div>
            ) : null}
            {data.axisHeaders?.y ? (
                <div className={classes.axisHead + ' ' + classes.yHead}>{data.axisHeaders.y}</div>
            ) : null}
            <TableContainer>
                <Table className={classes.table}>
                    <TableHead>
                        {data.is_columnHeadlevels
                            ? renderColumnLevels(data.columnHeadLevelsData, data.styleOptions)
                            : null}
                        <TableRow>
                            <TableCell
                                className={`${classes.cell} ${classes.columnHeadCell} ${classes.zerothTableHead}`}
                            ></TableCell>
                            {renderColumnHead(data.columnHeadData, data.styleOptions)}
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderTableBody(data.cellsData, data.styleOptions)}</TableBody>
                </Table>
            </TableContainer>
            {data.legends && data.legends.length ? (
                <div
                    className={classes.legendsWrapper}
                    style={{
                        justifyContent:
                            legendsAlignmentMap[
                                data?.styleOptions?.legendsAlignment || 'bottom-right'
                            ],
                        ...(data?.styleOptions?.legendsAlignment === 'top-right'
                            ? { top: '-4px' }
                            : null)
                    }}
                >
                    {data.legends.map(
                        ({
                            id,
                            name,
                            style: {
                                borderWidth = '3px',
                                borderStyle = 'solid',
                                borderColor = '#000'
                            } = {}
                        }) => (
                            <div key={id} className={classes.legend}>
                                <div
                                    className={classes.legendBox}
                                    style={{
                                        border: `${borderWidth} ${borderStyle} ${borderColor}`
                                    }}
                                ></div>
                                <span className={classes.legendName}>{name}</span>
                            </div>
                        )
                    )}
                </div>
            ) : null}
            {data.actions && data.actions.length ? (
                <Box
                    width="calc(100% - 30px)"
                    display="flex"
                    flexWrap="wrap"
                    gridGap="1rem"
                    padding="2rem 0"
                    marginLeft="15px"
                    justifyContent="start"
                    position="absolute"
                >
                    {data.actions
                        .map((action) => {
                            if (action) {
                                const { text, name, variant } = action;
                                return (
                                    <Button
                                        key={name}
                                        size="small"
                                        variant={variant || 'outlined'}
                                        onClick={handleActionClick.bind(null, name)}
                                        aria-label={text || name}
                                    >
                                        {text || name}
                                    </Button>
                                );
                            }
                        })
                        .filter((element) => element)}
                </Box>
            ) : null}
        </div>
    );
}
