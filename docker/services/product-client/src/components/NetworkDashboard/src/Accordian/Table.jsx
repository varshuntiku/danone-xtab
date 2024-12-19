import React from 'react';
import Accordion from './Accordion';

export const categories = [
    {
        label: 'manufactures',
        child: ['Ath', 'name2', 'name3']
    },
    {
        label: 'Trade',
        child: ['name1', 'name2', 'name3']
    },
    {
        label: 'Insures',
        child: ['name1', 'name2', 'name3']
    },
    {
        label: 'Providers',
        child: ['name1', 'name2', 'name3']
    },
    {
        label: 'Ath',
        child: ['name1', 'name2', 'name3']
    }
];
export default function Table() {
    return (
        <>
            {categories.map((el, i) => (
                <Accordion key={'accordion' + i} data={{ label: el.label, typo: el.child }} />
            ))}
        </>
    );
}
