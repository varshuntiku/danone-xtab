import "./grid.scss";

export function GridContainer({children=null, columns = 12, spacing=0, rowSpacing=spacing, columnSpaing=spacing, ...props}) {
    return <div {...props} style={{...props.style, "--columns": columns, "--row-spacing": spacing, "--col-spacing": spacing}} className={"MinervaGridContainer " + (props.class || props.className)}>
        {children}
    </div>
}

type GridItemSpan = number | "auto" | boolean | "hide"

export function GridItem({children=null, xs=null, ...props}: {xs?: GridItemSpan} & any) {
    let className = "";
    if (typeof(xs) === 'number') {
        className = "MinervaGridItem-xs"
    }
    if (xs === true) {
        className = "MinervaGridItem-xs-grow"
    }
    if (xs === 'auto') {
        className = "MinervaGridItem-xs-auto"
    }
    if (xs === 'hide') {
        className = "MinervaGridItem-xs-hide"
    }

    // if (typeof(md) === 'number') {
    //     className += " MinervaGridItem-md"
    // }
    // if (md === true) {
    //     className += " MinervaGridItem-md-grow"
    // }
    // if (md === 'auto') {
    //     className += " MinervaGridItem-md-auto"
    // }
    // if (md === 'hide') {
    //     className += " MinervaGridItem-md-hide"
    // }

    return <div {...props} style={{...props.style, "--span-xs": xs}} className={"MinervaGridItem " + className + " " + (props.class || props.className)} >
        {children}
    </div>
}