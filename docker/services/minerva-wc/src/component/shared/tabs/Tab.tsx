import './tab.scss'

type TabData = {
    label: string,
    icon?: any,
    value: number,
    orientation: 'horizontal' | 'vertical',
    wrapped?: boolean,
    activeTabIndex?: number
    disabled?: boolean,
    onTabClick: (tabIndex: number) => void
}

export default function Tab({ label, icon, value, orientation, wrapped, activeTabIndex, disabled, onTabClick }: TabData) {

    const isActiveTab = value === activeTabIndex

    return (
        <button onClick={() => onTabClick(value)}
            disabled={disabled}
            className={`MinervaTab ${orientation === 'horizontal' ? 'MinervaHorizontalTab' : 'MinervaVerticalTab'} ${isActiveTab ? 'MinervaActiveTab' : ''} ${wrapped ? 'MinervaWrappedTab': ''}`}>
            {icon && <span>{icon}</span>}
            {label}
        </button>
    );

};

