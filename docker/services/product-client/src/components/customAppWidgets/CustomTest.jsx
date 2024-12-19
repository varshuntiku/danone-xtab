import React from 'react';

export default function CustomTest({ params }) {
    return <h2 style={{ color: '#fff' }}>{params?.message}</h2>;
}
