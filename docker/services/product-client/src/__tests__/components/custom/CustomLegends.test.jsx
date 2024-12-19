import CustomLegends from '../../../components/custom/CustomLegends';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render CustomLegends  Component when no legends', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomLegends>
                        <div></div>
                    </CustomLegends>
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render CustomLegends  Component when list of legends available', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomLegends {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render CustomLegends  Component when list of legends available 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomLegends {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render CustomLegends  Component when list of legends available 2', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomLegends {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render CustomLegends  Component when list of legends available 3', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomLegends {...Props3} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    const Props = {
        isVertical: true,
        alignRight: true,
        legends: [
            { label: ' 100% Available', color: '#3CFF33' },
            { label: '90% Available', color: '#FF7D33' },
            { label: 'Unavailable', color: '#BDBDBC' }
        ]
    };
    const Props1 = {
        isVertical: false,
        alignRight: false,
        legends: [
            { label: ' 100% Available', color: '#3CFF33' },
            { label: '90% Available', color: '#FF7D33' },
            { label: 'Unavailable', color: '#BDBDBC' }
        ]
    };

    const Props2 = {
        props: {
            alignment: 'middle-right',
            textSize: '',
            textColor: '',
            legendSize: '',
            isVertical: true,
            backgroundColor: '#111'
        },
        legends: [
            {
                label: 'legend 1',
                color: 'blue',
                shape: 'square'
            },
            {
                label: 'legend 2',
                color: 'red',
                shape: 'circle'
            },
            {
                label: 'legend 3',
                color: 'green',
                shape: 'line'
            }
        ]
    };
    const Props3 = {
        props: {
            alignment: 'top-center',
            textSize: '2rem',
            textColor: '#fff',
            legendSize: '1rem',
            isVertical: false,
            backgroundColor: ''
        },
        legends: [
            {
                label: 'legend 1',
                color: 'blue',
                shape: ''
            },
            {
                label: 'legend 2',
                color: 'green',
                shape: 'line'
            }
        ]
    };
});
