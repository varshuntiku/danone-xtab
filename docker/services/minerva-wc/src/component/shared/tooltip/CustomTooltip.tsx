import { useEffect, useRef, useState } from "preact/hooks";
import './customTooltip.scss'
import { Fragment } from "preact/jsx-runtime";
import { cloneElement, Component } from "preact";
import { createPortal } from "preact/compat";


export default function CustomTooltip({ content, children, placement = "top", arrow = false, triggerEvents = "hover", open = false, onOpen = null, onClose = null }) {

    const [showTooltip, setShowTooltip] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0, arrowPlacement: "bottom" });
    const [arrowPosition, setArrowPosition] = useState(null)
    //check the type for ref
    const anchorElRef = useRef<HTMLElement | Component>()
    const tooltipRef = useRef<HTMLDivElement>()

    const handleMouseEnter = () => {
        setShowTooltip(true)
    }

    const handleMouseLeave = () => {
        setShowTooltip(false)
    }

    const calculatePosition = () => {
        if (anchorElRef.current && tooltipRef.current) {
            tooltipRef.current.setAttribute("popover", 'true')
            if (showTooltip) {
                tooltipRef.current.showPopover()
            } else {
                tooltipRef.current.hidePopover()
            }
            let anchorElement = anchorElRef.current instanceof HTMLElement ? anchorElRef.current : anchorElRef.current.base
            if(anchorElement instanceof Element) {
                const anchorElRect = anchorElement.getBoundingClientRect();
                const tooltipWidth = tooltipRef.current.offsetWidth;
                const tooltipHeight = tooltipRef.current.offsetHeight;
                const offset = 10;

                const { topPos, leftPos, arrowPos } = getTooltipPosition(anchorElRect, tooltipHeight, tooltipWidth, offset)

                setPosition({ top: topPos, left: leftPos, arrowPlacement: arrowPos });
            }
        }
    };

    const getTooltipPosition = (anchorElRect: DOMRect, tooltipHeight: number, tooltipWidth: number, offset: number) => {
        const { top, left, width, height } = anchorElRect
        let topPos: number, leftPos: number, arrowPos: string;

        switch (placement) {
            case 'top':
                topPos = top - height - offset;
                leftPos = left + width / 2 - tooltipWidth / 2;
                arrowPos = 'bottom';
                if (topPos < 0) {
                    topPos = top + height + offset;
                    arrowPos = 'top';
                }
                if(leftPos + tooltipWidth > window.innerWidth) {
                    leftPos = leftPos - (window.innerWidth - leftPos) + width;
                    setArrowPosition({left: tooltipWidth - (offset * 2)})
                }
                if(leftPos < 0) {
                    leftPos = 0 + (offset / 2)
                }
                break;
            case 'bottom':
                topPos = top + height + offset;
                leftPos = left + width / 2 - tooltipWidth / 2;
                arrowPos = 'top';
                if (topPos + tooltipHeight > window.innerHeight) {
                    topPos = top - tooltipHeight - offset;
                    arrowPos = 'bottom';
                }
                if(leftPos + tooltipWidth > window.innerWidth) {
                    leftPos = leftPos - (window.innerWidth - leftPos) + width
                    setArrowPosition({left: tooltipWidth - (offset * 2)})
                }
                if(leftPos < 0) {
                    leftPos = 0 + (offset / 2);
                    setArrowPosition({right: tooltipWidth - (offset * 2)})
                }
                break;
            case 'left':
                topPos = top + (height / 2) + offset;
                leftPos = left - tooltipWidth - offset;
                arrowPos = 'right';
                if (leftPos < 0) {
                    leftPos = left + tooltipWidth + offset;
                    arrowPos = 'left';
                }
                break;
            case 'right':
                topPos = top + (height / 2) + offset
                leftPos = left + tooltipWidth + offset;
                arrowPos = 'left';
                if (leftPos + tooltipWidth > window.innerWidth) {
                    leftPos = left - tooltipWidth - offset;
                    arrowPos = 'right';
                }
                break;
            default:
                topPos = top - tooltipHeight - offset;
                leftPos = left + width / 2 - tooltipWidth / 2;
        }

        return ({topPos, leftPos, arrowPos})
    }

    useEffect(() => {
        calculatePosition();
        window.addEventListener('resize', calculatePosition);
        const observer = new MutationObserver(handleMouseLeave);
        if (anchorElRef.current) {
            const anchorElement = anchorElRef.current instanceof HTMLElement ? anchorElRef.current : anchorElRef.current.base;
            observer.observe(anchorElement, { attributes: true, childList: true, subtree: true });
        }

        return () => {
            window.removeEventListener('resize', calculatePosition);
            observer.disconnect()
        };
    }, [showTooltip, placement]);

    const childrenProps = {
        ...children?.props,
        ref: anchorElRef,
        onmouseenter: handleMouseEnter,
        onmouseleave: handleMouseLeave,
    }

    return (
        <Fragment>
            {cloneElement(children, childrenProps)}
            {showTooltip ? <TooltipPopper placement={placement} arrow={arrow} content={content} open={showTooltip} tooltipRef={tooltipRef} position={position} customArrowPosition={arrowPosition} /> : null}
        </Fragment>
    )
}

const getTooltipClassName = (position: { arrowPlacement: any; }) => {
    return `MinervaTooltip-arrow MinervaTooltip-arrow-${position.arrowPlacement}`
}


function TooltipPopper({ placement, arrow, content, open, tooltipRef, position, customArrowPosition }) {
    return (
        <CustomPortal fallbackContent={content}>
            <div className={`MinervaTooltip-content MinervaFadeInAnimation MinervaTooltip-position-${placement} ${arrow ? getTooltipClassName(position) : ''}`}
                style={{ display: open ? null : 'none',
                    top: position.top,
                    left: position.left,
                    '--custom-arrow--left-position' : customArrowPosition?.left ? customArrowPosition?.left + 'px' : '',
                    '--custom-arrow--right-position' : customArrowPosition?.right ? customArrowPosition?.right + 'px' : '',
                    '--duration': '200ms',
                    '--delay': '100ms',
                    '--fill-mode': 'forwards',
                    margin: 0,
                    border: 0
                }}

                    ref={tooltipRef}>
                <span>{content}</span>
            </div>
        </CustomPortal>
    )
}

function CustomPortal({ children, fallbackContent }) {
    const element = document.getElementById('temp-portal')
    if (element) {
        return createPortal(children, element)
    } else {
        return fallbackContent
    }
}