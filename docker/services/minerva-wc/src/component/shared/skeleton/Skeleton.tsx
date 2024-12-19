import "./skeleton.scss";
export default function Skeleton({height = 1, typography = false}) {
    return <div
                width="100%"
                className="MinervaSkeleton"
                aria-label="skeleton"
                style={{"--height": height, ...(typography ? {margin: "0.4em 0"} : {})}}
            />
}