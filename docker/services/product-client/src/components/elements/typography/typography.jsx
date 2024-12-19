import React from 'react';
import { Typography as MaterialTypography } from '@material-ui/core';

const BASE_VARIANTS = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'button',
    'caption',
    'overline'
];

const Typography = ({ variant, component, children, ...props }) => {
    const typographyProps = props;
    typographyProps['data-variant'] = variant;
    if (BASE_VARIANTS.includes(variant)) {
        typographyProps.variant = variant;
    } else {
        typographyProps.component = 'span';
    }

    if (component) {
        typographyProps.component = component;
    }

    return <MaterialTypography {...typographyProps}>{children}</MaterialTypography>;
};

export default Typography;
