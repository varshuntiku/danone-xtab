import { useEffect, useLayoutEffect, useRef } from "preact/hooks";
import "./popover.scss";
type PopoverType = {
    open: boolean;
    anchorEle?: HTMLElement;
    suppressAnchoring?: Boolean;
    fullscreen?: boolean;
    anchorPosition?: {
        top: number,
        left: number,
    } | null;
    anchorOrigin?: {
        vertical: "top" | "center" | "bottom",
        horizontal: "left" | "center" | "right"
    };
    transformOrigin?: {
        vertical: "top" | "center" | "bottom",
        horizontal: "left" | "center" | "right"
    },
    onClose?: Function,
    className?: string,
    loadContentOnOpen?: boolean,
    children?: any,
    id?: string
}
export default function Popover({
    open = false,
    anchorEle = null,
    fullscreen=false,
    suppressAnchoring = null,
    anchorPosition = null,
    anchorOrigin={vertical: "top", horizontal: "left"},
    transformOrigin={vertical: "top", horizontal: "left"},
    onClose=() => {},
    className="",
    loadContentOnOpen=false,
    children,
    id=""}: PopoverType) {

	const dialog = useRef<HTMLDialogElement>();

    function getAnchorPosition() {
        const rect = anchorEle.getBoundingClientRect();
        let top = 0;
        let left = 0;
        if (anchorOrigin.vertical == 'top') {
            top = rect.top;
        } else if (anchorOrigin.vertical == 'center') {
            top = rect.top + (rect.height / 2);
        } else if (anchorOrigin.vertical == 'bottom') {
            top = rect.top + rect.height;
        }
        if (anchorOrigin.horizontal == 'left') {
            left = rect.left;
        } else if (anchorOrigin.horizontal == 'center') {
            left = rect.left + (rect.width / 2);
        } else if (anchorOrigin.horizontal == 'right') {
            left = rect.left + rect.width;
        }
        return {top, left}
    }

    function getTransformValues() {
        const rect = dialog.current.getBoundingClientRect();
        let x = 0;
        let y = 0;
        if (transformOrigin.vertical == 'top') {
            y = 0;
        } else if (transformOrigin.vertical == 'center') {
            y = rect.height / 2;
        } else if (transformOrigin.vertical == 'bottom') {
            y = rect.height;
        }
        if (transformOrigin.horizontal == 'left') {
            x = 0;
        } else if (transformOrigin.horizontal == 'center') {
            x = rect.width / 2;
        } else if (transformOrigin.horizontal == 'right') {
            x = rect.width;
        }
        return {x, y}
    }

    function setPosition() {
        if (fullscreen) {
            dialog.current.style.removeProperty('top');
            dialog.current.style.removeProperty('left');
            dialog.current.style.removeProperty('transform-origin');
            dialog.current.style.removeProperty('transform');
            return;
        }
        const transformValues = getTransformValues();
        let top = 0;
        let left = 0;
        if (anchorPosition) {
            top = anchorPosition.top;
            left = anchorPosition.left;
        } else {
            const anchorPosition = getAnchorPosition()
            top = anchorPosition.top - transformValues.y;
            left = anchorPosition.left - transformValues.x;
        }

        dialog.current.style.setProperty('top', Math.max(top, 0)+"px");
        dialog.current.style.setProperty('left', Math.max(left, 0)+"px");
        dialog.current.style.setProperty('transform-origin', `${transformValues.x}px ${transformValues.y}px`);
        dialog.current.style.setProperty('transform', `unset`);
    }

    useLayoutEffect(() => {
        let t;
        if (dialog.current && anchorEle && open && !suppressAnchoring) {
            t = setTimeout(() => {
                setPosition();
            }, 50);
        }
        return () => {
            clearTimeout(t);
        }
    }, [anchorEle, open, suppressAnchoring, children, fullscreen]);

    useEffect(() => {
        onresize = () => {
            if (dialog.current && anchorEle && open && !suppressAnchoring) {
                setPosition();
            }
        };

        if (anchorEle) {
            anchorEle.addEventListener("resize", onresize);
        }

        return () => {
            if (anchorEle) {
                anchorEle.removeEventListener("resize", onresize);
            }
        }
    }, [anchorEle, suppressAnchoring, children, open])

    useEffect(() => {
        if (open && dialog.current?.showModal) {
            dialog.current.showModal()
        } else if (dialog.current?.close) {
            dialog.current?.close()
        }
    }, [open])

    return <dialog className={"MinervaPopover " + (fullscreen? "MinervaPopover-fullscreen" : "") + " " + className} ref={dialog} onClick={(e) =>{
        if (e.target == dialog.current) {
            onClose()
        }
    }} aria-label="popover" id={id}>
        {loadContentOnOpen ? (open ? children : null ) : children}
    </dialog>
}