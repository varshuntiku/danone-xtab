import { useEffect, useRef, useState } from 'preact/hooks';
import './tabs.scss'
import KeyboardArrowRightIcon from '../../../svg/KeyboardArrowRight';
import ExpandMoreIcon from '../../../svg/ExpandMoreIcon';
import KeyboardArrowLeftIcon from '../../../svg/KeyboardArrowLeftIcon';
import KeyboardArrowUpIcon from '../../../svg/KeyboardArrowUpIcon';

type TabsData = {
    children: any,
    scrollable?: boolean,
    orientation?: 'horizontal' | 'vertical'
}

export default function Tabs({ children, scrollable, orientation = 'horizontal' }: TabsData) {

    const tabsRef = useRef(null)

    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    useEffect(() => {
        setShowOverflowButton()
    }, [scrollable])

    useEffect(() => {
        if (scrollable) {
            const observerOptions = {
                root: tabsRef.current,
                threshold: 1,         // to trigger the observer callback when 100% of the target element is visible
            };

            const observerLeft = new IntersectionObserver(([entry]) => {
                setShowLeftButton(!entry.isIntersecting);
            }, observerOptions);

            const observerRight = new IntersectionObserver(([entry]) => {
                setShowRightButton(!entry.isIntersecting);
            }, observerOptions);

            const tabs = tabsRef.current.children;

            if (orientation === 'horizontal') {
                observerLeft.observe(tabs[0]);
                observerRight.observe(tabs[tabs.length - 1]);
            } else {
                observerLeft.observe(tabs[0]);
                observerRight.observe(tabs[tabs.length - 1]);
            }

            return () => {
                observerLeft.disconnect();
                observerRight.disconnect();
            };
        }
    }, [scrollable]);


    const setShowOverflowButton = () => {
        if (orientation === 'horizontal') {
            const { scrollWidth, clientWidth, scrollLeft } = tabsRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft + clientWidth < scrollWidth);
        } else {
            const { scrollHeight, clientHeight, scrollTop } = tabsRef.current;
            setShowLeftButton(scrollTop > 0);
            setShowRightButton(scrollTop + clientHeight < scrollHeight);
        }
    }

    const handleScroll = (direction) => {
        const parentSize = orientation === 'horizontal'
            ? tabsRef.current.parentElement.clientWidth
            : tabsRef.current.parentElement.clientHeight;

        const scrollDistance = parentSize * 0.5; // Scroll by 50% of parent width or height

        if (orientation === 'horizontal') {
            tabsRef.current.scrollBy({ left: direction === 'left' ? -scrollDistance : scrollDistance, behavior: 'smooth' });
        } else {
            tabsRef.current.scrollBy({ top: direction === 'up' ? -scrollDistance : scrollDistance, behavior: 'smooth' });
        }
    };

    return (
        <div className={`MinervaTabsContainer ${orientation === 'horizontal' ? 'MinervaHorizontalTabsContainer' : 'MinervaVerticalTabsContainer'} `}>
            {scrollable && showLeftButton ?
                <button className='MinervaIconButton' onClick={() => handleScroll(orientation === 'horizontal' ? 'left' : 'up')}>
                    {orientation === 'horizontal' ? <KeyboardArrowLeftIcon /> : <KeyboardArrowUpIcon/>}
                </button>
                : null}
            <div className={`MinervaTabs ${orientation === 'horizontal' ? 'MinervaHorizontalTabs' : 'MinervaVerticalTabs'} ${scrollable ? 'MinervaScrollableTabs' : ''}`} ref={tabsRef}>
                {children}
            </div>
            {scrollable && showRightButton ?
                <button className='MinervaIconButton' onClick={() => handleScroll(orientation === 'horizontal' ? 'right' : 'down')}>
                    {orientation === 'horizontal' ? <KeyboardArrowRightIcon/> : <ExpandMoreIcon/>}
                </button>
                : null}
        </div>
    );

};

type TabsContainerData = {
    children: any,
    orientation?: 'horizontal' | 'vertical'
}

export function TabsContainer({ children, orientation }: TabsContainerData) {
    return (
        <div className='MinervaTabsContainer-root' style={{ flexDirection: orientation === 'vertical' ? 'row' : 'column', height: '100%' }}>
            {children}
        </div>
    )
}