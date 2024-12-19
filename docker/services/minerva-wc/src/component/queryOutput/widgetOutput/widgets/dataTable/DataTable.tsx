import { useEffect, useState } from "preact/hooks"
import "./dataTable.scss"
import ArrowUpwardAltICon from "../../../../../svg/ArrowUpwardAltIcon"
import ArrowDownwardAltICon from "../../../../../svg/ArrowDownwardAltIcon"
import VerticalSwapIcon from "../../../../../svg/VerticalSwapIcon"
import KeyboardArrowLeftIcon from "../../../../../svg/KeyboardArrowLeftIcon"
import KeyboardArrowRightIcon from "../../../../../svg/KeyboardArrowRight"

export default function DataTable({ columns, values, rowsPerPage=100 }) {

    const [colData, setColData] = useState<Array<any>>([])
    const [rowIndexList, setRowIndexList] = useState<Array<number>>(Array.from(values[0].keys()))

    const [currentPage, setCurrentPage] = useState(1);
    const totalRows = values[0]?.length || 0;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    useEffect(() => {
        const updatedColumnData = []
        columns.forEach((item: string) => {
            updatedColumnData.push({
                "name": item,
                "order": ""
            })
        })
        setColData(updatedColumnData)
    }, [])

    const fetchColumnSortOrder = (colItem: object) => {
        const orderBy = colItem['order']
        switch (orderBy) {
            case '':
                return 'asc';
            case 'asc':
                return 'desc';
            case 'desc':
                return '';
            default:
                return null;
        }

    }

    const comparator = ((a = 0, b = 0) => {
        return (a > b ? 1 : -1)
    });

    const handleColumnSort = (index: number) => {

        const orderBy = fetchColumnSortOrder(colData[index])

        if (orderBy !== '') {
            const columnDataToSort = values[index]

            const orderFactor = orderBy === 'asc' ? 1 : -1;
            const sortedIndex = rowIndexList.slice()
            sortedIndex.sort((a, b) => comparator(columnDataToSort[a], columnDataToSort[b]) * orderFactor)

            setRowIndexList(sortedIndex)
        } else {
            setRowIndexList(Array.from(values[0].keys()))
        }

        const updatedColumnData = colData.map((item, idx) => {
            return {
                ...item,
                "order": idx === index ? orderBy : ''
            }
        })
        setColData(updatedColumnData)
    }

    const renderColumnSortOrder = (sortBy: string) => {
        if (sortBy === 'asc') {
            return (
                <ArrowUpwardAltICon className="MinervaIcon"/>
            )
        } else if (sortBy === 'desc') {
            return (
                <ArrowDownwardAltICon className="MinervaIcon"/>
            )
        } else {
            return (
                <VerticalSwapIcon className="MinervaDataTable-tableheader-sort-icon MinervaIcon"/>
            )
        }
    }

    const getPaginatedRowIndices = () => {
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      return rowIndexList.slice(start, end);
    };

    const goToNextPage = () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const paginatedRowIndices = getPaginatedRowIndices();

    const startRowIndex = (currentPage - 1) * rowsPerPage;
    const endRowIndex = Math.min(startRowIndex + paginatedRowIndices.length, totalRows);

    return <div className="MinervaDataTable">
        <table className="MinervaDataTable-table">
            <thead>
                <tr>
                    {colData.map((col, i) => (
                        <th key={col.name + '-' + col.order + "-" + i} onClick={() => handleColumnSort(i)}>
                            <div className={"MinervaDataTable-header MinervaFont-2 " + (col.order !== '' ? "MinervaDataTable-header-sorted" : "")}>
                                {col.name} {renderColumnSortOrder(col.order)}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {paginatedRowIndices.map((item, i) => (
                    <tr key={i}>
                        {values.map((col, j) => (
                            <td key={j}>
                                {values[j][item]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        {totalRows > rowsPerPage && (
            <div className="MinervaDataTable-pagination-container">
                <span className="MinervaDataTable-pagination-label">
                    {startRowIndex + 1} - {endRowIndex} of {totalRows}
                </span>
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className='MinervaIconButton'>
                    <KeyboardArrowLeftIcon /> Prev
                </button>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className='MinervaIconButton'>
                    Next <KeyboardArrowRightIcon />
                </button>
            </div>
        )}
    </div>
}