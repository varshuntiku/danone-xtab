import React from 'react';
import { useDnD } from './DnDContext';

const SideBarMenu = ({ params }) => {
    const { menuOptions, title } = params;
    const [_, setType] = useDnD();
    console.log(_);

    const onDragStart = (event, nodeType) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            {title ? <div className="description">{title}</div> : null}
            {menuOptions && menuOptions.length > 0 ? (
                menuOptions.map((option) => {
                    return (
                        <>
                            <div
                                className="dndnode"
                                onDragStart={(event) => onDragStart(event, option)}
                                draggable
                            >
                                {option.headingText}
                            </div>
                        </>
                    );
                })
            ) : (
                <div className="description">No options available!</div>
            )}
        </aside>
    );
};

export default SideBarMenu;
