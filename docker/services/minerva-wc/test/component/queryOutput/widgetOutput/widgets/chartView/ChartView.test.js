import { render } from '@testing-library/preact';
import ChartView from '../../../../../../src/component/queryOutput/widgetOutput/widgets/chartView/ChartView';
import { act } from 'preact/test-utils';
import ThemeProvider from '../../../../../../src/theme/ThemeContext';
import ViewModeContextProvider from '../../../../../../src/context/viewModeContext';

const mockTheme = {
    bgMain: "#FFFFFF",
    bgSecondaryBlue: "#C9DEF4",
    bgSecondaryLightBlue: "#E9F2FB",
    borderBlue: "#478bdb",
    textPrimary: "#000000",
    textSecondary: "#666666"
};

describe('ChartView test', () => {
    test('component should render', async () => {
        jest.useFakeTimers();

        const { container } = render(
            <ThemeProvider themeValues={mockTheme}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen-mini",
                    openSideWorkspace: true,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    sideWorkspaceContext: 0,
                    handleExpand: () => { }
                }}>
                    <ChartView params={{ data: [], layout: [] }} />
                </ViewModeContextProvider>
            </ThemeProvider>
        );

        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(container.getElementsByClassName("MinervaChartView").length).toBe(1);
        expect(container.getElementsByTagName("plotly")).toBeTruthy();
    });

    test('component should render: plotlyUtil.ts setupAxisStyling', async () => {
        jest.useFakeTimers();
        const params = {
            data: [],
            layout: {
                xaxis: {
                    title: {},
                    line: {}
                },
                yaxis: {
                    title: {}
                },
                polar: {}
            }
        };

        const { container } = render(
            <ThemeProvider themeValues={mockTheme}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen-mini",
                    openSideWorkspace: true,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    sideWorkspaceContext: 0,
                    handleExpand: () => { }
                }}>
                    <ChartView params={params} />
                </ViewModeContextProvider>
            </ThemeProvider>
        );

        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(container.getElementsByClassName("MinervaChartView").length).toBe(1);
        expect(container.getElementsByTagName("plotly")).toBeTruthy();
    });

    test('component should render: plotlyUtil.ts setupLegend', async () => {
        jest.useFakeTimers();
        const params = {
            data: [
                { type: "scatter" },
                { type: "bar" },
                { type: "pie" },
                { yaxis: "y2" }
            ],
            layout: {}
        };

        const { container } = render(
            <ThemeProvider themeValues={mockTheme}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen-mini",
                    openSideWorkspace: true,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    sideWorkspaceContext: 0,
                    handleExpand: () => { }
                }}>
                    <ChartView params={params} />
                </ViewModeContextProvider>
            </ThemeProvider>
        );

        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(container.getElementsByClassName("MinervaChartView").length).toBe(1);
        expect(container.getElementsByTagName("plotly")).toBeTruthy();
    });

    test('component should render: plotlyUtil.ts no data', async () => {
        jest.useFakeTimers();

        const { container } = render(
            <ThemeProvider themeValues={mockTheme}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen-mini",
                    openSideWorkspace: true,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    sideWorkspaceContext: 0,
                    handleExpand: () => { }
                }}>
                    <ChartView params={null} />
                </ViewModeContextProvider>
            </ThemeProvider>
        );

        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(container.getElementsByClassName("MinervaChartView").length).toBe(1);
        expect(container.getElementsByTagName("plotly")).toBeTruthy();
    });
});

