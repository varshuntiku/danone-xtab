import React from 'react';
import '../../diagnoseme.css';

export default function ImagesLayout({ imgData }) {
    const [image, imgStyle] = imgData;
    return (
        <div>
            <img src={image} className={imgStyle} />
        </div>
    );
}
