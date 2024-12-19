import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import { ThemeContext } from "../../../../../theme/ThemeContext";
import { PlotlyUtils } from "../../../../../util/plotlyUtil";
import "./chartView.scss"

export default function ChartView({params}) {
    let chartParams = JSON.parse(JSON.stringify(params));
    const plotContainer = useRef<HTMLDivElement>();
    const theme = useContext(ThemeContext);

    useLayoutEffect(() => {
        let resizeObserver;
        const t = setTimeout(() => {
            const pu = new PlotlyUtils(theme);
            chartParams = pu.setupPlot(chartParams);
            // @ts-ignore
            window.Plotly?.newPlot(plotContainer.current, chartParams.data, chartParams.layout, {
                displayModeBar: false,
                responsive: true,
                useResizeHandler: true,
            }).then(view => {
                if (view) {
                    resizeObserver = new ResizeObserver(() => {
                        // @ts-ignore
                        window.Plotly?.Plots.resize(view)
                    })
                    resizeObserver.observe(plotContainer.current);
                }
            });
        }, 100);
        return () => {
            clearTimeout(t);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        }
    }, [theme, chartParams])

    return <div ref={plotContainer} class="MinervaChartView" />
}