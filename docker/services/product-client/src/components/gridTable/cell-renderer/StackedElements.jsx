import React from 'react';

export default function StackElements({ params }) {
    if (params.value) {
        if (params.value instanceof Array) {
            return params.value.map((el, i) => (
                <span key={i} style={{ display: 'block' }}>
                    {el}
                </span>
            ));
        } else {
            return params.value;
        }
    } else {
        return null;
    }
}
