import "./timeline.scss"
export function Timeline({children}) {
    return <ul className="MinervaTimeline">{children}</ul>
}

export function TimelineItem({children}) {
    return <li className="MinervaTimelineItem">{children}</li>
}

export function TimelineSeparator({children}) {
    return <div className="MinervaTimelineSeparator">{children}</div>
}

export function TimelineContent({children}) {
    return <div className="MinervaTimelineContent">
        {children}
    </div>
}

export function TimelineDot() {
    return <span className="MinervaTimelineDot"></span>
}

export function TimelineConnector() {
    return <div className="MinervaTimelineConnector"></div>
}
