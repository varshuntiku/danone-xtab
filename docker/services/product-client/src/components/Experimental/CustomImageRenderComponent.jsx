import React from 'react';

const CustomImageRenderComponent = ({ params }) => {
    const {
        src = '' || default_src,
        default_src = '',
        alt = 'Image',
        title = '',
        width = 'auto',
        height = 'auto',
        style
    } = params;

    const isBase64 = /^data:image\/.+;base64/.test(src);

    return (
        <img
            src={isBase64 ? src : encodeURI(src)}
            alt={alt}
            title={title}
            style={style}
            width={width}
            height={height}
        />
    );
};

export default CustomImageRenderComponent;
