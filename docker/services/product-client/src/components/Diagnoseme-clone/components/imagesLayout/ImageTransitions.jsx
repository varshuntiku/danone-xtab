import '../../diagnoseme.css';
import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

export default function ImageTransitions({ imgData }) {
    const [image, isTrans, transType, imgStyle] = imgData;
    const [boxVisible, setBoxVisible] = useState(false);
    useEffect(() => {
        setBoxVisible(isTrans);
    }, []);

    return (
        <div>
            <CSSTransition
                in={boxVisible}
                mountOnEnter
                unmountOnExit
                timeout={4000}
                classNames={transType}
            >
                <img src={image} className={imgStyle} />
            </CSSTransition>
        </div>
    );
}
