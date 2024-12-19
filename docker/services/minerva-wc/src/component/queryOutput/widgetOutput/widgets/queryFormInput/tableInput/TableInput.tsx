import GridTable from "../../../../../shared/gridTable/GridTable";

export default function TableInput({params, disabled, onSubmit, ...props}) {
    return <div className="MinervaTableInput">
        <GridTable {...params.gridTableProps} onOuterAction={onSubmit} disabled={disabled} />
    </div>
}