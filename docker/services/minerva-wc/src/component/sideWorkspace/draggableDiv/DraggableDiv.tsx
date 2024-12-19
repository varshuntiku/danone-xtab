import { MutableRef, useLayoutEffect, useRef } from "preact/hooks";

export default function DraggableDiv({dragHandleRef, minimumSize=0, maximumSize=Number.MAX_SAFE_INTEGER, children, ...props}) {
    const containerRef: MutableRef<HTMLDivElement> = useRef();

    function makeResizableDiv(div: HTMLDivElement) {
        const element = div;

        let original_width = 0;
        let original_mouse_x = 0;

        const currentResizer = dragHandleRef.current
        currentResizer.addEventListener("mousedown", function (e: MouseEvent) {
            e.preventDefault();
            original_width = parseFloat(
                getComputedStyle(element, null)
                .getPropertyValue("width")
                .replace("px", "")
            );
            original_mouse_x = e.pageX;
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResize);
        });

        function resize(e: MouseEvent) {
                const width = original_width - (e.pageX - original_mouse_x);
                if (width > minimumSize && width < maximumSize) {
                    element.style.width = width + "px";
                }
        }

        function stopResize() {
            window.removeEventListener("mousemove", resize);
        }

    }

    useLayoutEffect(() => {
        makeResizableDiv(containerRef.current);
    }, []);
    return <div {...props} ref={containerRef}>
        {children}
    </div>
}