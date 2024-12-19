import { useLayoutEffect, useRef } from "preact/hooks";
import "./resizable.scss";
export default function Resizable({ className, children }) {
    const resizableDiv = useRef();
    function makeResizableDiv(div) {
        const element = div;
        const resizers = element.querySelectorAll(".MinervaResizer");
        const minimum_size = 20;
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        let original_mouse_x = 0;
        let original_mouse_y = 0;
        for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener("mousedown", function (e) {
            e.preventDefault();
            original_width = parseFloat(
            getComputedStyle(element, null)
                .getPropertyValue("width")
                .replace("px", "")
            );
            original_height = parseFloat(
            getComputedStyle(element, null)
                .getPropertyValue("height")
                .replace("px", "")
            );
            original_x = element.getBoundingClientRect().left;
            original_y = element.getBoundingClientRect().top;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResize);
        });

        function resize(e) {
            if (currentResizer.classList.contains("MinervaResizer-right")) {
            const width = original_width + (e.pageX - original_mouse_x);

            if (width > minimum_size) {
                element.style.width = width + "px";
            }
            } else if (currentResizer.classList.contains("MinervaResizer-left")) {
            const width = original_width - (e.pageX - original_mouse_x);
            if (width > minimum_size) {
                element.style.width = width + "px";
                element.style.left =
                original_x + (e.pageX - original_mouse_x) + "px";
            }
            } else if (currentResizer.classList.contains("MinervaResizer-top")) {
            const height = original_height - (e.pageY - original_mouse_y);
            if (height > minimum_size) {
                element.style.height = height + "px";
                element.style.top =
                original_y + (e.pageY - original_mouse_y) + "px";
            }
            } else if (currentResizer.classList.contains("MinervaResizer-bottom")) {
            const height = original_height + (e.pageY - original_mouse_y);
            if (height > minimum_size) {
                element.style.height = height + "px";
            }
            }
        }

        function stopResize() {
            window.removeEventListener("mousemove", resize);
        }
        }
    }

    useLayoutEffect(() => {
        makeResizableDiv(resizableDiv.current);
    }, [])
    return (
        <div className={`MinervaResizable ${className}`} ref={resizableDiv}>
            <div className='MinervaResizers'>
                <div className='MinervaResizer MinervaResizer-top'></div>
                <div className='MinervaResizer MinervaResizer-right'></div>
                <div className='MinervaResizer MinervaResizer-bottom'></div>
                <div className='MinervaResizer MinervaResizer-left'></div>
            </div>
            {children}
        </div>
    )
}
