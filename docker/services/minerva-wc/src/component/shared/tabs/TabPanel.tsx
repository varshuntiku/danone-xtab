import './tabPanel.scss'

type TabPanelData = {
    children: any,
    activeTabIndex: number,
    index: number
}

export default function TabPanel ({ children, activeTabIndex, index }: TabPanelData) {
    return (
        <div className={`MinervaTabPanel ${activeTabIndex === index ? 'MinervaActiveTabPanel': ''}`}>
            {children}
        </div>
    );
};
